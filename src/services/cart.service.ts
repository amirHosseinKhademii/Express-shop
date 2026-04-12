import type { Request } from "express";
import type {
  CartInstance,
  CartItemInstance,
  ProductInstance,
} from "../types/express.js";
import { Product, Cart, CartItem } from "../models/index.js";
import { NotFoundError } from "../utils/errors.js";

type User = NonNullable<Request["user"]>;

const CART_INCLUDE = [
  {
    model: Product,
    as: "items" as const,
    attributes: ["id", "title", "price"],
    through: { attributes: ["quantity"] },
  },
];

export async function getOrCreateCart(user: User): Promise<CartInstance> {
  const cart = await user.getCart();
  if (cart) return cart;
  return user.createCart();
}

export async function loadCartWithItems(
  cart: CartInstance,
): Promise<CartInstance | null> {
  return Cart.findByPk(cart.id, { include: CART_INCLUDE }) as Promise<CartInstance | null>;
}

export async function addItemToCart(
  user: User,
  cart: CartInstance,
  productId: number,
  quantity: number,
): Promise<CartInstance | null> {
  const owns = await user.hasProduct(productId);
  if (!owns) throw new NotFoundError("Product");

  const [item, created] = await CartItem.findOrCreate({
    where: { cartId: cart.id, productId },
    defaults: { quantity },
  });

  if (!created) {
    const cartItem = item as unknown as CartItemInstance;
    await cartItem.update({ quantity: cartItem.quantity + quantity });
  }

  return loadCartWithItems(cart);
}

export async function removeItemFromCart(
  cart: CartInstance,
  productId: number,
  quantity: number,
): Promise<CartInstance | null> {
  const item = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });
  if (!item) throw new NotFoundError("Cart item");

  const cartItem = item as unknown as CartItemInstance;
  const newQty = cartItem.quantity - quantity;

  if (newQty <= 0) {
    await cartItem.destroy();
  } else {
    await cartItem.update({ quantity: newQty });
  }

  return loadCartWithItems(cart);
}
