<?php
require_once 'config.php';

// Return session status
$response = array(
    'isLoggedIn' => isset($_SESSION['user_type']),
    'userType' => isset($_SESSION['user_type']) ? $_SESSION['user_type'] : null,
    'userName' => isset($_SESSION['student_name']) ? $_SESSION['student_name'] : 
                 (isset($_SESSION['faculty_name']) ? $_SESSION['faculty_name'] : null)
);

header('Content-Type: application/json');
echo json_encode($response);
?>