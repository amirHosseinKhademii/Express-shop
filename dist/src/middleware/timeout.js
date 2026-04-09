export const requestTimeout = (ms = 10000) => {
    return (req, res, next) => {
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
//# sourceMappingURL=timeout.js.map