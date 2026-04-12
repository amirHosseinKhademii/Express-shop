import type { Request } from "express";
import type { Model } from "sequelize";
import { Product, Cart, CartItem } from "../models/index.js";
import { NotFoundError } from "../utils/errors.js";

const CART_INCLUDE = [
  {
    model: Product,
    as: "items" as const,
    attributes: ["id", "title", "price"],
    through: { attributes: ["quantity"] },
  },
];

export async function getOrCreateCart(
  user: NonNullable<Request["user"]>,
): Promise<Model> {
  const cart = await user.getCart();
  if (cart) return cart;
  return user.createCart();
}

export async function loadCartWithItems(
  cart: Model,
): Promise<Model | null> {
  return Cart.findByPk(cart.get("id") as number, { include: CART_INCLUDE });
}

export async function addItemToCart(
  cart: Model,
  productId: number,
  quantity: number,
): Promise<Model | null> {
  const product = await Product.findByPk(productId);
  if (!product) throw new NotFoundError("Product");

  const cartId = cart.get("id") as number;

  const [item, created] = await CartItem.findOrCreate({
    where: { cartId, productId },
    defaults: { quantity },
  });

  if (!created) {
    await item.update({ quantity: (item.get("quantity") as number) + quantity });
  }

  return loadCartWithItems(cart);
}

export async function removeItemFromCart(
  cart: Model,
  productId: number,
  quantity: number,
): Promise<Model | null> {
  const cartId = cart.get("id") as number;

  const item = await CartItem.findOne({ where: { cartId, productId } });
  if (!item) throw new NotFoundError("Cart item");

  const currentQty = item.get("quantity") as number;
  const newQty = currentQty - quantity;

  if (newQty <= 0) {
    await item.destroy();
  } else {
    await item.update({ quantity: newQty });
  }

  return loadCartWithItems(cart);
}
