# Student Gate Pass Management System

A complete web-based gate pass management system for educational institutions, allowing students and faculty to request gate passes and administrators to manage them.

## Features

### For Students
- ✅ User registration and login
- ✅ Submit gate pass requests
- ✅ View pass status and history
- ✅ Dashboard with statistics

### For Faculty
- ✅ User registration and login
- ✅ Submit gate pass requests
- ✅ View personal pass history
- ✅ Department-based access

### For Administrators
- ✅ Complete system oversight
- ✅ Approve/reject pass requests
- ✅ View all statistics
- ✅ Filter and manage requests
- ✅ Student management interface

## Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** PHP 7+ with MySQLi
- **Database:** MySQL
- **Server:** XAMPP (Apache + MySQL)

## Installation & Setup

### Prerequisites
- XAMPP or similar local server environment
- PHP 7.0 or higher
- MySQL 5.7 or higher

### Setup Instructions

1. **Download and Extract**
   - Extract all files to your XAMPP `htdocs` folder
   - Ensure the folder structure is: `C:\xampp\htdocs\Student_Get_Pass\`

2. **Database Setup**
   - Start XAMPP (Apache and MySQL)
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import the `database.sql` file to create the database and tables
   - The database will be created as `gatepassdb`

3. **Test Installation**
   - Visit `http://localhost/Student_Get_Pass/test-setup.php`
   - Verify all tables are created and database connection works

4. **Access the Application**
   - Open `http://localhost/Student_Get_Pass/` in your browser
   - The system is ready to use!

## Default Login Credentials

### Admin Account
- **Username:** admin
- **Password:** admin123

### Sample Student Account
- **Student ID:** S123456
- **Password:** admin123

### Sample Faculty Account
- **Email:** robert@faculty.com
- **Password:** admin123

## File Structure

```
Student_Get_Pass/
├── index.html                 # Landing page
├── config.php                 # Database configuration
├── database.sql              # Database schema
├── styles.css                # All styling
├── script.js                 # All JavaScript functionality
├── test-setup.php            # Installation test
├── README.md                 # This file
│
├── Authentication/
│   ├── student-login.html/php
│   ├── student-register.html/php
│   ├── faculty-login.html/php
│   ├── faculty-register.html/php
│   ├── admin-login.html/php
│   ├── check-auth.php
│   └── logout.php
│
├── Dashboards/
│   ├── student-dashboard.html
│   ├── faculty-dashboard.html
│   └── admin-dashboard.html
│
└── API/
    ├── get-passes.php
    ├── get-dashboard-stats.php
    ├── submit-pass.php
    └── update-pass-status.php
```

## Database Schema

### Tables
- **students** - Student information and credentials
- **faculty** - Faculty information and credentials  
- **admin** - Administrator accounts
- **gate_passes** - Pass requests with status tracking
- **status_logs** - Audit trail for pass status changes

### Key Features
- Proper foreign key relationships
- Status tracking (pending, approved, rejected)
- Audit logging for all status changes
- Optimized indexes for performance

## Usage Guide

### For Students
1. Register a new account or login with existing credentials
2. Click "Request New Pass" on the dashboard
3. Fill in the gate pass form with required details
4. Submit the request and wait for approval
5. Check the dashboard for status updates

### For Faculty
1. Register a new account or login with existing credentials
2. Click "Request New Pass" on the dashboard
3. Fill in the faculty gate pass form
4. Submit the request and wait for approval
5. View pass history on the dashboard

### For Administrators
1. Login with admin credentials
2. View all pending pass requests
3. Approve or reject requests as needed
4. Monitor system statistics
5. Filter requests by type and status

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure XAMPP MySQL is running
   - Check database credentials in `config.php`
   - Verify database `gatepassdb` exists

2. **Session Issues**
   - Clear browser cookies and cache
   - Ensure PHP sessions are enabled
   - Check file permissions

3. **Pass Submission Fails**
   - Verify all required fields are filled
   - Check browser console for JavaScript errors
   - Ensure user is properly logged in

4. **Styling Issues**
   - Clear browser cache
   - Check if `styles.css` is loading properly
   - Verify file paths are correct

### Support
If you encounter any issues:
1. Check the browser console for errors
2. Verify database connection with `test-setup.php`
3. Ensure all files are in the correct directory structure

## Security Features

- Password hashing using PHP's `password_hash()`
- SQL injection prevention with prepared statements
- Session-based authentication
- Input validation and sanitization
- CSRF protection ready (can be added)

## Future Enhancements

- Email notifications for status changes
- File upload support for documents
- Mobile app integration
- Advanced reporting and analytics
- Bulk operations for administrators
- Time validation for past dates

## License

This project is open source and available under the MIT License.

---

**Note:** This system is designed for educational purposes. For production use, additional security measures and testing are recommended.
