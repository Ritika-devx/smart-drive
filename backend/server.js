// const express = require("express");
// const cors = require("cors");
// const fileRoutes = require("./routes/files");
// const db = require("./db");   // important
// const multer = require("multer");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const largestFilesRoutes = require("./routes/largestFilesRoutes");
// const fileManagementRoutes = require("./routes/fileManagementRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api", fileRoutes);
// app.use("/api", dashboardRoutes);
// app.use("/api", largestFilesRoutes);
// app.use("/api", fileManagementRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend is running !!");
// });

// app.listen(5000, () => {
//   console.log("Server running at http://localhost:5000");
// });
// app.use((err, req, res, next) => {

//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }

//   if (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }

//   next();
// });




const express = require("express");
const cors = require("cors");
const multer = require("multer");

const fileRoutes = require("./routes/files");
const dashboardRoutes = require("./routes/dashboardRoutes");
const largestFilesRoutes = require("./routes/largestFilesRoutes");
const fileManagementRoutes = require("./routes/fileManagementRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

// New routes
const suggestionRoutes = require("./routes/suggestionsRoutes");
const searchRoutes = require("./routes/searchRoutes");
const filterRoutes = require("./routes/filterRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", fileRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", largestFilesRoutes);
app.use("/api", fileManagementRoutes);
<<<<<<< HEAD
app.use("/api", analysisRoutes);
=======
app.use("/api", suggestionRoutes);
app.use("/api", searchRoutes);
app.use("/api", filterRoutes);
>>>>>>> 2fc6e24 (Completed backend phase with Prisma integration and file management APIs)

// Home route
app.get("/", (req, res) => {
  res.send("Backend is running !!");
});

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});