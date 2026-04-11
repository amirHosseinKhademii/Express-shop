import { z } from "zod";
export const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        price: z.number().positive("Price must be positive"),
    }),
});
export const updateProductSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").optional(),
        price: z.number().positive("Price must be positive").optional(),
    }),
    params: z.object({
        id: z.string().uuid("Invalid product ID"),
    }),
});
export const productIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid product ID"),
    }),
});
export const addProductToCartSchema = z.object({
    params: z.object({
        cartId: z.string().uuid("Invalid cart ID"),
    }),
    body: z.object({
        productId: z.string().uuid("Invalid product ID"),
    }),
});
//# sourceMappingURL=product.schema.js.map