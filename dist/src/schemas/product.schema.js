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
const coerceInt = (fieldName) => z.preprocess((val) => (val === undefined || val === null ? undefined : Number(val)), z
    .number({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a valid number`,
})
    .int(`${fieldName} must be a whole number`));
const cartItemBodySchema = z.object({
    productId: coerceInt("Product ID").pipe(z.number().positive("Product ID must be a positive integer")),
    quantity: z.preprocess((val) => (val === undefined || val === null ? undefined : Number(val)), z
        .number({ invalid_type_error: "Quantity must be a valid number" })
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .max(999, "Quantity cannot exceed 999")
        .optional()
        .default(1)),
});
export const addProductToCartSchema = z.object({ body: cartItemBodySchema });
export const removeProductFromCartSchema = z.object({
    body: cartItemBodySchema,
});
const orderItemSchema = z.object({
    productId: coerceInt("Product ID").pipe(z.number().positive("Product ID must be a positive integer")),
    quantity: z.preprocess((val) => (val === undefined || val === null ? undefined : Number(val)), z
        .number({ invalid_type_error: "Quantity must be a valid number" })
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .max(999, "Quantity cannot exceed 999")
        .optional()
        .default(1)),
});
const fromCartBody = z.object({
    fromCart: z.literal(true),
    items: z.undefined({ invalid_type_error: "Items are not needed when ordering from cart" }).optional(),
});
const fromItemsBody = z.object({
    fromCart: z.literal(false).optional().default(false),
    items: z
        .array(orderItemSchema, {
        required_error: "Items array is required",
        invalid_type_error: "Items must be an array",
    })
        .min(1, "Order must contain at least one item")
        .max(50, "Order cannot exceed 50 items"),
});
export const createOrderSchema = z.object({
    body: z.union([fromCartBody, fromItemsBody], {
        errorMap: () => ({ message: "Provide items array or set fromCart to true" }),
    }),
});
export const orderIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Order ID is required"),
    }),
});
//# sourceMappingURL=product.schema.js.map