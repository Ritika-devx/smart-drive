// console.log("ROOT DB.JS LOADED");
// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "@1234",   // keep empty
//   database: "cloud_storage",
//   port: 3006
// });

// db.connect((err) => {
//   if (err) {
//     console.log("DB connection failed:", err);
//   } else {
//     console.log("Connected to MySQL");
//   }
// });

// module.exports = db;

console.log("ROOT DB.JS LOADED");

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "@1234",
  database: "cloud_storage",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = db;