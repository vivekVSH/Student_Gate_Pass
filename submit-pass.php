<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if user is logged in
    if (!isset($_SESSION['user_type'])) {
        echo "Error: User not logged in";
        exit;
    }

    $pass_type = $_POST['type']; // 'student' or 'faculty'
    
    // Validate pass type
    if ($pass_type !== 'student' && $pass_type !== 'faculty') {
        echo "Error: Invalid pass type";
        exit;
    }
    
    // Get the actual database ID for the requestor
    $requestor_id = null;
    $requestor_type = $pass_type;
    
    if ($pass_type == 'student') {
        if (!isset($_SESSION['student_id'])) {
            echo "Error: Student session not found";
            exit;
        }
        // Get student ID from database using student_id from session
        $stmt = $conn->prepare("SELECT id FROM students WHERE student_id = ?");
        $stmt->bind_param("s", $_SESSION['student_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $requestor_id = $result->fetch_assoc()['id'];
        }
        $stmt->close();
    } else {
        if (!isset($_SESSION['faculty_id'])) {
            echo "Error: Faculty session not found";
            exit;
        }
        // Get faculty ID from database using faculty_id from session
        $stmt = $conn->prepare("SELECT id FROM faculty WHERE faculty_id = ?");
        $stmt->bind_param("s", $_SESSION['faculty_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $requestor_id = $result->fetch_assoc()['id'];
        }
        $stmt->close();
    }
    
    if (!$requestor_id) {
        echo "Error: User not found in database";
        exit;
    }
    
    // Validate common required fields
    if (!isset($_POST['date']) || !isset($_POST['timeOut']) || !isset($_POST['reason'])) {
        echo "Error: Required fields missing";
        exit;
    }
    
    // Common fields
    $date = trim($_POST['date']);
    $time_out = trim($_POST['timeOut']);
    $reason = trim($_POST['reason']);
    
    if (empty($date) || empty($time_out) || empty($reason)) {
        echo "Error: All required fields must be filled";
        exit;
    }
    
    if ($pass_type == 'student') {
        // Validate student-specific fields
        if (!isset($_POST['class']) || !isset($_POST['div']) || !isset($_POST['rollNo']) || !isset($_POST['contactNo'])) {
            echo "Error: Student fields missing";
            exit;
        }
        
        $class = trim($_POST['class']);
        $division = trim($_POST['div']);
        $roll_no = trim($_POST['rollNo']);
        $contact_no = trim($_POST['contactNo']);
        
        if (empty($class) || empty($division) || empty($roll_no) || empty($contact_no)) {
            echo "Error: All student fields must be filled";
            exit;
        }
        
        $stmt = $conn->prepare("INSERT INTO gate_passes (pass_type, requestor_id, requestor_type, roll_no, class, division, contact_no, date, time_out, time_format, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'AM', ?)");
        $stmt->bind_param("siisssssss", $pass_type, $requestor_id, $requestor_type, $roll_no, $class, $division, $contact_no, $date, $time_out, $reason);
    } else {
        // Validate faculty-specific fields
        if (!isset($_POST['timeFormat']) || !isset($_POST['duration']) || !isset($_POST['phone'])) {
            echo "Error: Faculty fields missing";
            exit;
        }
        
        $time_format = trim($_POST['timeFormat']);
        $duration = trim($_POST['duration']);
        $contact_no = trim($_POST['phone']);
        
        if (empty($time_format) || empty($duration) || empty($contact_no)) {
            echo "Error: All faculty fields must be filled";
            exit;
        }
        
        $stmt = $conn->prepare("INSERT INTO gate_passes (pass_type, requestor_id, requestor_type, contact_no, date, time_out, time_format, duration, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("siissssss", $pass_type, $requestor_id, $requestor_type, $contact_no, $date, $time_out, $time_format, $duration, $reason);
    }
    
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
} else {
    echo "Error: Invalid request method";
}
$conn->close();
?>