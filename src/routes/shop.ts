import { Router, type Request, type Response } from "express";

const router = Router();

const products: { title: string; price: number }[] = [];

router.get("/", (_req: Request, res: Response): void => {
  try {
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/add-product", (req: Request, res: Response): void => {
  try {
    console.log({ body: req.body });
    products.push(req.body);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as shopRoutes };
