import { Pool } from "pg";
import { config } from "../config/index.js";
import logger from "../utils/logger.js";

export const db = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  max: 10,
});

db.on("error", (err) => {
  logger.error(err, "Unexpected PostgreSQL pool error");
});
