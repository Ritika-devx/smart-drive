require("dotenv").config();
const mysql = require("mysql2");

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  port: 3006, // default MySQL port

  port: process.env.DB_PORT

});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err);
  } else {
    console.log("Connected to MySQL successfully");
  }
});

module.exports = db;