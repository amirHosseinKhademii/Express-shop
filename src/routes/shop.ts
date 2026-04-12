import { Router } from "express";
import { validateRequest } from "../middleware/validate-request.js";
import {
  productIdParamSchema,
  addProductToCartSchema,
  removeProductFromCartSchema,
} from "../schemas/product.schema.js";
import {
  getProducts,
  getProductById,
  getCart,
  addProductToCart,
  removeProductFromCart,
} from "../controllers/shop.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/cart", getCart);

router.get("/:id", validateRequest(productIdParamSchema), getProductById);

router.post("/cart", validateRequest(addProductToCartSchema), addProductToCart);

router.delete(
  "/cart",
  validateRequest(removeProductFromCartSchema),
  removeProductFromCart,
);

export { router as shopRoutes };
