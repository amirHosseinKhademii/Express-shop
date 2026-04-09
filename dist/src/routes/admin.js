import { Router } from "express";
const router = Router();
router.get("/add-product", (req, res) => {
    try {
        // Must include the /api prefix (and any mount path). A bare `/admin/...` misses `app.use("/api", ...)`.
        const action = `${req.baseUrl}/add-product`;
        res.send(`<form action="${action}" method="POST"><input type="text" name="title"><input type="number" name="price"><button type="submit">Add Product</button></form>`);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/add-product", (req, res) => {
    try {
        console.log({ body: req.body });
        res.json({ message: "Hello user" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
export { router as adminRoutes };
//# sourceMappingURL=admin.js.map