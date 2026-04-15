import { checkSchema } from "express-validator";

const passwordField = {
  isString: { errorMessage: "Password is required" },
  isLength: {
    options: { min: 8, max: 128 },
    errorMessage: "Password must be 8-128 characters",
  },
  matches: {
    options: /[A-Z]/,
    errorMessage: "Password must contain at least one uppercase letter",
  },
  custom: {
    options: (value: string) => /[a-z]/.test(value) && /[0-9]/.test(value),
    errorMessage: "Password must contain at least one lowercase letter and one number",
  },
};

export const registerRules = checkSchema({
  email: {
    in: ["body"],
    trim: true,
    toLowerCase: true,
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid email format" },
    isLength: { options: { max: 255 }, errorMessage: "Email must be at most 255 characters" },
  },
  name: {
    in: ["body"],
    trim: true,
    notEmpty: { errorMessage: "Name is required" },
    isLength: { options: { min: 3, max: 30 }, errorMessage: "Name must be 3-30 characters" },
  },
  password: { in: ["body"], ...passwordField },
});

export const loginRules = checkSchema({
  email: {
    in: ["body"],
    trim: true,
    toLowerCase: true,
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid email format" },
  },
  password: {
    in: ["body"],
    notEmpty: { errorMessage: "Password is required" },
  },
});

export const forgotPasswordRules = checkSchema({
  email: {
    in: ["body"],
    trim: true,
    toLowerCase: true,
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid email format" },
  },
});

export const resetPasswordRules = checkSchema({
  token: {
    in: ["body"],
    notEmpty: { errorMessage: "Reset token is required" },
  },
  password: { in: ["body"], ...passwordField },
});
