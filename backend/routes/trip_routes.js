import express from "express";
import * as trip_controller from "../controllers/trip_controller.js";
import { adminOnly, auth } from "../middlewares/auth.js";

const router = express.Router();

// -------------------
// Admin Routes
// -------------------

router.post("/create", auth, adminOnly, trip_controller.createTrip);

router.get("/all", auth, adminOnly, trip_controller.getTrips);

// -------------------
// User Routes
// -------------------

router.get("/", trip_controller.getTrips);

router.post("/book", auth, trip_controller.bookSeats);

// -------------------

export default router;
