import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

import connectDB from "./config/db.js";
import { ROLE } from "./constants/common.js";
import { UrlConfig } from "./models/Config.js";
import { User } from "./models/User.js";

const seedUrlConfig = async () => {
  try {
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
  }
};

const ADMIN_USERS = [
  {
    name: "ADMIN",
    email: "admin@admin.com",
    password: "admin",
    role: ROLE.ADMIN,
  },
];

const seedAdminUsers = async () => {
  try {
    let count = 0;
    for (const user of ADMIN_USERS) {
      const existingUser = await User.findOne({
        email: user.email,
        isActive: true,
        isDeleted: false,
      });

      if (existingUser) continue;

      await User.create(user);
      ++count;
    }
    console.log(`${count} users added.`);
  } catch (error) {
    console.error("Error seeding UrlConfig:", error);
  }
};

const init = async () => {
  try {
    await connectDB();

    await seedUrlConfig();
    await seedAdminUsers();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    }
  }
};

init();
