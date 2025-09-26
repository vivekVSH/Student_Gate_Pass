<?php
require_once 'config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $pass_type = $_POST['type']; // 'student' or 'faculty'
    $user_id = ($pass_type == 'student') ? $_SESSION['student_id'] : $_SESSION['faculty_id'];
    $name = ($pass_type == 'student') ? $_SESSION['student_name'] : $_SESSION['faculty_name'];
    
    // Common fields
    $date = $_POST['date'];
    $time_out = $_POST['timeOut'];
    $reason = $_POST['reason'];
    
    if ($pass_type == 'student') {
        $class = $_POST['class'];
        $division = $_POST['div'];
        $roll_no = $_POST['rollNo'];
        $contact_no = $_POST['contactNo'];
        
        $stmt = $conn->prepare("INSERT INTO gate_passes (pass_type, user_id, name, class, division, roll_no, contact_no, date, time_out, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssss", $pass_type, $user_id, $name, $class, $division, $roll_no, $contact_no, $date, $time_out, $reason);
    } else {
        $department = $_SESSION['faculty_department'];
        $time_format = $_POST['timeFormat'];
        $duration = $_POST['duration'];
        $contact_no = $_POST['phone'];
        
        $stmt = $conn->prepare("INSERT INTO gate_passes (pass_type, user_id, name, department, contact_no, date, time_out, time_format, duration, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssss", $pass_type, $user_id, $name, $department, $contact_no, $date, $time_out, $time_format, $duration, $reason);
    }
    
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
}
$conn->close();
?>