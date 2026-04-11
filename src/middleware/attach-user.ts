import type { Request, Response, NextFunction } from "express";
import { User } from "../models/index.js";

let cachedUser: { id: number; email: string; name: string } | null = null;

export const attachUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!cachedUser) {
      const user = await User.findOne({
        attributes: ["id", "email", "name"],
        raw: true,
      });

      if (user) {
        cachedUser = user as unknown as { id: number; email: string; name: string };
      }
    }

    if (cachedUser) {
      req.user = cachedUser;
    }

    next();
  } catch (error) {
    next(error);
  }
};
