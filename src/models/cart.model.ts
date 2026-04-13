// import { sequelize } from "../database/sequelize.js";
// import { DataTypes } from "sequelize";
import { Schema, model, Types } from "mongoose";

// ─── Sequelize (commented out) ────────────────────────────────
// export const Cart = sequelize.define("cart", {
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
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
// });

// ─── Mongoose ─────────────────────────────────────────────────
// Note: cart is embedded on the user document, so this standalone
// model is only needed if you move to a separate carts collection.

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

export const CartModel = model<ICart>("Cart", CartSchema);
