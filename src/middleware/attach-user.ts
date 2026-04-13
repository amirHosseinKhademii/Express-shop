import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model.js";
import type { UserDoc } from "../types/express.js";

let cachedUser: UserDoc | null = null;

export const attachUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!cachedUser) {
      const user = await UserModel.findOne().lean(false);

      if (user) {
        cachedUser = user;
      } else {
        cachedUser = await UserModel.create({
          email: "test@test.com",
          name: "Test User",
          cart: [],
        });
      }
    }

    req.user = cachedUser;

    next();
  } catch (error) {
    next(error);
  }
};
