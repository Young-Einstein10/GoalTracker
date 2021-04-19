import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const TEST_DB_URL = `postgresql://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASSWORD}@${process.env.TEST_DB_HOST}:${process.env.TEST_DB_PORT}/${process.env.TEST_DB_NAME}`;

const DB_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.NODE_ENV === "testing"
    ? TEST_DB_URL
    : connectionString;

const pool = new Pool({
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: true,
  },
});

if (DB_URL == TEST_DB_URL) {
  pool.on("connect", () => {
    console.log("connected to the Test Database");
  });
}

pool.on("connect", () => {
  console.log("connected to the Database");
});

export default pool;
