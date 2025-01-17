-- Create the database
CREATE DATABASE IF NOT EXISTS homepage;
USE homepage;

-- Create website_views table
CREATE TABLE website_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_addr INT UNSIGNED NOT NULL,
    views INT NOT NULL DEFAULT 1,
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create calendar table
CREATE TABLE calendar (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_all_day TINYINT(1) DEFAULT 0
);

-- Add indexes for better performance
CREATE INDEX idx_ip_addr ON website_views (ip_addr);
CREATE INDEX idx_start_time ON calendar (start_time);