<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Disable error display for JSON responses
if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
    error_reporting(0);
    ini_set('display_errors', 0);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gatepassdb";

// Create connection
try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit();
}
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>