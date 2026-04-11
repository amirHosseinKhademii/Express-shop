import { Router } from "express";
import { adminRoutes } from "./admin.js";
import { shopRoutes } from "./shop.js";
import { getHealth } from "../controllers/health.controller.js";
const router = Router();
router.get("/health", getHealth);
router.use("/admin", adminRoutes);
router.use("/shop", shopRoutes);
export default router;
//# sourceMappingURL=index.js.map