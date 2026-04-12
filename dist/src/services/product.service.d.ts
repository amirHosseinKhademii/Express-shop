import type { Request } from "express";
import type { Model } from "sequelize";
export declare const PRODUCT_ATTRIBUTES: readonly ["id", "title", "price", "description"];
export declare function getUserProducts(user: NonNullable<Request["user"]>, options: {
    limit: number;
    offset: number;
}): Promise<{
    rows: Model[];
    count: number;
}>;
export declare function getUserProductById(userId: number, productId: number): Promise<Model>;
export declare function createProduct(user: NonNullable<Request["user"]>, body: Record<string, unknown>): Promise<Model | null>;
export declare function updateProduct(userId: number, productId: number, body: Record<string, unknown>): Promise<Model | null>;
export declare function deleteProduct(userId: number, productId: number): Promise<void>;
//# sourceMappingURL=product.service.d.ts.map