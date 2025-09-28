<?php
require_once 'config.php';

// Return session status
$response = array(
    'isLoggedIn' => isset($_SESSION['user_type']),
    'userType' => isset($_SESSION['user_type']) ? $_SESSION['user_type'] : null,
    'userName' => null
);

// Get user name based on user type
if (isset($_SESSION['user_type'])) {
    if ($_SESSION['user_type'] == 'student' && isset($_SESSION['student_name'])) {
        $response['userName'] = $_SESSION['student_name'];
    } elseif ($_SESSION['user_type'] == 'faculty' && isset($_SESSION['faculty_name'])) {
        $response['userName'] = $_SESSION['faculty_name'];
    } elseif ($_SESSION['user_type'] == 'admin' && isset($_SESSION['admin_name'])) {
        $response['userName'] = $_SESSION['admin_name'];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>