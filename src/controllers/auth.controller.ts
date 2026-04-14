import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";
import { registerUser, loginUser } from "../services/auth.service.js";

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
