<?php
$password = 'admin123';
$hash = password_hash($password, PASSWORD_BCRYPT);
echo "Password: admin123\n";
echo "Generated Hash: " . $hash . "\n";
echo "Hash Length: " . strlen($hash) . "\n";

// Verify the hash
$verify = password_verify($password, $hash);
echo "Verification Result: " . ($verify ? "Success" : "Failed") . "\n";
?>