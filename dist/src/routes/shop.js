import { Router } from "express";
import { validateRequest } from "../middleware/validate-request.js";
import { productIdParamSchema, addProductToCartSchema, } from "../schemas/product.schema.js";
import { getProducts, getProductById, addProductToCart, getCart, } from "../controllers/shop.controller.js";
const router = Router();
router.get("/", getProducts);
router.get("/cart", getCart);
router.get("/:id", validateRequest(productIdParamSchema), getProductById);
router.post("/cart/:cartId", validateRequest(addProductToCartSchema), addProductToCart);
export { router as shopRoutes };
//# sourceMappingURL=shop.js.map