// import { sequelize } from "../database/sequelize.js";
// import { DataTypes } from "sequelize";
import { Schema, model, type Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import { CartItemSchema, type ICartItem } from "./cart.model.js";

const SALT_ROUNDS = 12;

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
  comparePassword(candidate: string): Promise<boolean>;
  getCart(): Promise<PopulatedCartItem[]>;
  clearCart(): Promise<IUser>;
  addToCart(productId: string, quantity: number): Promise<IUser>;
  removeFromCart(productId: string, quantity: number): Promise<IUser>;
}

export interface IUser {
  email: string;
  name: string;
  password: string;
  resetToken?: string;
  resetTokenExpiresAt?: Date;
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
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, minlength: 3, maxlength: 30, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpiresAt: { type: Date, select: false },
    cart: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

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
