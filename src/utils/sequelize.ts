import { Sequelize } from "sequelize";
import { config } from "../config/index.js";

export const sequelize = new Sequelize(
  config.database.mysqlDatabase,
  config.database.mysqlUser,
  config.database.mysqlPassword,
  {
    host: config.database.mysqlHost,
    port: config.database.mysqlPort,
    dialect: "mysql",
    logging: config.env === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30_000,
      idle: 10_000,
      evict: 60_000,
    },
    retry: {
      max: 3,
    },
    define: {
      timestamps: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_0900_ai_ci",
    },
    dialectOptions: {
      connectTimeout: 10_000,
      supportBigNumbers: true,
      bigNumberStrings: false,
    },
  },
);

export const connectSequelize = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("Sequelize connected");
};

export const closeSequelize = async (): Promise<void> => {
  await sequelize.close();
  console.log("Sequelize connection closed");
};
