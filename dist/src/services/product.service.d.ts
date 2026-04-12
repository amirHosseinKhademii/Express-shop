import type { Request } from "express";
import type { ProductInstance } from "../types/express.js";
type User = NonNullable<Request["user"]>;
export declare const PRODUCT_ATTRIBUTES: readonly ["id", "title", "price", "description"];
export declare function getUserProducts(user: User, options: {
    limit: number;
    offset: number;
}): Promise<{
    rows: ProductInstance[];
    count: number;
}>;
export declare function getUserProductById(user: User, productId: number): Promise<ProductInstance>;
export declare function createProduct(user: User, body: Record<string, unknown>): Promise<ProductInstance>;
export declare function updateProduct(user: User, productId: number, body: Record<string, unknown>): Promise<ProductInstance>;
export declare function deleteProduct(user: User, productId: number): Promise<void>;
export {};
//# sourceMappingURL=product.service.d.ts.map