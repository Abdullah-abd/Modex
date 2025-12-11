import dotenv from "dotenv";
import express from "express";
import testRoutes from "./routes/test_routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", testRoutes);

export default app;
