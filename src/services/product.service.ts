import type { Request } from "express";
import type { Model } from "sequelize";
import { Product } from "../models/index.js";
import { sequelize } from "../utils/sequelize.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { pickDefined } from "../utils/pick-defined.js";

export const PRODUCT_ATTRIBUTES = ["id", "title", "price", "description"] as const;

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
  user: NonNullable<Request["user"]>,
  options: { limit: number; offset: number },
): Promise<{ rows: Model[]; count: number }> {
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
  userId: number,
  productId: number,
): Promise<Model> {
  const product = await Product.findOne({
    attributes: [...PRODUCT_ATTRIBUTES],
    where: { id: productId, userId },
    raw: true,
  });
  if (!product) throw new NotFoundError("Product");
  return product;
}

export async function createProduct(
  user: NonNullable<Request["user"]>,
  body: Record<string, unknown>,
): Promise<Model | null> {
  const fields = pickDefined(body, ALLOWED_FIELDS);

  const created = await user.createProduct(fields, {
    fields: [...ALLOWED_FIELDS],
  });

  return Product.findByPk(created.get("id") as number, {
    attributes: [...RESPONSE_ATTRIBUTES],
    raw: true,
  });
}

async function findOwnedProduct(userId: number, productId: number): Promise<Model> {
  const product = await Product.findOne({
    where: { id: productId },
    rejectOnEmpty: new NotFoundError("Product"),
  });

  if (product.get("userId") !== userId) {
    throw new ForbiddenError("You can only modify your own products");
  }

  return product;
}

export async function updateProduct(
  userId: number,
  productId: number,
  body: Record<string, unknown>,
): Promise<Model | null> {
  const product = await findOwnedProduct(userId, productId);
  const fields = pickDefined(body, ALLOWED_FIELDS);

  if (Object.keys(fields).length > 0) {
    await product.update(fields, { fields: [...ALLOWED_FIELDS] });
  }

  return Product.findByPk(productId, {
    attributes: [...RESPONSE_ATTRIBUTES],
    raw: true,
  });
}

export async function deleteProduct(
  userId: number,
  productId: number,
): Promise<void> {
  const product = await findOwnedProduct(userId, productId);

  await sequelize.transaction(async (t) => {
    await product.destroy({ transaction: t });
  });
}
