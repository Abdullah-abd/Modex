import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("🟢 Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("🔴 PostgreSQL Connection Error:", err);
});

export default pool;
