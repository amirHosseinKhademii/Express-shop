import { createPool } from "mysql2";
import { config } from "../config/index.js";
const pool = createPool({
    host: config.database.mysqlHost,
    port: config.database.mysqlPort,
    user: config.database.mysqlUser,
    password: config.database.mysqlPassword,
    database: config.database.mysqlDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30000,
});
export const poolPromise = pool.promise();
export const connectMySQL = async () => {
    const connection = await poolPromise.getConnection();
    try {
        await connection.ping();
        console.log("MySQL connected");
    }
    finally {
        connection.release();
    }
};
export const closeMySQL = async () => {
    await pool.promise().end();
    console.log("MySQL connection pool closed");
};
//# sourceMappingURL=mysql.js.map