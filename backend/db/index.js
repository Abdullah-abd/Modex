import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // only production
    : false, // local: no SSL
});

pool.on("connect", () => {
  console.log("🟢 Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("🔴 PostgreSQL Connection Error:", err);
});

export default pool;
