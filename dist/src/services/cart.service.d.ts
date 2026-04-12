import type { Request } from "express";
import type { Model } from "sequelize";
export declare function getOrCreateCart(user: NonNullable<Request["user"]>): Promise<Model>;
export declare function loadCartWithItems(cart: Model): Promise<Model | null>;
export declare function addItemToCart(cart: Model, productId: number, quantity: number): Promise<Model | null>;
export declare function removeItemFromCart(cart: Model, productId: number, quantity: number): Promise<Model | null>;
//# sourceMappingURL=cart.service.d.ts.map