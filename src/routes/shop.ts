import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response): void => {
  try {
    res.json({ message: "Hello shop" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as shopRoutes };
