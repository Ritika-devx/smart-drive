const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/files");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", fileRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running !!");
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
