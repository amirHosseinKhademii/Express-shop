export class AppError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, "VALIDATION_ERROR");
        this.details = details;
    }
}
export class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404, "NOT_FOUND");
        this.resource = resource;
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, "UNAUTHORIZED");
    }
}
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403, "FORBIDDEN");
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, "CONFLICT");
    }
}
//# sourceMappingURL=errors.js.map