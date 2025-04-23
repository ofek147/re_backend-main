import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin"; // Import from src/models
import bcryptjs from "bcryptjs";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not defined.");
  process.exit(1);
}

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
    
    if (existingAdmin) {
      console.log("Admin with this email already exists");
    } else {
      // Create new admin - the password will be hashed by the pre-save hook
      const admin = new Admin({
        name: "ofek147",
        email: "ofek.keinan@gmail.com",
        password: "1475963", 
        isActive: true,
      });

      await admin.save();
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

createAdmin();