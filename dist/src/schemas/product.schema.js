import { z } from "zod";
export const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        price: z
            .number()
            .positive("Price must be positive")
            .min(0.01, "Price must be greater than 0"),
        description: z.string().optional(),
    }),
});
export const updateProductSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").optional(),
        price: z.number().positive("Price must be positive").optional(),
        description: z.string().optional(),
    }),
    params: z.object({
        id: z.string().min(1, "Product ID is required"),
    }),
});
export const productIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Product ID is required"),
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