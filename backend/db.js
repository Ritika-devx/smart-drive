const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Ritika2006.",
  database: "smart_drive",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    console.log("Connected to MySQL");
    connection.release();
  }
});

module.exports = db;
