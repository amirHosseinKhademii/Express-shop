export const getHealth = (_req, res) => {
    const { heapUsed, heapTotal, rss } = process.memoryUsage();
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: { heapUsed, heapTotal, rss },
    });
};
//# sourceMappingURL=health.controller.js.map