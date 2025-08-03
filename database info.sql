-- Run these commands in your MySQL client
CREATE DATABASE attendance_db;

USE attendance_db;

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  check_in_time DATETIME NOT NULL,
  check_out_time DATETIME,
  total_time INT COMMENT 'in minutes',
  check_in_image_path VARCHAR(255),
  check_out_image_path VARCHAR(255)
);