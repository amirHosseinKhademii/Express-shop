import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { UnauthorizedError } from "../utils/errors.js";
import { User } from "../models/index.js";

interface JWTPayload {
  id: number;
  email: string;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;

    const user = await User.findByPk(payload.id, {
      attributes: ["id", "email", "name"],
    });

    if (!user) throw new UnauthorizedError("User no longer exists");

    req.user = user as Request["user"];
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    next(new UnauthorizedError("Invalid token"));
  }
};
