import mongoose from "mongoose";
import { config } from "./index.js";
export const connectMongo = async () => {
    try {
        await mongoose.connect(config.database.mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
});
export const closeMongo = async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
};
//# sourceMappingURL=mongoose.js.map