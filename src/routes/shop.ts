import { Router } from "express";
import { validateRequest } from "../middleware/validate-request.js";
import { productIdParamSchema } from "../schemas/product.schema.js";
import { getProducts, getProductById } from "../controllers/shop.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", validateRequest(productIdParamSchema), getProductById);

export { router as shopRoutes };
