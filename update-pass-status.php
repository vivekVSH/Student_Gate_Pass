<?php
require_once 'config.php';

// Verify admin is logged in
if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    echo "Error: Unauthorized access";
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $pass_id = isset($_POST['pass_id']) ? intval($_POST['pass_id']) : 0;
    $status = isset($_POST['status']) ? $_POST['status'] : '';
    
    if (!$pass_id || !in_array($status, ['approved', 'rejected'])) {
        echo "Error: Invalid parameters";
        exit;
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Update gate pass status
        $stmt = $conn->prepare("UPDATE gate_passes SET status = ?, reviewed_by = ?, reviewer_type = 'admin' WHERE id = ?");
        $admin_id = $_SESSION['admin_id'];
        $stmt->bind_param("sii", $status, $admin_id, $pass_id);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to update pass status");
        }
        
        // Log the status change
        $log_stmt = $conn->prepare("INSERT INTO status_logs (pass_id, status, reviewed_by, reviewer_type) VALUES (?, ?, ?, 'admin')");
        $log_stmt->bind_param("isi", $pass_id, $status, $admin_id);
        
        if (!$log_stmt->execute()) {
            throw new Exception("Failed to log status change");
        }
        
        // Commit transaction
        $conn->commit();
        echo "success";
        
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        error_log("Error updating pass status: " . $e->getMessage());
        echo "Error: " . $e->getMessage();
    }
    
    if (isset($stmt)) $stmt->close();
    if (isset($log_stmt)) $log_stmt->close();
}

$conn->close();
?>