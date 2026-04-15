import crypto from "node:crypto";
import type { HydratedDocument } from "mongoose";
import {
  UserModel,
  type IUser,
  type IUserMethods,
} from "../models/user.model.js";
import { ConflictError, UnauthorizedError, ValidationError } from "../utils/errors.js";

type UserDoc = HydratedDocument<IUser, IUserMethods>;

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ResetPasswordInput {
  token: string;
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

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
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

export async function forgotPassword(email: string): Promise<string> {
  const user = await UserModel.findOne({ email });

  if (!user) {
    // Return a dummy token shape so the response is always the same,
    // preventing email enumeration via timing or response differences.
    return "noop";
  }

  const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
  user.resetToken = hashToken(rawToken);
  user.resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
  await user.save({ validateModifiedOnly: true });

  // In production, send rawToken via email instead of returning it.
  // Returning here for dev/testing convenience.
  return rawToken;
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const hashed = hashToken(input.token);

  const user = await UserModel.findOne({
    resetToken: hashed,
    resetTokenExpiresAt: { $gt: new Date() },
  }).select("+password +resetToken +resetTokenExpiresAt");

  if (!user) throw new ValidationError("Reset token is invalid or has expired");

  user.password = input.password;
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();
}
