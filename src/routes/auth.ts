import { Router } from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPasswordHandler,
} from "../controllers/auth.controller.js";
import { handleValidation } from "../middleware/validate-request.js";
import {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
} from "../schemas/auth.schema.js";
import { generateToken } from "../middleware/csrf.js";

const router = Router();

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: generateToken(req) });
});

router.post("/register", registerRules, handleValidation, register);
router.post("/login", loginRules, handleValidation, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordRules, handleValidation, forgotPassword);
router.post("/reset-password", resetPasswordRules, handleValidation, resetPasswordHandler);

export { router as authRoutes };
