import type { Request } from "express";
import type { CartInstance } from "../types/express.js";
type User = NonNullable<Request["user"]>;
export declare function getOrCreateCart(user: User): Promise<CartInstance>;
export declare function loadCartWithItems(cart: CartInstance): Promise<CartInstance | null>;
export declare function addItemToCart(user: User, cart: CartInstance, productId: number, quantity: number): Promise<CartInstance | null>;
export declare function removeItemFromCart(cart: CartInstance, productId: number, quantity: number): Promise<CartInstance | null>;
export {};
//# sourceMappingURL=cart.service.d.ts.map