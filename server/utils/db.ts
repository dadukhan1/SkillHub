/** @format */

import mongoose from "mongoose";
import "dotenv/config";

const dbURL: string = process.env.DB_URI || "";

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const data = await mongoose.connect(dbURL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10, // connection pool limit karo
    });
    isConnected = true;
    console.log(`Database connected with ${data.connection.host}`);
  } catch (error: any) {
    console.log("DB connection error:", error.message);
    isConnected = false;
  }
};

export default connectDB;