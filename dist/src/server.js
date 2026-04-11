import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { connectMySQL, closeMySQL } from "./utils/database.js";
const start = async () => {
    const app = createApp();
    await connectMySQL();
    const server = app.listen(config.port, () => {
        console.log(`Server running on port ${config.port} [${config.env}]`);
    });
    const shutdown = async (signal) => {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        server.close(async () => {
            await closeMySQL();
            console.log("Server closed");
            process.exit(0);
        });
    };
    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
};
start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map