import { Sequelize } from "sequelize";

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: isProduction
    ? { ssl: { require: true, rejectUnauthorized: false } } // production
    : {}, // local: no SSL
  pool: { max: 5, min: 0, idle: 10000, acquire: 30000 },
});

sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

export default sequelize;
