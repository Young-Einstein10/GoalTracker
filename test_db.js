import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const TEST_DB_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.TEST_DB_NAME}`;

const pool = new Pool({
  connectionString: TEST_DB_URL,
});

pool.on("connect", () => {
  console.log("connected to the Test Database");
});

const createSchema = async () => {
  const queryText = `CREATE SCHEMA tracker`;

  // try {
  //   const response = await pool.query(queryText);
  //   console.log(response);
  //   pool.end()
  // } catch (error) {
  //   console.log(error);
  //   pool.end()
  // }

  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      console.log("schema çreated");
      // pool.end();
    })
    .catch((err) => {
      console.log("error creating schema", err);
      // pool.end();
    });
};

const dropSchema = () => {
  const queryText = `DROP SCHEMA tracker CASCADE`;
  pool
    .query(queryText)
    .then((res) => {
      console.log("schema dropped");
      // pool.end();
    })
    .catch((err) => {
      console.log("error dropping schema", err);
      // pool.end();
    });
};

//..............................................//

const createAllTables = () => {
  const queryText = `
    CREATE TABLE users IF NOT EXIST 
    (
        email VARCHAR(255) UNIQUE NOT NULL,
        firstname VARCHAR(25) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        id VARCHAR(255) UNIQUE PRIMARY KEY,
        lastname VARCHAR(25) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_on TIMESTAMP NOT NULL
    ); 
    
    CREATE TABLE goals
    (
      id VARCHAR(255) UNIQUE PRIMARY KEY,
      body VARCHAR NOT NULL,
      user_id VARCHAR(255) REFERENCES users(id) NOT NULL,
      is_achieved BOOLEAN NOT NULL DEFAULT FALSE,
      created_on TIMESTAMP NOT NULL
    );

    CREATE TABLE todos
    (
      id VARCHAR(255) UNIQUE PRIMARY KEY,
      body VARCHAR NOT NULL,
      goal_id VARCHAR(255) REFERENCES goals(id) NOT NULL,
      is_done BOOLEAN NOT NULL DEFAULT FALSE,
      created_on TIMESTAMP NOT NULL
    );

    `;

  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      console.log("tables çreated");
      // pool.end();
    })
    .catch((err) => {
      console.log(err);
      // pool.end();
    });
};

const dropAllTables = () => {
  dropSchema();
};

pool.on("remove", () => {
  console.log("connection ended...");
  // process.exit(0);
});

module.exports = {
  createAllTables,
  dropAllTables,
  createSchema,
};

// require("make-runnable");
