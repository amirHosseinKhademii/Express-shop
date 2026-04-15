import { Router } from "express";
import { handleValidation } from "../middleware/validate-request.js";
import {
  productIdParamRules,
  addProductToCartRules,
  removeProductFromCartRules,
  createOrderRules,
  orderIdParamRules,
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
router.post("/cart", addProductToCartRules, handleValidation, addProductToCart);
router.delete(
  "/cart",
  removeProductFromCartRules,
  handleValidation,
  removeProductFromCart,
);

router.get("/orders", getOrders);
router.post("/orders", createOrderRules, handleValidation, createOrder);
router.get("/orders/:id", orderIdParamRules, handleValidation, getOrder);

router.get("/:id", productIdParamRules, handleValidation, getProductById);

export { router as shopRoutes };
