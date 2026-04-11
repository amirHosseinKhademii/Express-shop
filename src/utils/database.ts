import { createPool, type Pool } from "mysql2";
import { config } from "../config/index.js";

const pool: Pool = createPool({
  host: config.database.mysqlHost,
  port: config.database.mysqlPort,
  user: config.database.mysqlUser,
  password: config.database.mysqlPassword,
  database: config.database.mysqlDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 60_000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30_000,
});

export const poolPromise = pool.promise();

export const connectMySQL = async (): Promise<void> => {
  const connection = await poolPromise.getConnection();
  try {
    await connection.ping();
    console.log("MySQL connected");
  } finally {
    connection.release();
  }
};

export const closeMySQL = async (): Promise<void> => {
  await pool.promise().end();
  console.log("MySQL connection pool closed");
};
