import crypto from "node:crypto";
export const requestLogger = (req, res, next) => {
    req.requestId = crypto.randomUUID();
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
};
//# sourceMappingURL=request-logger.js.map