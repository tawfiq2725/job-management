import { Client, Pool } from "pg";
import { config } from "dotenv";
import fs from "fs";

config();

const connection = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized:
            process.env.DB_SSL_STRICT === "true" ? true : false,
          ca:
            process.env.DB_SSL_STRICT === "true" && process.env.DB_CA_PATH
              ? fs.readFileSync(process.env.DB_CA_PATH).toString()
              : undefined,
        }
      : false,
});


export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized:
            process.env.DB_SSL_STRICT === "true" ? true : false,
          ca:
            process.env.DB_SSL_STRICT === "true" && process.env.DB_CA_PATH
              ? fs.readFileSync(process.env.DB_CA_PATH).toString()
              : undefined,
        }
      : false,
});

// Handle pool errors
pool.on("error", (err: Error) => {
  console.error("Database pool error:", err.stack);
});

// Function to test database connection
export const db = async () => {
  try {
    await connection.connect();
    console.log("DB connected successfully...");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Connection error:", err.stack);
    } else {
      console.error("An unknown error occurred:", err);
    }
  } finally {
    await connection.end(); 
  }
};
