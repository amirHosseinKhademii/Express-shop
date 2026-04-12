import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../utils/errors.js";

function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }
  return fieldErrors;
}

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fields = flattenZodErrors(error);
        const messages = Object.entries(fields)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join("; ");
        next(new ValidationError(messages, Object.entries(fields).map(([field, message]) => ({ field, message }))));
        return;
      }
      next(error);
    }
  };
};
