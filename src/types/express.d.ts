import type { HydratedDocument, Types } from "mongoose";
import type { IUser, IUserMethods } from "../models/user.model.js";
import type { IProduct } from "../models/product.model.js";
import type { IOrder } from "../models/order.model.js";
import type { ICartItem } from "../models/cart.model.js";

// ─── Mongoose document types ─────────────────────────────────

type UserDoc = HydratedDocument<IUser, IUserMethods>;
type ProductDoc = HydratedDocument<IProduct>;
type OrderDoc = HydratedDocument<IOrder>;

// ─── Express augmentation ────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
      requestId?: string;
    }
  }
}

export type { UserDoc, ProductDoc, OrderDoc, ICartItem };
