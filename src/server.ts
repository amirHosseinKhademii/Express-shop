import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { connectMongoose, closeMongoose } from "./database/mongoose.js";

const start = async (): Promise<void> => {
  const app = createApp();

  await connectMongoose();

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} [${config.env}]`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await closeMongoose();
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
