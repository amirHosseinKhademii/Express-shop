import type { Request } from "express";
// import type {
//   CartInstance,
//   CartItemInstance,
//   ProductInstance,
// } from "../types/express.js";
// import { Product, Cart, CartItem } from "../models/index.js";
import { ObjectId } from "mongodb";
import { mdb } from "../database/mongodb.js";
import { NotFoundError } from "../utils/errors.js";
import { toObjectId } from "../utils/parse-id.js";

type User = NonNullable<Request["user"]>;
type CartItemDoc = User["cart"][number];

// ─── Sequelize (commented out) ────────────────────────────────

// const CART_INCLUDE = [
//   {
//     model: Product,
//     as: "items" as const,
//     attributes: ["id", "title", "price"],
//     through: { attributes: ["quantity"] },
//   },
// ];

// export async function getOrCreateCart(user: User): Promise<CartInstance> {
//   const cart = await user.getCart();
//   if (cart) return cart;
//   return user.createCart();
// }

// export async function loadCartWithItems(
//   cart: CartInstance,
// ): Promise<CartInstance | null> {
//   return Cart.findByPk(cart.id, {
//     include: CART_INCLUDE,
//   }) as Promise<CartInstance | null>;
// }

// export async function addItemToCart(
//   user: User,
//   cart: CartInstance,
//   productId: number,
//   quantity: number,
// ): Promise<CartInstance | null> {
//   const owns = await user.hasProduct(productId);
//   if (!owns) throw new NotFoundError("Product");
//
//   const [item, created] = await CartItem.findOrCreate({
//     where: { cartId: cart.id, productId },
//     defaults: { quantity },
//   });
//
//   if (!created) {
//     const cartItem = item as unknown as CartItemInstance;
//     await cartItem.update({ quantity: cartItem.quantity + quantity });
//   }
//
//   return loadCartWithItems(cart);
// }

// export async function removeItemFromCart(
//   cart: CartInstance,
//   productId: number,
//   quantity: number,
// ): Promise<CartInstance | null> {
//   const item = await CartItem.findOne({
//     where: { cartId: cart.id, productId },
//   });
//   if (!item) throw new NotFoundError("Cart item");
//
//   const cartItem = item as unknown as CartItemInstance;
//   const newQty = cartItem.quantity - quantity;
//
//   if (newQty <= 0) {
//     await cartItem.destroy();
//   } else {
//     await cartItem.update({ quantity: newQty });
//   }
//
//   return loadCartWithItems(cart);
// }

// ─── MongoDB (native driver) — cart embedded on user ─────────

interface ProductDoc {
  title: string;
  price: number;
  description: string | null;
}

const users = () => mdb.collection<User>("users");
const products = () => mdb.collection<ProductDoc>("products");

function updatedCart(
  result: import("mongodb").WithId<User> | null,
): CartItemDoc[] {
  return result?.cart ?? [];
}

interface CartItemWithProduct {
  productId: import("mongodb").ObjectId;
  quantity: number;
  product: {
    _id: import("mongodb").ObjectId;
    title: string;
    price: number;
    description: string | null;
  } | null;
}

export async function getCartMdb(user: User): Promise<CartItemWithProduct[]> {
  const doc = await users().findOne(
    { _id: user._id },
    { projection: { cart: 1 } },
  );
  const items = doc?.cart ?? [];
  if (items.length === 0) return [];

  const pids = items.map((i) => i.productId);
  const productDocs = await products()
    .find(
      { _id: { $in: pids } },
      { projection: { _id: 1, title: 1, price: 1, description: 1 } },
    )
    .toArray();

  const productMap = new Map(
    productDocs.map((p) => [p._id.toString(), p]),
  );

  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    product: productMap.get(item.productId.toString()) ?? null,
  }));
}

export async function addItemToCartMdb(
  user: User,
  productId: string,
): Promise<CartItemDoc[]> {
  const pid = toObjectId(productId, "Product");

  const existing = (user.cart ?? []).find(
    (item) => item.productId.toString() === productId,
  );

  if (existing) {
    const result = await users().findOneAndUpdate(
      { _id: user._id, "cart.productId": pid },
      { $inc: { "cart.$.quantity": 1 } },
      { returnDocument: "after", projection: { cart: 1 } },
    );
    return updatedCart(result);
  }

  const exists = await products().countDocuments({ _id: pid }, { limit: 1 });
  if (!exists) throw new NotFoundError("Product");

  const item: CartItemDoc = {
    productId: pid,
    quantity: 1,
  };

  const result = await users().findOneAndUpdate(
    { _id: user._id },
    { $push: { cart: item } },
    { returnDocument: "after", projection: { cart: 1 } },
  );
  return updatedCart(result);
}

export async function removeItemFromCartMdb(
  user: User,
  productId: string,
  quantity: number,
): Promise<CartItemDoc[]> {
  const pid = toObjectId(productId, "Product");

  const existing = (user.cart ?? []).find(
    (item) => item.productId.toString() === productId,
  );
  if (!existing) throw new NotFoundError("Cart item");

  const newQty = existing.quantity - quantity;

  if (newQty <= 0) {
    const result = await users().findOneAndUpdate(
      { _id: user._id },
      { $pull: { cart: { productId: pid } } },
      { returnDocument: "after", projection: { cart: 1 } },
    );
    return updatedCart(result);
  }

  const result = await users().findOneAndUpdate(
    { _id: user._id, "cart.productId": pid },
    { $set: { "cart.$.quantity": newQty } },
    { returnDocument: "after", projection: { cart: 1 } },
  );
  return updatedCart(result);
}

export async function clearCartMdb(user: User): Promise<void> {
  await users().updateOne({ _id: user._id }, { $set: { cart: [] } });
}
