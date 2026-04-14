import { csrfSync } from "csrf-sync";
import type { Request } from "express";

export const {
  csrfSynchronisedProtection,
  generateToken,
} = csrfSync({
  getTokenFromRequest: (req: Request) =>
    req.headers["x-csrf-token"] as string ?? req.body?.csrfToken,
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});
