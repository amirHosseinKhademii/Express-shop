// import { DataTypes } from "sequelize";
// import { sequelize } from "../database/sequelize.js";

// ─── Sequelize (commented out) ────────────────────────────────
// export const Order = sequelize.define("order", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     field: "user_id",
//     references: {
//       model: "users",
//       key: "id",
//     },
//   },
// });

// ─── Mongoose ─────────────────────────────────────────────────

import { Schema, model, Types } from "mongoose";
import { CartItemSchema } from "./cart.model.js";

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  userId: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: { type: [CartItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
