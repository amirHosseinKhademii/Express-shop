import mongoose from "mongoose";
import { config } from "../config/index.js";

const MONGO_URI = config.database.mongoUri;

if (!MONGO_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

export const connectMongoose = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30_000,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 45_000,
      retryWrites: true,
      retryReads: true,
      autoIndex: config.env !== "production",
      bufferCommands: false,
    });

    console.log(`Mongoose connected to ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Mongoose connection error:", error);
    process.exit(1);
  }
};

export const closeMongoose = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed");
};

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("reconnected", () => {
  console.log("Mongoose reconnected");
});
