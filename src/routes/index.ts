import { Router } from "express";
import { adminRoutes } from "./admin.js";
import { shopRoutes } from "./shop.js";
import { getHealth } from "../controllers/health.controller.js";
import { authRoutes } from "./auth.js";

const router = Router();

router.get("/health", getHealth);

router.use("/admin", adminRoutes);

router.use("/shop", shopRoutes);

router.use("/auth", authRoutes);

export default router;
