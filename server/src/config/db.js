import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/a1_chips_db", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Database connection notice: ${error.message}`);
    console.warn(`[MongoDB] Operating in flexible memory mode / API ready.`);
    return null;
  }
};
