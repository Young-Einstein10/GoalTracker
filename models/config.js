import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const DB_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URL
    : connectionString;

const pool = new Pool({
  connectionString: DB_URL,
});

pool.on("connect", () => {
  console.log("connected to the Database");
});

export default pool;
