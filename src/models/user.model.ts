// import { sequelize } from "../database/sequelize.js";
// import { DataTypes } from "sequelize";
import { Schema, model, type Model, Types } from "mongoose";
import { CartItemSchema, type ICartItem } from "./cart.model.js";

// ─── Sequelize (commented out) ────────────────────────────────
// export const User = sequelize.define("user", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true,
//     },
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//       len: [3, 30],
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

export interface PopulatedCartItem {
  productId: { _id: Types.ObjectId; title: string; price: number; description?: string | null } | null;
  quantity: number;
}

export interface IUserMethods {
  getCart(): Promise<PopulatedCartItem[]>;
  clearCart(): Promise<IUser>;
  addToCart(productId: string, quantity: number): Promise<IUser>;
  removeFromCart(productId: string, quantity: number): Promise<IUser>;
}

export interface IUser {
  email: string;
  name: string;
  cart: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<
  IUser,
  Model<IUser, object, IUserMethods>,
  IUserMethods
>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    cart: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

UserSchema.methods.getCart = async function (): Promise<PopulatedCartItem[]> {
  await this.populate("cart.productId", "title price description");
  return (this.cart as unknown as PopulatedCartItem[]) ?? [];
};

UserSchema.methods.clearCart = function () {
  this.cart = [];
  return this.save();
};

UserSchema.methods.addToCart = function (productId: string, quantity: number) {
  const pid = new Types.ObjectId(productId);
  const existing = this.cart.find(
    (item: ICartItem) => item.productId.equals(pid),
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    this.cart.push({ productId: pid, quantity });
  }

  return this.save();
};

UserSchema.methods.removeFromCart = function (
  productId: string,
  quantity: number,
) {
  const pid = new Types.ObjectId(productId);
  const existing = this.cart.find(
    (item: ICartItem) => item.productId.equals(pid),
  );

  if (existing) {
    const newQty = existing.quantity - quantity;
    if (newQty <= 0) {
      this.cart = this.cart.filter(
        (item: ICartItem) => !item.productId.equals(pid),
      );
    } else {
      existing.quantity = newQty;
    }
  }

  return this.save();
};

export const UserModel = model<IUser, Model<IUser, object, IUserMethods>>(
  "User",
  UserSchema,
);
