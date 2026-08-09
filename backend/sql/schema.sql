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
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL
);

/*
If your database already exists (table created before the trash feature),
run this instead of the CREATE TABLE above to add the new columns:

ALTER TABLE files
  ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN deleted_at DATETIME NULL,
  ADD COLUMN is_archived BOOLEAN DEFAULT FALSE,
  ADD COLUMN archived_at DATETIME NULL;

-- Word doc (.docx) mimetypes run to 71 characters, which overflowed
-- the old VARCHAR(50) `type` column and silently failed the insert.
-- Widen it:
ALTER TABLE files
  MODIFY COLUMN type VARCHAR(100);
*/

/*
For testing after uploading files:
*/
SELECT * FROM files;