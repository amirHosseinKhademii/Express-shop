import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";
import {
  registerUser,
  loginUser,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from "../services/auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    ApiResponse.created(res, user, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await loginUser(req.body);

    req.session.userId = user._id;

    ApiResponse.success(res, user, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      ApiResponse.success(res, null, "Logged out successfully");
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const resetToken = await forgotPasswordService(req.body.email);

    // In production, the token goes via email — never in the response.
    // Included here under a dev flag for testing convenience.
    const isDev = process.env["NODE_ENV"] !== "production";

    ApiResponse.success(
      res,
      isDev ? { resetToken } : null,
      "If that email is registered, a reset link has been sent",
    );
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await resetPasswordService(req.body);
    ApiResponse.success(res, null, "Password has been reset successfully");
  } catch (error) {
    next(error);
  }
};
