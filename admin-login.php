<?php
require_once 'config.php';

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debug: Log admin login attempt
error_log("Admin login attempt started");
error_log("POST data: " . print_r($_POST, true));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    if (empty($username) || empty($password)) {
        echo "Error: Username and password are required";
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        error_log("Admin found: " . $admin['username']);
        
        // Debug password verification in detail
        error_log("Input password length: " . strlen($password));
        error_log("Stored hash length: " . strlen($admin['password']));
        
        // Generate a new hash for comparison
        $new_hash = password_hash('admin123', PASSWORD_BCRYPT);
        error_log("New hash generated for comparison: " . $new_hash);
        
        $verify_result = password_verify($password, $admin['password']);
        error_log("Password verification result: " . ($verify_result ? 'true' : 'false'));
        
        if ($verify_result) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_name'] = $admin['username'];
            $_SESSION['user_type'] = 'admin';
            error_log("Admin login successful: " . $admin['username']);
            echo "success";
        } else {
            error_log("Invalid password for admin: " . $username);
            // For debugging only, remove in production
            error_log("Attempted password first 3 chars: " . substr($password, 0, 3));
            echo "Invalid password";
        }
    } else {
        error_log("Admin not found: " . $username);
        echo "Admin not found";
    }
    $stmt->close();
} else {
    echo "Error: Invalid request method";
}
$conn->close();
?>