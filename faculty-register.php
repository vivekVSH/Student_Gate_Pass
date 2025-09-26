<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = $_POST['firstName'];
    $last_name = $_POST['lastName'];
    $email = $_POST['email'];
    $department = $_POST['department'];
    $phone = $_POST['phone'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $faculty_id = 'FAC' . time(); // Generate a unique faculty ID

    // Check if faculty already exists
    $stmt = $conn->prepare("SELECT id FROM faculty WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Email already exists";
    } else {
        // Insert new faculty
        $stmt = $conn->prepare("INSERT INTO faculty (faculty_id, first_name, last_name, email, department, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $faculty_id, $first_name, $last_name, $email, $department, $phone, $password);
        
        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Error: " . $stmt->error;
        }
    }
    $stmt->close();
}
$conn->close();
?>