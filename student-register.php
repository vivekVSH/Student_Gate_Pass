<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_id = $_POST['studentId'];
    $full_name = $_POST['fullName'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Check if student already exists
    $stmt = $conn->prepare("SELECT id FROM students WHERE student_id = ? OR email = ?");
    $stmt->bind_param("ss", $student_id, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Student ID or email already exists";
    } else {
        // Insert new student
        $class = $_POST['class'];
        $division = $_POST['division'];
        $roll_no = $_POST['rollNo'];
        
        $stmt = $conn->prepare("INSERT INTO students (student_id, full_name, email, password, class, division, roll_no) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $student_id, $full_name, $email, $password, $class, $division, $roll_no);
        
        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Error: " . $stmt->error;
        }
    }
    $stmt->close();
}
$conn->close();
?>