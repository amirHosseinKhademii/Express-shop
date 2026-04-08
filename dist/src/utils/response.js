export const ApiResponse = {
    success(res, data, message, statusCode = 200) {
        const body = { status: "success", data };
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
    error(res, code, message, statusCode = 500, details) {
        const body = { status: "error", code, message };
        if (details)
            body.details = details;
        return res.status(statusCode).json(body);
    },
    paginated(res, data, page, limit, total) {
        const body = {
            status: "success",
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