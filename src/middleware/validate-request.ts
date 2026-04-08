import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../utils/errors.js";

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError("Validation failed", error.errors));
        return;
      }
      next(error);
    }
  };
};
