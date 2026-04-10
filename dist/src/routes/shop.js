import { Router } from "express";
import { getProducts, addProduct } from "../controllers/shop.controller.js";
const router = Router();
router.get("/", getProducts);
router.post("/add-product", addProduct);
export { router as shopRoutes };
//# sourceMappingURL=shop.js.map