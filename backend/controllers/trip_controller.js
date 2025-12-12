import sequelize from "../models/index.js";
import Trip from "../models/trip.js";

// -------------------------------
// 1️⃣ Create Trip (Admin)
// -------------------------------
export const createTrip = async (req, res) => {
  try {
    const { bus_name, start_time, total_seats } = req.body;

    if (!bus_name || !start_time || !total_seats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trip = await Trip.create({
      bus_name, // bus_name from req.body
      start_time, // start_time from req.body
      total_seats, // total_seats from req.body
      booked_seats: [],
    });

    return res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (err) {
    console.error("CreateTrip Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// 2️⃣ Get All Trips
// -------------------------------
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll();
    return res.json(trips);
  } catch (err) {
    console.error("GetTrips Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// 3️⃣ Book Seats (Concurrency Safe)
// -------------------------------
export const bookSeats = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { tripId, seatNumbers, userId } = req.body;

    if (!tripId || !userId) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "tripId and userId are required" });
    }

    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "seatNumbers must be a non-empty array" });
    }

    // Lock the row to prevent concurrent booking conflicts
    const trip = await Trip.findOne({
      where: { id: tripId },
      transaction: t,
      lock: t.LOCK.UPDATE,
      skipLocked: true,
    });

    if (!trip) {
      await t.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    const currentSeats = trip.bookedSeats || [];

    // Validate seat numbers
    const invalidSeat = seatNumbers.find(
      (seat) => seat < 1 || seat > trip.totalSeats
    );
    if (invalidSeat) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: `Seat ${invalidSeat} does not exist` });
    }

    // Check if any seat is already booked
    const alreadyBooked = seatNumbers.some((seat) =>
      currentSeats.includes(seat)
    );
    if (alreadyBooked) {
      await t.rollback();
      return res.status(409).json({ message: "Some seats are already booked" });
    }

    // Update booked seats
    trip.bookedSeats = [...currentSeats, ...seatNumbers];
    await trip.save({ transaction: t });
    await t.commit();

    return res.status(200).json({
      message: "Booking confirmed",
      status: "CONFIRMED",
      seats: seatNumbers,
    });
  } catch (err) {
    await t.rollback();
    console.error("Booking Error:", err);
    return res.status(500).json({
      message: "Server error",
      status: "FAILED",
    });
  }
};
