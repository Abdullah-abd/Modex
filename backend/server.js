import dotenv from "dotenv";
import app from "./app.js";
import pool from "./db/index.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
pool.connect();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
