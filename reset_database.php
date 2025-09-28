<?php
require_once 'config.php';

// First, disable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 0");

// Drop all existing tables
$conn->query("DROP TABLE IF EXISTS status_logs");
$conn->query("DROP TABLE IF EXISTS gate_passes");
$conn->query("DROP TABLE IF EXISTS students");
$conn->query("DROP TABLE IF EXISTS faculty");
$conn->query("DROP TABLE IF EXISTS admin");

// Create tables without any foreign key constraints
$createTables = "
-- Create students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    class VARCHAR(50) NOT NULL,
    division VARCHAR(10) NOT NULL,
    roll_no VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create faculty table
CREATE TABLE faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create admin table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create gate passes table (without any foreign keys)
CREATE TABLE gate_passes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pass_type ENUM('student', 'faculty') NOT NULL,
    requestor_id INT NOT NULL,
    requestor_type ENUM('student', 'faculty') NOT NULL,
    roll_no VARCHAR(50) NULL,
    class VARCHAR(50) NULL,
    division VARCHAR(10) NULL,
    contact_no VARCHAR(15) NOT NULL,
    date DATE NOT NULL,
    time_out TIME NOT NULL,
    time_format ENUM('AM', 'PM') DEFAULT 'AM',
    duration VARCHAR(50) NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT NULL,
    reviewer_type ENUM('faculty', 'admin') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create status logs table (without foreign keys)
CREATE TABLE status_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pass_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL,
    notes TEXT NULL,
    reviewed_by INT NOT NULL,
    reviewer_type ENUM('faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;";

if ($conn->multi_query($createTables)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
}

// Re-insert default admin
$adminSql = "INSERT INTO admin (username, password, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@admin.com')";
$conn->query($adminSql);

// Re-enable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 1");

if ($conn->error) {
    echo "Error: " . $conn->error;
} else {
    echo "Database reset successful! All tables recreated without foreign key constraints.";
}

$conn->close();
?>