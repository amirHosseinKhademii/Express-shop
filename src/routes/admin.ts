import { Router } from "express";
import { handleValidation } from "../middleware/validate-request.js";
import {
  createProductRules,
  updateProductRules,
  productIdParamRules,
} from "../schemas/product.schema.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/admin.controller.js";

const router = Router();

router.post("/products", createProductRules, handleValidation, addProduct);

router.put(
  "/products/:id",
  updateProductRules,
  handleValidation,
  updateProduct,
);

router.delete(
  "/products/:id",
  productIdParamRules,
  handleValidation,
  deleteProduct,
);

export { router as adminRoutes };
