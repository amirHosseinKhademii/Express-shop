import { Router, type Request, type Response } from "express";

const router = Router();

router.post("/add-product", (req: Request, res: Response): void => {
  try {
    console.log({ body: req.body });
    res.json({ message: "Hello user" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as adminRoutes };
