// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");

// const fileRoutes = require("./routes/files");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const largestFilesRoutes = require("./routes/largestFilesRoutes");
// const fileManagementRoutes = require("./routes/fileManagementRoutes");
// const analysisRoutes = require("./routes/analysisRoutes");

// // Existing routes
// const suggestionRoutes = require("./routes/suggestionsRoutes");
// const searchRoutes = require("./routes/searchRoutes");
// const filterRoutes = require("./routes/filterRoutes");

// // ⭐ Authentication Routes
// const authRoutes = require("./routes/authRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // ==========================
// // API Routes
// // ==========================

// app.use("/api", fileRoutes);
// app.use("/api", dashboardRoutes);
// app.use("/api", largestFilesRoutes);
// app.use("/api", fileManagementRoutes);

// app.use("/api", analysisRoutes);

// app.use("/api", suggestionRoutes);
// app.use("/api", searchRoutes);
// app.use("/api", filterRoutes);

// // ⭐ Authentication
// app.use("/api/auth", authRoutes);

// // ==========================
// // Home Route
// // ==========================

// app.get("/", (req, res) => {
//   res.send("Backend is running !!");
// });

// // ==========================
// // Global Error Handler
// // ==========================

// app.use((err, req, res, next) => {

//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });

// });

// // ==========================
// // Start Server
// // ==========================

// app.listen(5000, () => {
//   console.log("🚀 Server running at http://localhost:5000");
// });


require("dotenv").config();
process.on("unhandledRejection", (reason) => {
  console.error("🔴 UNHANDLED REJECTION:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("🔴 UNCAUGHT EXCEPTION:", err);
});
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const fileRoutes = require("./routes/files");
const dashboardRoutes = require("./routes/dashboardRoutes");
const largestFilesRoutes = require("./routes/largestFilesRoutes");
const fileManagementRoutes = require("./routes/fileManagementRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

// Existing routes
const suggestionRoutes = require("./routes/suggestionsRoutes");
const searchRoutes = require("./routes/searchRoutes");
const filterRoutes = require("./routes/filterRoutes");

// ⭐ Authentication Routes
const authRoutes = require("./routes/authRoutes");
const storageRoutes = require("./routes/storageRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "3mb" }));

// ==========================
// API Routes
// ==========================

app.use("/api", fileRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", largestFilesRoutes);
app.use("/api", fileManagementRoutes);

app.use("/api", analysisRoutes);

app.use("/api", suggestionRoutes);
app.use("/api", searchRoutes);
app.use("/api", filterRoutes);

// ⭐ Authentication
app.use("/api/auth", authRoutes);

// ⭐ Storage
app.use("/api/storage", storageRoutes);
// ==========================
// Home Route
// ==========================

app.get("/", (req, res) => {
  res.send("Backend is running !!");
});

// ==========================
// Global Error Handler
// ==========================

app.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });

});

// ==========================
// Start Server
// ==========================

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});