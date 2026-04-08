import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  req.requestId = crypto.randomUUID();
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
};
