<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debug: Log login attempt
    error_log("Student login attempt: " . print_r($_POST, true));
    
    $student_id = isset($_POST['studentId']) ? trim($_POST['studentId']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if (empty($student_id) || empty($password)) {
        echo "Error: Student ID and password are required";
        exit;
    }

    // Check if input is email or student ID
    $is_email = filter_var($student_id, FILTER_VALIDATE_EMAIL);
    
    if ($is_email) {
        // Login with email
        $stmt = $conn->prepare("SELECT * FROM students WHERE email = ?");
        $stmt->bind_param("s", $student_id);
    } else {
        // Login with student ID
        $stmt = $conn->prepare("SELECT * FROM students WHERE student_id = ?");
        $stmt->bind_param("s", $student_id);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
        error_log("Student found: " . $student['full_name']);
        
        if (password_verify($password, $student['password'])) {
            $_SESSION['student_id'] = $student['student_id'];
            $_SESSION['student_name'] = $student['full_name'];
            $_SESSION['user_type'] = 'student';
            error_log("Login successful for: " . $student['full_name']);
            echo "success";
        } else {
            error_log("Invalid password for student: " . $student_id);
            echo "Invalid password";
        }
    } else {
        error_log("Student not found: " . $student_id);
        echo "Student not found";
    }
    $stmt->close();
} else {
    echo "Error: Invalid request method";
}
$conn->close();
?>