import type { Request } from "express";
import type { ProductInstance } from "../types/express.js";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
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
interface ProductDoc {
    userId: number;
    title: string;
    price: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare function getUserProductsMdb(user: User, options: {
    limit: number;
    offset: number;
}): Promise<{
    rows: WithId<ProductDoc>[];
    count: number;
}>;
export declare function getUserProductByIdMdb(user: User, productId: string): Promise<WithId<ProductDoc>>;
export declare function createProductMdb(user: User, body: Record<string, unknown>): Promise<{
    userId: number;
    title: string;
    price: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _id: ObjectId;
}>;
export declare function updateProductMdb(user: User, productId: string, body: Record<string, unknown>): Promise<WithId<ProductDoc>>;
export declare function deleteProductMdb(user: User, productId: string): Promise<void>;
export {};
//# sourceMappingURL=product.service.d.ts.map