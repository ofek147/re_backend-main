import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose"; // Import Mongoose
import projectRoutes from "./routes/projects";
import adminRoutes from "./routes/admin";

const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;
const MONGODB_URI = process.env.MONGODB_URI; // Add your MongoDB URI to .env

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not defined.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
    process.exit(1); // Exit the process if connection fails
  });

// Routes
app.use(projectRoutes); 
app.use(adminRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});