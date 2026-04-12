import type { Request } from "express";
import type { ProductInstance } from "../types/express.js";
import type { WithId, Document } from "mongodb";
import { ObjectId } from "mongodb";
import { Product } from "../models/index.js";
import { sequelize } from "../database/sequelize.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { pickDefined } from "../utils/pick-defined.js";
import { mdb } from "../database/mongodb.js";

type User = NonNullable<Request["user"]>;

export const PRODUCT_ATTRIBUTES = [
  "id",
  "title",
  "price",
  "description",
] as const;

const ALLOWED_FIELDS = ["title", "price", "description"] as const;
const RESPONSE_ATTRIBUTES = [
  "id",
  "userId",
  "title",
  "price",
  "description",
  "createdAt",
  "updatedAt",
] as const;

export async function getUserProducts(
  user: User,
  options: { limit: number; offset: number },
): Promise<{ rows: ProductInstance[]; count: number }> {
  const [rows, count] = await Promise.all([
    user.getProducts({
      attributes: [...PRODUCT_ATTRIBUTES],
      order: [["id", "ASC"]],
      limit: options.limit,
      offset: options.offset,
    }),
    user.countProducts(),
  ]);
  return { rows, count };
}

export async function getUserProductById(
  user: User,
  productId: number,
): Promise<ProductInstance> {
  const owns = await user.hasProduct(productId);
  if (!owns) throw new NotFoundError("Product");

  const product = await Product.findByPk(productId, {
    attributes: [...PRODUCT_ATTRIBUTES],
    raw: true,
  });
  if (!product) throw new NotFoundError("Product");
  return product as unknown as ProductInstance;
}

export async function createProduct(
  user: User,
  body: Record<string, unknown>,
): Promise<ProductInstance> {
  const fields = pickDefined(body, ALLOWED_FIELDS);

  const created = await user.createProduct(fields, {
    fields: [...ALLOWED_FIELDS],
  });

  const plain = await Product.findByPk(created.id, {
    attributes: [...RESPONSE_ATTRIBUTES],
    raw: true,
  });
  if (!plain) throw new NotFoundError("Product");
  return plain as unknown as ProductInstance;
}

async function findOwnedProduct(
  user: User,
  productId: number,
): Promise<ProductInstance> {
  const owns = await user.hasProduct(productId);
  if (!owns) throw new ForbiddenError("You can only modify your own products");

  const product = await Product.findByPk(productId, {
    rejectOnEmpty: new NotFoundError("Product"),
  });

  return product as unknown as ProductInstance;
}

export async function updateProduct(
  user: User,
  productId: number,
  body: Record<string, unknown>,
): Promise<ProductInstance> {
  const product = await findOwnedProduct(user, productId);
  const fields = pickDefined(body, ALLOWED_FIELDS);

  if (Object.keys(fields).length > 0) {
    await product.update(fields, { fields: [...ALLOWED_FIELDS] });
  }

  const plain = await Product.findByPk(productId, {
    attributes: [...RESPONSE_ATTRIBUTES],
    raw: true,
  });
  if (!plain) throw new NotFoundError("Product");
  return plain as unknown as ProductInstance;
}

export async function deleteProduct(
  user: User,
  productId: number,
): Promise<void> {
  const product = await findOwnedProduct(user, productId);

  await sequelize.transaction(async (t) => {
    await product.destroy({ transaction: t });
  });
}
// ─── MongoDB (native driver) ─────────────────────────────────────

interface ProductDoc {
  userId: number;
  title: string;
  price: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const products = () => mdb.collection<ProductDoc>("products");

const PRODUCT_PROJECTION = {
  _id: 1,
  userId: 1,
  title: 1,
  price: 1,
  description: 1,
  createdAt: 1,
  updatedAt: 1,
} as const;

export async function getUserProductsMdb(
  user: User,
  options: { limit: number; offset: number },
) {
  const filter = { userId: user.id };

  const [rows, count] = await Promise.all([
    products()
      .find(filter, { projection: PRODUCT_PROJECTION })
      .sort({ _id: 1 })
      .skip(options.offset)
      .limit(options.limit)
      .toArray(),
    products().countDocuments(filter),
  ]);

  return { rows, count };
}

export async function getUserProductByIdMdb(
  user: User,
  productId: string,
) {
  const product = await products().findOne(
    { _id: new ObjectId(productId), userId: user.id },
    { projection: PRODUCT_PROJECTION },
  );
  if (!product) throw new NotFoundError("Product");
  return product;
}

export async function createProductMdb(
  user: User,
  body: Record<string, unknown>,
) {
  const fields = pickDefined(body, ALLOWED_FIELDS);
  const now = new Date();

  const doc: ProductDoc = {
    userId: user.id,
    title: fields.title as string,
    price: fields.price as number,
    description: (fields.description as string) ?? null,
    createdAt: now,
    updatedAt: now,
  };

  const result = await products().insertOne(doc);

  return { _id: result.insertedId, ...doc };
}

export async function updateProductMdb(
  user: User,
  productId: string,
  body: Record<string, unknown>,
) {
  const fields = pickDefined(body, ALLOWED_FIELDS);

  if (Object.keys(fields).length === 0) {
    return getUserProductByIdMdb(user, productId);
  }

  const result = await products().findOneAndUpdate(
    { _id: new ObjectId(productId), userId: user.id },
    { $set: { ...fields, updatedAt: new Date() } },
    { returnDocument: "after", projection: PRODUCT_PROJECTION },
  );

  if (!result) throw new NotFoundError("Product");
  return result;
}

export async function deleteProductMdb(
  user: User,
  productId: string,
) {
  const result = await products().findOneAndDelete(
    { _id: new ObjectId(productId), userId: user.id },
  );
  if (!result) throw new NotFoundError("Product");
}
