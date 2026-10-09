<?php
// Define file paths for storage
define('CSV_FILE', 'students.csv');
define('JSON_FILE', 'students.json');

// Initialize form variables and errors
$name = $email = $mobile = $course = $year = $gender = "";
$errors = [];
$success_message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. SANITIZE INPUTS
    $name    = filter_var(trim($_POST['name'] ?? ''), FILTER_UNSAFE_RAW);
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $mobile  = filter_var(trim($_POST['mobile'] ?? ''), FILTER_UNSAFE_RAW);
    $password = $_POST['password'] ?? '';
    $course  = filter_var(trim($_POST['course'] ?? ''), FILTER_UNSAFE_RAW);
    $year    = filter_var(trim($_POST['year'] ?? ''), FILTER_UNSAFE_RAW);
    $gender  = $_POST['gender'] ?? '';
    $terms   = $_POST['terms'] ?? '';

    // 2. SERVER-SIDE VALIDATION
    if (empty($name)) { $errors['name'] = "Name is required."; }
    
    if (empty($email)) { 
        $errors['email'] = "Email is required."; 
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) { 
        $errors['email'] = "Invalid email format."; 
    }
    
    if (empty($mobile)) { 
        $errors['mobile'] = "Mobile number is required."; 
    } elseif (!preg_match("/^[0-9]{10}$/", $mobile)) { 
        $errors['mobile'] = "Mobile number must be exactly 10 digits."; 
    }

    // Strict Password Validation matching FAQ requirements
    $password_regex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
    if (empty($password)) {
        $errors['password'] = "Password is required.";
    } elseif (!preg_match($password_regex, $password)) {
        $errors['password'] = "Password must be at least 8 characters, contain an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    if (empty($course)) { $errors['course'] = "Please select your course."; }
    if (empty($year)) { $errors['year'] = "Please select your academic year."; }
    if (empty($gender)) { $errors['gender'] = "Gender selection is required."; }
    if (empty($terms)) { $errors['terms'] = "You must accept the terms and conditions."; }

    // 3. SECURE FILE STORAGE
    if (empty($errors)) {
        // Auto-generate a new Student ID based on timestamp count or records
        $student_id = "STU" . str_pad(rand(4, 999), 3, '0', STR_PAD_LEFT);
        
        // Hash password before saving for security
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $studentData = [
            'student_id'=> $student_id,
            'name'      => $name,
            'email'     => $email,
            'mobile'    => $mobile,
            'password'  => $hashed_password,
            'course'    => $course,
            'year'      => $year,
            'gender'    => $gender,
            'status'    => 'Active',
            'created_at'=> date("Y-m-d H:i:s")
        ];

        // Save to CSV Format
        $csvExists = file_exists(CSV_FILE);
        $csvHandle = fopen(CSV_FILE, 'a');
        if ($csvHandle) {
            if (!$csvExists) {
                fputcsv($csvHandle, ['StudentID', 'Name', 'Email', 'Mobile', 'PasswordHash', 'Course', 'Year', 'Gender', 'Status', 'CreatedAt']);
            }
            fputcsv($csvHandle, $studentData);
            fclose($csvHandle);
        }

        // Save to JSON Format
        $existingJson = [];
        if (file_exists(JSON_FILE)) {
            $existingJson = json_decode(file_get_contents(JSON_FILE), true) ?? [];
        }
        $existingJson[] = $studentData;
        file_put_contents(JSON_FILE, json_encode($existingJson, JSON_PRETTY_PRINT));

        $success_message = "Registration successful! Account created for " . htmlspecialchars($name);
        
        // Clear variables to refresh form inputs
        $name = $email = $mobile = $course = $year = $gender = "";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StudentHub - Register</title>
    <style>
        body { font-family: sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
        .navbar { background: #343a40; padding: 15px; text-align: center; }
        .navbar a { color: white; margin: 0 10px; text-decoration: none; font-size: 14px; }
        .container { max-width: 600px; background: white; margin: 40px auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1, h2 { text-align: center; color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; color: #555; }
        input[type="text"], input[type="email"], input[type="password"], select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .radio-group { display: flex; gap: 15px; padding-top: 5px; }
        .error { color: red; font-size: 13px; margin-top: 4px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin-bottom: 20px; text-align: center; }
        button { width: 100%; padding: 12px; background: #28a745; color: white; border: none; font-size: 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background: #218838; }
    </style>
</head>
<body>

<!-- StudentHub Structural Navigation -->
<div class="navbar">
    <a href="#">Home</a> <a href="#">About</a> <a href="#">Admin</a> <a href="#">Contact</a> 
    <a href="#">Dashboard</a> <a href="#">Events</a> <a href="#">FAQ</a> <a href="#">Feedback</a> 
    <a href="#">Login</a> <a href="#">Profile</a> <a href="#" style="font-weight:bold; text-decoration:underline;">Register</a> <a href="#">Students</a>
</div>

<div class="container">
    <h2>Create StudentHub Account</h2>
    
    <?php if (!empty($success_message)): ?>
        <div class="success"><?php echo htmlspecialchars($success_message); ?></div>
    <?php endif; ?>

    <form action="register.php" method="POST">
        <!-- Full Name -->
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value="<?php echo htmlspecialchars($name); ?>">
            <?php if(isset($errors['name'])): ?><div class="error"><?php echo $errors['name']; ?></div><?php endif; ?>
        </div>

        <!-- Email Address -->
        <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value="<?php echo htmlspecialchars($email); ?>">
            <?php if(isset($errors['email'])): ?><div class="error"><?php echo $errors['email']; ?></div><?php endif; ?>
        </div>

        <!-- Mobile Number -->
        <div class="form-group">
            <label>Mobile Number</label>
            <input type="text" name="mobile" value="<?php echo htmlspecialchars($mobile); ?>">
            <?php if(isset($errors['mobile'])): ?><div class="error"><?php echo $errors['mobile']; ?></div><?php endif; ?>
        </div>

        <!-- Password Fields matching FAQ validation check rules -->
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password">
            <?php if(isset($errors['password'])): ?><div class="error"><?php echo $errors['password']; ?></div><?php endif; ?>
        </div>

        <!-- Course Dropdown Selection -->
        <div class="form-group">
            <label>Course</label>
            <select name="course">
                <option value="">-- Select Course --</option>
                <option value="Science" <?php if($course=='Science') echo 'selected'; ?>>Science</option>
                <option value="Mathematics and Computing" <?php if($course=='Mathematics and Computing') echo 'selected'; ?>>Mathematics and Computing</option>
                <option value="Management" <?php if($course=='Management') echo 'selected'; ?>>Management</option>
            </select>
            <?php if(isset($errors['course'])): ?><div class="error"><?php echo $errors['course']; ?></div><?php endif; ?>
        </div>

        <!-- Year Dropdown Selection -->
        <div class="form-group">
            <label>Year</label>
            <select name="year">
                <option value="">-- Select Academic Year --</option>
                <option value="1st Year" <?php if($year=='1st Year') echo 'selected'; ?>>1st Year</option>
                <option value="2nd Year" <?php if($year=='2nd Year') echo 'selected'; ?>>2nd Year</option>
                <option value="3rd Year" <?php if($year=='3rd Year') echo 'selected'; ?>>3rd Year</option>
                <option value="4th Year" <?php if($year=='4th Year') echo 'selected'; ?>>4th Year</option>
            </select>
            <?php if(isset($errors['year'])): ?><div class="error"><?php echo $errors['year']; ?></div><?php endif; ?>
        </div>

        <!-- Gender Selection Radio Buttons -->
        <div class="form-group">
            <label>Gender</label>
            <div class="radio-group">
                <label><input type="radio" name="gender" value="Male" <?php if($gender=='Male') echo 'checked'; ?>> Male</label>
                <label><input type="radio" name="gender" value="Female" <?php if($gender=='Female') echo 'checked'; ?>> Female</label>
                <label><input type="radio" name="gender" value="Other" <?php if($gender=='Other') echo 'checked'; ?>> Other</label>
            </div>
            <?php if(isset($errors['gender'])): ?><div class="error"><?php echo $errors['gender']; ?></div><?php endif; ?>
        </div>

        <!-- Terms Agreement Checkbox -->
        <div class="form-group">
            <label style="font-weight: normal;">
                <input type="checkbox" name="terms" value="accepted"> I accept all registration terms and portal policies.
            </label>
            <?php if(isset($errors['terms'])): ?><div class="error"><?php echo $errors['terms']; ?></div><?php endif; ?>
