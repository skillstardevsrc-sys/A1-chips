import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 A1 CHIPS PRODUCTION API SERVER RUNNING ON PORT ${PORT}`);
    console.log(`👉 ENVIRONMENT: ${process.env.NODE_ENV || "development"}`);
    console.log(`👉 HEALTH: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
};

startServer();
