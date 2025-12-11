-- trips table
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  bus_name TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  total_seats INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- seats table
CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
  seat_number INT NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  UNIQUE(trip_id, seat_number)
);

-- bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
  seat_ids INT[] NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);
