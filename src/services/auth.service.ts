import type { HydratedDocument } from "mongoose";
import { UserModel, type IUser, type IUserMethods } from "../models/user.model.js";
import { ConflictError, UnauthorizedError } from "../utils/errors.js";

type UserDoc = HydratedDocument<IUser, IUserMethods>;

interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SafeUser {
  _id: string;
  email: string;
  name: string;
  createdAt?: Date;
}

function toSafeUser(user: UserDoc): SafeUser {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput): Promise<SafeUser> {
  const existing = await UserModel.findOne({ email: input.email }).lean();
  if (existing) throw new ConflictError("Email already registered");

  const user = await UserModel.create(input);
  return toSafeUser(user);
}

export async function loginUser(input: LoginInput): Promise<SafeUser> {
  const user = await UserModel.findOne({ email: input.email }).select("+password");
  if (!user) throw new UnauthorizedError("Invalid email or password");

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) throw new UnauthorizedError("Invalid email or password");

  return toSafeUser(user);
}
