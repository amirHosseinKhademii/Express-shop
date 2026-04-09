import { Router } from "express";
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
export default router;
//# sourceMappingURL=index.js.map