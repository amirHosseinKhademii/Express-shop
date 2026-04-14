import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }
  next();
};
