import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

import { UrlConfig } from "./models/Config.js";
import connectDB from "./config/db.js";

const seedUrlConfig = async () => {
  try {
    await connectDB();

    const existingConfig = await UrlConfig.findOne({
      isActive: true,
      isDeleted: false,
    });

    if (existingConfig) {
      console.log("UrlConfig already exists. Seeding skipped.");
    } else {
      const defaultConfig = new UrlConfig({
        prefix: "http://short.ly",
        urlLength: 6,
        isActive: true,
        isDeleted: false,
      });
      await defaultConfig.save();
      console.log("Default UrlConfig seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding UrlConfig:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    }
  }
};

seedUrlConfig();
