<?php
require_once 'config.php';

echo "<h2>Admin Database Check</h2>";

// Check if admin table exists
$result = $conn->query("SHOW TABLES LIKE 'admin'");
if ($result->num_rows > 0) {
    echo "<p style='color: green;'>✅ Admin table exists</p>";
} else {
    echo "<p style='color: red;'>❌ Admin table does not exist</p>";
    exit;
}

// Show all admins
$result = $conn->query("SELECT id, username, email, created_at FROM admin ORDER BY created_at DESC");
if ($result->num_rows > 0) {
    echo "<h3>Admins in Database:</h3>";
    echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 20px 0;'>";
    echo "<tr style='background: #f8f9fa;'>";
    echo "<th>ID</th><th>Username</th><th>Email</th><th>Created</th>";
    echo "</tr>";
    
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . htmlspecialchars($row['username']) . "</td>";
        echo "<td>" . htmlspecialchars($row['email']) . "</td>";
        echo "<td>" . $row['created_at'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h3>Test Admin Login:</h3>";
    echo "<form method='POST' action='admin-login.php'>";
    echo "<p>Username: <input type='text' name='username' value='admin' required></p>";
    echo "<p>Password: <input type='password' name='password' value='admin123' required></p>";
    echo "<p><button type='submit'>Test Login</button></p>";
    echo "</form>";
    
} else {
    echo "<p style='color: red;'>❌ No admins found in database!</p>";
    echo "<h3>Create Default Admin:</h3>";
    echo "<p>Run this SQL query in phpMyAdmin:</p>";
    echo "<pre>";
    echo "INSERT INTO admin (username, password, email) VALUES \n";
    echo "('admin', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@admin.com');";
    echo "</pre>";
    echo "<p><strong>Password:</strong> admin123</p>";
}

echo "<p><a href='admin-login.html'>Admin Login Page</a> | <a href='index.html'>Home</a></p>";

$conn->close();
?>
