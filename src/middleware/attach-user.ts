import type { Request, Response, NextFunction } from "express";
import type { Model } from "sequelize";
import { User } from "../models/index.js";

let cachedUser: Model | null = null;

export const attachUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!cachedUser) {
      const user = await User.findOne({
        attributes: ["id", "email", "name"],
      });

      if (user) {
        cachedUser = user;
      }
    }

    if (cachedUser) {
      req.user = cachedUser as Request["user"];
    }

    next();
  } catch (error) {
    next(error);
  }
};
