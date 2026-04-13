import type { Request, Response, NextFunction } from "express";
import { mdb } from "../database/mongodb.js";

type User = NonNullable<Request["user"]>;

let cachedUser: User | null = null;

export const attachUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!cachedUser) {
      const collection = mdb.collection<User>("users");

      const user = await collection.findOne(
        {},
        { projection: { _id: 1, id: 1, email: 1, name: 1, cart: 1 } },
      );

      if (user) {
        if (!user.cart) user.cart = [];
        cachedUser = user;
      } else {
        const seed: Omit<User, "_id"> = {
          id: "default",
          email: "test@test.com",
          name: "Test User",
          cart: [],
        };
        const { insertedId } = await collection.insertOne(seed as User);
        cachedUser = { _id: insertedId, ...seed };
      }
    }

    req.user = cachedUser;

    next();
  } catch (error) {
    next(error);
  }
};
