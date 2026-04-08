import type { Request, Response, NextFunction } from "express";

export const requestTimeout = (ms: number = 10_000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.setTimeout(ms, () => {
      if (!res.headersSent) {
        res.status(503).json({
          status: "error",
          code: "REQUEST_TIMEOUT",
          message: "Request timed out — downstream service may be slow",
        });
      }
    });
    next();
  };
};
