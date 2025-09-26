<?php
require_once 'config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST" && $_SESSION['user_type'] == 'admin') {
    $pass_id = $_POST['passId'];
    $status = $_POST['status']; // 'approved' or 'rejected'
    
    $stmt = $conn->prepare("UPDATE gate_passes SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $pass_id);
    
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
}
$conn->close();
?>