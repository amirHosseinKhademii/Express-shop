import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import routes from "./routes/index.js";

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(requestLogger);

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
};
