import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "🟢 DB Connected",
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "🔴 DB Error",
      message: error,
    });
  }
});

export default router;
