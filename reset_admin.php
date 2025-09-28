<?php
require_once 'config.php';

// Create a new password hash
$password = 'admin123';
$hash = password_hash($password, PASSWORD_BCRYPT);

// Update the admin password
$stmt = $conn->prepare("UPDATE admin SET password = ? WHERE username = 'admin'");
$stmt->bind_param("s", $hash);

if ($stmt->execute()) {
    echo "Admin password has been reset successfully.\n";
    echo "Username: admin\n";
    echo "Password: admin123\n";
    echo "New Hash: " . $hash . "\n";
} else {
    echo "Error resetting password: " . $conn->error . "\n";
}

$stmt->close();
$conn->close();
?>