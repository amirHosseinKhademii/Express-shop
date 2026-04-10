import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => {
    try {
        res.json({ message: "Hello admin" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
export { router as adminRoutes };
//# sourceMappingURL=admin.js.map