// import { sequelize } from "../database/sequelize.js";
// import { DataTypes } from "sequelize";
import { Schema, model, Types } from "mongoose";

// ─── Sequelize (commented out) ────────────────────────────────
// export const Product = sequelize.define("product", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
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
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: DataTypes.DOUBLE,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true,
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

export interface IProduct {
  userId: Types.ObjectId;
  title: string;
  price: number;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: null },
  },
  { timestamps: true },
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
