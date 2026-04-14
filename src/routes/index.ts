import { Router } from "express";
import { adminRoutes } from "./admin.js";
import { shopRoutes } from "./shop.js";
import { getHealth } from "../controllers/health.controller.js";
import { authRoutes } from "./auth.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/health", getHealth);

router.use("/auth", authRoutes);

router.use("/admin", requireAuth, adminRoutes);

router.use("/shop", requireAuth, shopRoutes);

export default router;
