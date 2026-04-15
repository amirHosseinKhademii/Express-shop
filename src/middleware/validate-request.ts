import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../utils/errors.js";

export const handleValidation = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.type === "field" ? err.path : err.type,
      message: err.msg as string,
    }));

    const message = details.map((d) => `${d.field}: ${d.message}`).join("; ");
    return next(new ValidationError(message, details));
  }

  next();
};
