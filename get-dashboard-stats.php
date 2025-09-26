<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_type'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$stats = array();

// Get total students
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM students");
$stmt->execute();
$result = $stmt->get_result();
$stats['totalStudents'] = $result->fetch_assoc()['total'];

// Get total faculty
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM faculty");
$stmt->execute();
$result = $stmt->get_result();
$stats['totalFaculty'] = $result->fetch_assoc()['total'];

// Get student passes count
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM gate_passes WHERE pass_type = 'student'");
$stmt->execute();
$result = $stmt->get_result();
$stats['studentPasses'] = $result->fetch_assoc()['total'];

// Get faculty passes count
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM gate_passes WHERE pass_type = 'faculty'");
$stmt->execute();
$result = $stmt->get_result();
$stats['facultyPasses'] = $result->fetch_assoc()['total'];

// Get active passes (approved and not expired)
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM gate_passes WHERE status = 'approved' AND date >= CURRENT_DATE");
$stmt->execute();
$result = $stmt->get_result();
$stats['activePasses'] = $result->fetch_assoc()['total'];

// Get total passes
$stats['totalPasses'] = $stats['studentPasses'] + $stats['facultyPasses'];

// Get pending passes count
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM gate_passes WHERE status = 'pending' OR status IS NULL");
$stmt->execute();
$result = $stmt->get_result();
$stats['pendingPasses'] = $result->fetch_assoc()['total'];

echo json_encode($stats);
?>