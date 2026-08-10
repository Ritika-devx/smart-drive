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

/*
Your actual `files` table (created earlier, with userId etc.) already
exists — run this ALTER instead of the CREATE TABLE above to add the
trash/archive columns and widen `type` (docx mimetypes are 71 chars
and overflowed the old VARCHAR(50)):
*/
ALTER TABLE files
  ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN deleted_at DATETIME NULL,
  ADD COLUMN is_archived BOOLEAN DEFAULT FALSE,
  ADD COLUMN archived_at DATETIME NULL,
  MODIFY COLUMN type VARCHAR(100);