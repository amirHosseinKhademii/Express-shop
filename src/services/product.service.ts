import type { Request } from "express";
import type { HydratedDocument } from "mongoose";
import { ProductModel, type IProduct } from "../models/product.model.js";
import { NotFoundError } from "../utils/errors.js";
import { toObjectId } from "../utils/parse-id.js";
import { pickDefined } from "../utils/pick-defined.js";

type User = NonNullable<Request["user"]>;
type ProductDoc = HydratedDocument<IProduct>;

const ALLOWED_FIELDS = ["title", "price", "description"] as const;
const LEAN_PROJECTION = "title price description userId createdAt updatedAt";

// ─── Mongoose services ───────────────────────────────────────

export async function getUserProductsMdb(
  user: User,
  options: { limit: number; offset: number },
): Promise<{ rows: IProduct[]; count: number }> {
  const filter = { userId: user._id };

  const [rows, count] = await Promise.all([
    ProductModel.find(filter)
      .select(LEAN_PROJECTION)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(options.offset)
      .limit(options.limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return { rows, count };
}

export async function getUserProductByIdMdb(
  user: User,
  productId: string,
): Promise<IProduct> {
  const pid = toObjectId(productId, "Product");
  const product = await ProductModel.findOne({ _id: pid, userId: user._id })
    .select(LEAN_PROJECTION)
    .populate("userId", "name email")
    .lean();
  if (!product) throw new NotFoundError("Product");
  return product;
}

export async function createProductMdb(
  user: User,
  body: Record<string, unknown>,
): Promise<ProductDoc> {
  const fields = pickDefined(body, ALLOWED_FIELDS);
  return ProductModel.create({ ...fields, userId: user._id });
}

export async function updateProductMdb(
  user: User,
  productId: string,
  body: Record<string, unknown>,
): Promise<IProduct> {
  const pid = toObjectId(productId, "Product");
  const fields = pickDefined(body, ALLOWED_FIELDS);

  if (Object.keys(fields).length === 0) {
    return getUserProductByIdMdb(user, productId);
  }

  const product = await ProductModel.findOneAndUpdate(
    { _id: pid, userId: user._id },
    { $set: fields },
    { new: true, runValidators: true },
  )
    .select(LEAN_PROJECTION)
    .populate("userId", "name email")
    .lean();

  if (!product) throw new NotFoundError("Product");
  return product;
}

export async function deleteProductMdb(
  user: User,
  productId: string,
): Promise<void> {
  const pid = toObjectId(productId, "Product");
  const product = await ProductModel.findOneAndDelete({
    _id: pid,
    userId: user._id,
  });
  if (!product) throw new NotFoundError("Product");
}

// const RESPONSE_ATTRIBUTES = [
//   "id",
//   "userId",
//   "title",
//   "price",
//   "description",
//   "createdAt",
//   "updatedAt",
// ] as const;
// export async function getUserProducts(
//   user: User,
//   options: { limit: number; offset: number },
// ): Promise<{ rows: ProductInstance[]; count: number }> {
//   const [rows, count] = await Promise.all([
//     user.getProducts({
//       attributes: [...PRODUCT_ATTRIBUTES],
//       order: [["id", "ASC"]],
//       limit: options.limit,
//       offset: options.offset,
//     }),
//     user.countProducts(),
//   ]);
//   return { rows, count };
// }

// export async function getUserProductById(
//   user: User,
//   productId: number,
// ): Promise<ProductInstance> {
//   const owns = await user.hasProduct(productId);
//   if (!owns) throw new NotFoundError("Product");

//   const product = await Product.findByPk(productId, {
//     attributes: [...PRODUCT_ATTRIBUTES],
//     raw: true,
//   });
//   if (!product) throw new NotFoundError("Product");
//   return product as unknown as ProductInstance;
// }

// export async function createProduct(
//   user: User,
//   body: Record<string, unknown>,
// ): Promise<ProductInstance> {
//   const fields = pickDefined(body, ALLOWED_FIELDS);

//   const created = await user.createProduct(fields, {
//     fields: [...ALLOWED_FIELDS],
//   });

//   const plain = await Product.findByPk(created.id, {
//     attributes: [...RESPONSE_ATTRIBUTES],
//     raw: true,
//   });
//   if (!plain) throw new NotFoundError("Product");
//   return plain as unknown as ProductInstance;
// }

// async function findOwnedProduct(
//   user: User,
//   productId: number,
// ): Promise<ProductInstance> {
//   const owns = await user.hasProduct(productId);
//   if (!owns) throw new ForbiddenError("You can only modify your own products");

//   const product = await Product.findByPk(productId, {
//     rejectOnEmpty: new NotFoundError("Product"),
//   });

//   return product as unknown as ProductInstance;
// }

// export async function updateProduct(
//   user: User,
//   productId: number,
//   body: Record<string, unknown>,
// ): Promise<ProductInstance> {
//   const product = await findOwnedProduct(user, productId);
//   const fields = pickDefined(body, ALLOWED_FIELDS);

//   if (Object.keys(fields).length > 0) {
//     await product.update(fields, { fields: [...ALLOWED_FIELDS] });
//   }

//   const plain = await Product.findByPk(productId, {
//     attributes: [...RESPONSE_ATTRIBUTES],
//     raw: true,
//   });
//   if (!plain) throw new NotFoundError("Product");
//   return plain as unknown as ProductInstance;
// }

// export async function deleteProduct(
//   user: User,
//   productId: number,
// ): Promise<void> {
//   const product = await findOwnedProduct(user, productId);

//   await sequelize.transaction(async (t) => {
//     await product.destroy({ transaction: t });
//   });
// }
// ─── MongoDB (native driver) ─────────────────────────────────────
