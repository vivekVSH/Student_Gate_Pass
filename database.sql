-- Create the database
CREATE DATABASE IF NOT EXISTS gatepassdb;
USE gatepassdb;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS status_logs;
DROP TABLE IF EXISTS gate_passes;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS admin;

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
);

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
);

-- Create admin table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create gate passes table
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
    time_format ENUM('AM', 'PM') NOT NULL,
    duration VARCHAR(50) NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT NULL,
    reviewer_type ENUM('faculty', 'admin') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_pass 
        FOREIGN KEY (requestor_id) 
        REFERENCES students(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    CONSTRAINT fk_faculty_pass 
        FOREIGN KEY (requestor_id) 
        REFERENCES faculty(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Create status logs table
CREATE TABLE status_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pass_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL,
    notes TEXT NULL,
    reviewed_by INT NOT NULL,
    reviewer_type ENUM('faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pass_id) 
        REFERENCES gate_passes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Insert default admin user
INSERT INTO admin (username, password, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@admin.com');
-- Password: admin123

-- Create indexes for better performance
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_faculty_email ON faculty(email);
CREATE INDEX idx_gate_passes_date ON gate_passes(date);
CREATE INDEX idx_gate_passes_status ON gate_passes(status);
CREATE INDEX idx_gate_passes_requestor ON gate_passes(requestor_id, requestor_type);

-- Add some sample data for testing
INSERT INTO students (student_id, full_name, email, password, class, division, roll_no) VALUES
('S123456', 'John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'BE', 'A', '1'),
('S123457', 'Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'BE', 'B', '2');
-- Password: admin123

INSERT INTO faculty (faculty_id, first_name, last_name, email, password, department, phone) VALUES
('F123456', 'Robert', 'Johnson', 'robert@faculty.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '1234567890'),
('F123457', 'Mary', 'Williams', 'mary@faculty.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Information Technology', '0987654321');
-- Password: admin123
