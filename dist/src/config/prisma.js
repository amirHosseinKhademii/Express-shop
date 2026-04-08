import { PrismaClient } from "../../generated/prisma/client.js";
export const prisma = new PrismaClient({
    log: process.env["NODE_ENV"] === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
});
export const connectPrisma = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL connected via Prisma");
    }
    catch (error) {
        console.error("PostgreSQL connection error:", error);
        process.exit(1);
    }
};
export const closePrisma = async () => {
    await prisma.$disconnect();
    console.log("PostgreSQL connection closed");
};
//# sourceMappingURL=prisma.js.map