import { Request, Response } from "express";
import Admin from "../models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const verifyToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode and verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ofek132123123"
    ) as { id: string };

    // Fetch user to confirm still exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "User not found." });
    }

    // Re-sign token with a fresh expiration
    const newToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "ofek132123123",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Token refreshed",
      token: newToken,
      user: {
        name: admin.name,
        email: admin.email,
        id: admin._id,
      },
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// POST /admin/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check for missing fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create a token (adjust secret/expiry as needed)
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "ofek132123123",
      { expiresIn: "1d" }
    );

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    // Send token and basic user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: admin.name,
        email: admin.email,
        id: admin._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// PUT /admin/:id
export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const updated = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update admin", details: err });
  }
};
