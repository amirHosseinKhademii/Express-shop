const isProduction = () => process.env["NODE_ENV"] === "production";
export const ApiResponse = {
    success(res, data, message, statusCode = 200) {
        const body = {
            status: "success",
            requestId: res.req.requestId,
            data,
        };
        if (message)
            body.message = message;
        return res.status(statusCode).json(body);
    },
    created(res, data, message) {
        return ApiResponse.success(res, data, message, 201);
    },
    noContent(res) {
        return res.status(204).send();
    },
    error(res, code, message, statusCode = 500, details, error) {
        const body = {
            status: "error",
            requestId: res.req.requestId,
            code,
            message,
        };
        if (details)
            body.details = details;
        if (!isProduction() && error?.stack)
            body.stack = error.stack;
        return res.status(statusCode).json(body);
    },
    paginated(res, data, page, limit, total) {
        const body = {
            status: "success",
            requestId: res.req.requestId,
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
        return res.json(body);
    },
};
//# sourceMappingURL=response.js.map