/** @format */

import mongoose from "mongoose";
import "dotenv/config";

const dbURL: string = process.env.DB_URI || "";

const connectDB = async () => {
  try {
    const data = await mongoose.connect(dbURL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`Database connected with ${data.connection.host}`);
  } catch (error: any) {
    console.log("DB connection error:", error.message);
  }
};

export default connectDB;
