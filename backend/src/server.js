const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// DB Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Pathrise backend is running 🚀");
});

// 404 handler (optional but good)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global Error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
