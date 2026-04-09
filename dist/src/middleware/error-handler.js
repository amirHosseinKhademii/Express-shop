import { AppError, NotFoundError, ValidationError } from "../utils/errors.js";
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: "error",
            code: err.code,
            message: err.message,
            ...(err instanceof ValidationError && err.details
                ? { details: err.details }
                : {}),
            ...(err instanceof NotFoundError ? { resource: err.resource } : {}),
        });
        return;
    }
    console.error("Unhandled error:", err);
    const message = process.env["NODE_ENV"] === "production"
        ? "An unexpected error occurred"
        : err.message;
    res.status(500).json({
        status: "error",
        code: "INTERNAL_ERROR",
        message,
    });
};
//# sourceMappingURL=error-handler.js.map