import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth_routes.js";
import testRoutes from "./routes/test_routes.js";
import tripRoutes from "./routes/trip_routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/", testRoutes);
app.use("/auth", authRoutes);
app.use("/api/trips", tripRoutes);
export default app;
