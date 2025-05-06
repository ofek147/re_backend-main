// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import mongoose from "mongoose"; // Import Mongoose
// import projectRoutes from "./routes/projects";
// import adminRoutes from "./routes/admin";
// import leadRoutes from "./routes/leads";

// const dotenv = require("dotenv");
// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 9999;
// const MONGODB_URI = process.env.MONGODB_URI; // Add your MongoDB URI to .env

// if (!MONGODB_URI) {
//   console.error("MONGODB_URI environment variable is not defined.");
//   process.exit(1);
// }

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose
//   .connect(MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => {
//     console.error("Could not connect to MongoDB", err);
//     process.exit(1); // Exit the process if connection fails
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

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import projectRoutes from "./routes/projects";
import adminRoutes from "./routes/admin";
import leadRoutes from "./routes/leads";
import fs from "fs"; // Import the file system module
import https from "https"; // Import the https module

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999; // You might want to use 443 for HTTPS
const HTTP_PORT = 80; // Define a port for HTTP redirection
const MONGODB_URI = process.env.MONGODB_URI;

const DOMAIN = "test-ben-project.netlify.app"; // Your domain name
const CERT_PATH = `/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`;
const KEY_PATH = `/etc/letsencrypt/live/${DOMAIN}/privkey.pem`;

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
    process.exit(1);
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

// --- HTTPS Configuration ---
const httpsOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
};

const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(443, () => {
  // Listen on the standard HTTPS port
  console.log(`HTTPS server is running on port 443`);
});

// --- HTTP to HTTPS Redirection ---
const httpApp = express();
httpApp.get("*", (req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});

httpApp.listen(HTTP_PORT, () => {
  console.log(`HTTP server is running on port ${HTTP_PORT} for redirection`);
});

// If you no longer need to listen on the old HTTP port (9999), you can remove this:
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
