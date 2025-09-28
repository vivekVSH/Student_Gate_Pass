<?php
// Prevent any output before headers
ob_start();

// Function to send JSON response
function sendJsonResponse($data, $statusCode = 200) {
    ob_clean(); // Clear any output buffers
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-cache, must-revalidate');
    try {
        echo json_encode($data, JSON_THROW_ON_ERROR);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'JSON encoding error: ' . $e->getMessage()]);
    }
    exit;
}

try {
    require_once 'config.php';

    // Check authentication
    if (!isset($_SESSION['user_type'])) {
        sendJsonResponse(['error' => 'Unauthorized'], 401);
    }

// Initialize variables
$user_type = $_SESSION['user_type'];
$status = isset($_GET['status']) ? $_GET['status'] : 'all';
$type = isset($_GET['type']) ? $_GET['type'] : 'all';

// Get filter parameters
$status = isset($_GET['status']) ? $_GET['status'] : 'all';
$type = isset($_GET['type']) ? $_GET['type'] : 'all';

if ($user_type == 'student') {
    // Get student's own passes with student details
    $query = "SELECT gp.*, s.full_name as name, s.class, s.division, s.roll_no, s.email 
              FROM gate_passes gp 
              JOIN students s ON gp.requestor_id = s.id 
              WHERE gp.pass_type = 'student' AND s.student_id = ? 
              ORDER BY gp.created_at DESC";
    $params[] = $_SESSION['student_id'];
    $param_types = "s";
} elseif ($user_type == 'faculty') {
    // Get faculty's own passes with faculty details
    $query = "SELECT gp.*, CONCAT(f.first_name, ' ', f.last_name) as name, f.department, f.email 
              FROM gate_passes gp 
              JOIN faculty f ON gp.requestor_id = f.id 
              WHERE gp.pass_type = 'faculty' AND f.faculty_id = ? 
              ORDER BY gp.created_at DESC";
    $params[] = $_SESSION['faculty_id'];
    $param_types = "s";
} elseif ($user_type == 'admin') {
    // Get all passes with proper joins for admin view
    $query = "SELECT 
        gp.id,
        gp.pass_type,
        gp.requestor_id,
        gp.status,
        gp.date,
        gp.time_out,
        gp.time_format,
        gp.duration,
        gp.reason,
        gp.contact_no,
        CASE 
            WHEN gp.pass_type = 'student' THEN s.full_name
            WHEN gp.pass_type = 'faculty' THEN CONCAT(f.first_name, ' ', f.last_name)
        END as full_name,
        CASE 
            WHEN gp.pass_type = 'student' THEN s.class
            ELSE f.department
        END as class,
        s.division as division,
        s.roll_no as roll_no,
        CASE 
            WHEN gp.pass_type = 'student' THEN s.email
            ELSE f.email
        END as email,
        gp.created_at
    FROM gate_passes gp 
    LEFT JOIN students s ON (gp.requestor_id = s.id AND gp.pass_type = 'student')
    LEFT JOIN faculty f ON (gp.requestor_id = f.id AND gp.pass_type = 'faculty')
    WHERE 1=1";
    
    if ($status != 'all') {
        $query .= " AND gp.status = ?";
        $params[] = $status;
        $param_types .= "s";
    }
    if ($type != 'all') {
        $query .= " AND gp.pass_type = ?";
        $params[] = $type;
        $param_types .= "s";
    }
    $query .= " ORDER BY gp.created_at DESC";
}

$stmt = $conn->prepare($query);
if (!empty($params)) {
    $stmt->bind_param($param_types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();
$passes = [];

while ($row = $result->fetch_assoc()) {
    $passes[] = $row;
}

echo json_encode($passes);

    $stmt->close();
    $conn->close();
    
    sendJsonResponse($passes);
} catch (Exception $e) {
    sendJsonResponse(['error' => $e->getMessage()], 500);
}
?>