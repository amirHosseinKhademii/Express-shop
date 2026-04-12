import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { closeMongo, connectMongo } from "./database/mongodb.js";
import { connectSequelize, closeSequelize } from "./database/sequelize.js";

const start = async (): Promise<void> => {
  const app = createApp();

  // await connectSequelize();
  await connectMongo();

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} [${config.env}]`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      // await closeSequelize();
      await closeMongo();
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
