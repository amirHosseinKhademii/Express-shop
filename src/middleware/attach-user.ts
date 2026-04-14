import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { UserModel } from "../models/user.model.js";

export const attachUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.session?.userId;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return next();
    }

    const user = await UserModel.findById(userId);
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
};
