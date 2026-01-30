require("express-async-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const appointmentRoutes = require("./routes/appointment/appointment");
const availabilityRoutes = require("./routes/appointment/availability");
const reviewRoutes = require("./routes/user/reviews");
const path = require("path");
require("dotenv").config();

const app = express();

// CORS configuration - local development only
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

// Security and body parsing (order matters: parse body before sanitize)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        const msg = "Not allowed by CORS";
        callback(new Error(msg));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());
app.use(morgan("dev"));

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Stricter limit for auth (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many auth attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Chop Shop API is up and running!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/user/reviews", reviewRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Error handling (express-async-errors forwards async rejections here)
app.use((err, req, res, next) => {
  const status = err.status ?? err.statusCode ?? 500;
  if (status >= 500) {
    console.error("Error details:", err);
    console.error("Stack trace:", err.stack);
  }
  res.status(status).json({
    message:
      err.message ||
      (status === 500 ? "Something went wrong!" : "Request failed"),
    ...(process.env.NODE_ENV === "development" &&
      status === 500 && { error: err.message }),
  });
});

// Add a catch-all route at the end to log unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    requestedPath: req.originalUrl,
    method: req.method,
  });
});

// MongoDB: add a new database and re-enable connection when ready (see README).

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
