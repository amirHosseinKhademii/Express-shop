import { Router } from "express";
import { validateRequest } from "../middleware/validate-request.js";
import {
  productIdParamSchema,
  addProductToCartSchema,
  removeProductFromCartSchema,
  createOrderSchema,
  orderIdParamSchema,
} from "../schemas/product.schema.js";
import {
  getProducts,
  getProductById,
  getCart,
  addProductToCart,
  removeProductFromCart,
  createOrder,
  getOrders,
  getOrder,
} from "../controllers/shop.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/cart", getCart);
router.post("/cart", validateRequest(addProductToCartSchema), addProductToCart);
router.delete(
  "/cart",
  validateRequest(removeProductFromCartSchema),
  removeProductFromCart,
);

router.get("/orders", getOrders);
router.post("/orders", validateRequest(createOrderSchema), createOrder);
router.get("/orders/:id", validateRequest(orderIdParamSchema), getOrder);

router.get("/:id", validateRequest(productIdParamSchema), getProductById);

export { router as shopRoutes };
