import { Router } from "express";
import { adminRoutes } from "./admin.js";
import { shopRoutes } from "./shop.js";
const router = Router();
router.get("/health", (_req, res) => {
    const { heapUsed, heapTotal, rss } = process.memoryUsage();
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: { heapUsed, heapTotal, rss },
    });
});
router.use("/admin", adminRoutes);
router.use("/shop", shopRoutes);
export default router;
//# sourceMappingURL=index.js.map