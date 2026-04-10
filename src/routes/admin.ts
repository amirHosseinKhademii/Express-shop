import { Router } from "express";
import { validateRequest } from "../middleware/validate-request.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
} from "../schemas/product.schema.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/admin.controller.js";

const router = Router();

router.post("/products", validateRequest(createProductSchema), addProduct);
router.put("/products/:id", validateRequest(updateProductSchema), updateProduct);
router.delete("/products/:id", validateRequest(productIdParamSchema), deleteProduct);

export { router as adminRoutes };
