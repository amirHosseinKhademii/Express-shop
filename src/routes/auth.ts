import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate-request.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateToken } from "../middleware/csrf.js";

const router = Router();

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: generateToken(req) });
});

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

export { router as authRoutes };
