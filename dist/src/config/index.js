import "dotenv/config";
export const config = {
    env: process.env["NODE_ENV"] ?? "development",
    port: parseInt(process.env["PORT"] ?? "3000", 10),
    database: {
        postgresUrl: process.env["DATABASE_URL"] ?? "",
        mongoUri: process.env["MONGODB_URI"] ?? "",
    },
    jwt: {
        secret: process.env["JWT_SECRET"] ?? "",
        refreshSecret: process.env["JWT_REFRESH_SECRET"] ?? "",
        expiresIn: process.env["JWT_EXPIRES_IN"] ?? "15m",
        refreshExpiresIn: process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d",
    },
};
//# sourceMappingURL=index.js.map