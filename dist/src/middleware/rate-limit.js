import rateLimit from "express-rate-limit";
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: "error", code: "RATE_LIMIT", message: "Too many requests, try again later" },
});
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { status: "error", code: "RATE_LIMIT", message: "Too many auth attempts, try again later" },
});
//# sourceMappingURL=rate-limit.js.map