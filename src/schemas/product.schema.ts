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
  body: z.object({
    productId: z
      .number({
        required_error: "Product ID is required",
        invalid_type_error: "Product ID must be a number",
      })
      .int("Product ID must be a whole number")
      .positive("Product ID must be a positive integer"),
    quantity: z
      .number({ invalid_type_error: "Quantity must be a number" })
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(999, "Quantity cannot exceed 999")
      .optional()
      .default(1),
  }),
});
