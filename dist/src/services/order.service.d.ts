import type { Request } from "express";
import type { OrderInstance } from "../types/express.js";
type User = NonNullable<Request["user"]>;
interface OrderInput {
    productId: number;
    quantity: number;
}
export declare function createOrder(user: User, items: OrderInput[]): Promise<OrderInstance | null>;
export declare function createOrderFromCart(user: User): Promise<OrderInstance | null>;
export declare function getUserOrders(user: User, options: {
    limit: number;
    offset: number;
}): Promise<{
    rows: OrderInstance[];
    count: number;
}>;
export declare function getOrderById(userId: number, orderId: number): Promise<OrderInstance>;
export {};
//# sourceMappingURL=order.service.d.ts.map