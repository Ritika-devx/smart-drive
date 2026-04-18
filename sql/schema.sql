/*
Run this file in MySQL Workbench before starting the backend.
It will create the required database and table for the project.
*/

CREATE DATABASE IF NOT EXISTS cloud_storage;
USE cloud_storage;

CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255),
  original_name VARCHAR(255),
  size INT,
  type VARCHAR(100),
  hash VARCHAR(255),
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/*
For testing after uploading files:
*/
SELECT * FROM files;