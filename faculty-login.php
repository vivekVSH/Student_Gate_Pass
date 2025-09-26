<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM faculty WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $faculty = $result->fetch_assoc();
        if (password_verify($password, $faculty['password'])) {
            $_SESSION['faculty_id'] = $faculty['faculty_id'];
            $_SESSION['faculty_name'] = $faculty['first_name'] . ' ' . $faculty['last_name'];
            $_SESSION['faculty_department'] = $faculty['department'];
            $_SESSION['user_type'] = 'faculty';
            echo "success";
        } else {
            echo "Invalid password";
        }
    } else {
        echo "Faculty not found";
    }
    $stmt->close();
}
$conn->close();
?>