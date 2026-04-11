import "dotenv/config";
export const config = {
    env: process.env["NODE_ENV"] ?? "development",
    port: parseInt(process.env["PORT"] ?? "3000", 10),
    database: {
        postgresUrl: process.env["DATABASE_URL"] ?? "",
        mongoUri: process.env["MONGODB_URI"] ?? "",
        mysqlHost: process.env["DB_HOST"] ?? "127.0.0.1",
        mysqlPort: parseInt(process.env["DB_PORT"] ?? "3306", 10),
        mysqlUser: process.env["DB_USER"] ?? "root",
        mysqlPassword: process.env["DB_PASSWORD"] ?? "",
        mysqlDatabase: process.env["DB_NAME"] ?? "express-init",
    },
    jwt: {
        secret: process.env["JWT_SECRET"] ?? "",
        refreshSecret: process.env["JWT_REFRESH_SECRET"] ?? "",
        expiresIn: process.env["JWT_EXPIRES_IN"] ?? "15m",
        refreshExpiresIn: process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d",
    },
};
//# sourceMappingURL=index.js.map