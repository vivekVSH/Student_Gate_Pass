<?php
require_once 'config.php';

// Disable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 0");

// Reset the admin table
$conn->query("TRUNCATE TABLE admin");

// New admin credentials
$username = "admin";
$password = "Admin@123"; // New secure password
$email = "admin@college.com";
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert new admin
$sql = "INSERT INTO admin (username, password, email) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $username, $hashed_password, $email);

if ($stmt->execute()) {
    echo "<h2>New Admin Account Created Successfully!</h2>";
    echo "<p>Please use these credentials to login:</p>";
    echo "<div style='background: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 5px;'>";
    echo "<strong>Username:</strong> " . htmlspecialchars($username) . "<br>";
    echo "<strong>Password:</strong> " . htmlspecialchars($password) . "<br>";
    echo "<strong>Email:</strong> " . htmlspecialchars($email) . "<br>";
    echo "</div>";
    echo "<p>Please save these credentials and delete this file after first login.</p>";
    echo "<p><a href='admin-login.html'>Go to Admin Login</a></p>";
} else {
    echo "Error creating admin account: " . $stmt->error;
}

// Re-enable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 1");

$stmt->close();
$conn->close();
?>