import type { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/errors.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      code: err.code,
      message: err.message,
      ...(err instanceof ValidationError && err.details
        ? { details: err.details }
        : {}),
    });
    return;
  }

  console.error("Unhandled error:", err);

  const message =
    process.env["NODE_ENV"] === "production"
      ? "An unexpected error occurred"
      : err.message;

  res.status(500).json({
    status: "error",
    code: "INTERNAL_ERROR",
    message,
  });
};
