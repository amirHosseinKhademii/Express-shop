import { MongoClient } from "mongodb";
import { config } from "../config/index.js";
const client = new MongoClient(config.database.mongoUri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
});
export const mdb = client.db();
export const connectMongo = async () => {
    try {
        await client.connect();
        await client.db().command({ ping: 1 });
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
export const closeMongo = async () => {
    await client.close();
    console.log("MongoDB connection closed");
};
export { client as mongoClient };
//# sourceMappingURL=mongodb.js.map