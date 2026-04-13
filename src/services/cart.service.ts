import type { Request } from "express";
import { ProductModel } from "../models/product.model.js";
import type { PopulatedCartItem } from "../models/user.model.js";
import { NotFoundError } from "../utils/errors.js";
import { toObjectId } from "../utils/parse-id.js";

type User = NonNullable<Request["user"]>;

// ─── Mongoose cart services (cart embedded on user) ──────────

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: PopulatedCartItem["productId"];
}

export async function getCartMdb(user: User): Promise<CartItemWithProduct[]> {
  const items = await user.getCart();

  return items.map((item) => ({
    productId: item.productId?._id?.toString() ?? "",
    quantity: item.quantity,
    product: item.productId ?? null,
  }));
}

export async function addItemToCartMdb(
  user: User,
  productId: string,
): Promise<CartItemWithProduct[]> {
  const pid = toObjectId(productId, "Product");

  const existing = (user.cart ?? []).find(
    (item) => item.productId.equals(pid),
  );

  if (!existing) {
    const exists = await ProductModel.exists({ _id: pid });
    if (!exists) throw new NotFoundError("Product");
  }

  await user.addToCart(productId, 1);
  return getCartMdb(user);
}

export async function removeItemFromCartMdb(
  user: User,
  productId: string,
  quantity: number,
): Promise<CartItemWithProduct[]> {
  const pid = toObjectId(productId, "Product");

  const existing = (user.cart ?? []).find(
    (item) => item.productId.equals(pid),
  );
  if (!existing) throw new NotFoundError("Cart item");

  await user.removeFromCart(productId, quantity);
  return getCartMdb(user);
}

export async function clearCartMdb(user: User): Promise<void> {
  await user.clearCart();
}

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
