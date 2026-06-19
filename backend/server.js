const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/files");
const db = require("./db");   // important
const multer = require("multer");
const dashboardRoutes = require("./routes/dashboardRoutes");
const largestFilesRoutes = require("./routes/largestFilesRoutes");
const fileManagementRoutes = require("./routes/fileManagementRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", fileRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", largestFilesRoutes);
app.use("/api", fileManagementRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running !!");
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
app.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }

  next();
});