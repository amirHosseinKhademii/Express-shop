import { MongoClient } from "mongodb";
declare const client: MongoClient;
export declare const mdb: import("mongodb").Db;
export declare const connectMongo: () => Promise<void>;
export declare const closeMongo: () => Promise<void>;
export { client as mongoClient };
//# sourceMappingURL=mongodb.d.ts.map