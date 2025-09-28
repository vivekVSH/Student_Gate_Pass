<?php
require_once 'config.php';

// Debug: Log all POST data
error_log("POST data: " . print_r($_POST, true));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get all POST values with defaults
    $student_id = isset($_POST['studentId']) ? trim($_POST['studentId']) : '';
    $full_name = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $class = isset($_POST['class']) ? trim($_POST['class']) : '';
    $division = isset($_POST['division']) ? trim($_POST['division']) : '';
    $roll_no = isset($_POST['rollNo']) ? trim($_POST['rollNo']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    // Debug: Log individual values
    error_log("Values: student_id=$student_id, full_name=$full_name, email=$email, class=$class, division=$division, roll_no=$roll_no, password=" . (empty($password) ? 'EMPTY' : 'SET'));

    // Validate required fields
    $errors = [];
    if (empty($student_id)) $errors[] = "Student ID is required";
    if (empty($full_name)) $errors[] = "Full name is required";
    if (empty($email)) $errors[] = "Email is required";
    if (empty($class)) $errors[] = "Class is required";
    if (empty($division)) $errors[] = "Division is required";
    if (empty($roll_no)) $errors[] = "Roll number is required";
    if (empty($password)) $errors[] = "Password is required";

    if (!empty($errors)) {
        echo "Error: " . implode(", ", $errors);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Error: Invalid email format";
        exit;
    }

    $password = password_hash($password, PASSWORD_DEFAULT);

    // Check if student already exists
    $stmt = $conn->prepare("SELECT id FROM students WHERE student_id = ? OR email = ?");
    $stmt->bind_param("ss", $student_id, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Student ID or email already exists";
    } else {
        // Insert new student
        $stmt = $conn->prepare("INSERT INTO students (student_id, full_name, email, password, class, division, roll_no) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $student_id, $full_name, $email, $password, $class, $division, $roll_no);
        
        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Error: " . $stmt->error;
        }
    }
    $stmt->close();
} else {
    echo "Error: Invalid request method";
}
$conn->close();
?>