// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import projectRoutes from "./routes/projects";
// import adminRoutes from "./routes/admin";
// import leadRoutes from "./routes/leads";
// import fs from "fs"; // מודול לעבודה עם מערכת הקבצים
// import https from "https"; // מודול Node.js עבור HTTPS

// const dotenv = require("dotenv");
// dotenv.config();

// const app = express();
// const MONGODB_URI = process.env.MONGODB_URI;

// const DOMAIN = "re-backend.xyz"; // שם הדומיין שלך
// const CERT_PATH = `/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`; // נתיב לתעודה
// const KEY_PATH = `/etc/letsencrypt/live/${DOMAIN}/privkey.pem`; // נתיב למפתח הפרטי

// if (!MONGODB_URI) {
//   console.error("MONGODB_URI environment variable is not defined.");
//   process.exit(1);
// }

// // Middleware
// app.use(
//   cors({
//     origin: "https://re-backend.xyz", // אפשר רק מהדומיין הזה
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // אפשר את השיטות האלה
//     allowedHeaders: ["Content-Type", "Authorization"], // אפשר את הכותרות האלה
//   })
// );
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose
//   .connect(MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => {
//     console.error("Could not connect to MongoDB", err);
//     process.exit(1);
//   });

// // Routes
// app.use(projectRoutes);
// app.use(adminRoutes);
// app.use(leadRoutes);

// // Health check route
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });

// // Global error handler
// app.use(
//   (
//     err: any,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     console.error(err.stack);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// );

// // --- הגדרות HTTPS ---
// const httpsOptions = {
//   key: fs.readFileSync(KEY_PATH), // קריאת המפתח הפרטי
//   cert: fs.readFileSync(CERT_PATH), // קריאת התעודה
// };

// const httpsServer = https.createServer(httpsOptions, app);

// httpsServer.listen(3001, () => {
//   // האזנה על פורט 3001 עבור HTTPS (מאחורי Nginx)
//   console.log(`HTTPS server is running on port 3001`);
// });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose"; // Import Mongoose
import projectRoutes from "./routes/projects";
import adminRoutes from "./routes/admin";
import leadRoutes from "./routes/leads";

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
app.use(leadRoutes);

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