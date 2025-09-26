<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_type'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$user_type = $_SESSION['user_type'];
$query = "";
$params = [];
$param_types = "";

// Get filter parameters
$status = isset($_GET['status']) ? $_GET['status'] : 'all';
$type = isset($_GET['type']) ? $_GET['type'] : 'all';

if ($user_type == 'student') {
    $query = "SELECT * FROM gate_passes WHERE pass_type = 'student' AND user_id = ? ORDER BY requested_at DESC";
    $params[] = $_SESSION['student_id'];
    $param_types = "s";
} elseif ($user_type == 'faculty') {
    $query = "SELECT * FROM gate_passes WHERE pass_type = 'faculty' AND user_id = ? ORDER BY requested_at DESC";
    $params[] = $_SESSION['faculty_id'];
    $param_types = "s";
} elseif ($user_type == 'admin') {
    // Get filter parameters
    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    $type = isset($_GET['type']) ? $_GET['type'] : 'all';
    
    $query = "SELECT * FROM gate_passes WHERE 1=1";
    if ($status != 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
        $param_types .= "s";
    }
    if ($type != 'all') {
        $query .= " AND pass_type = ?";
        $params[] = $type;
        $param_types .= "s";
    }
    $query .= " ORDER BY requested_at DESC";
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
?>