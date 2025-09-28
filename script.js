// Initialize all functions before DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin-dashboard.html')) {
        initializeDashboard();
    }
});

// Check if user is logged in
function checkAuth() {
    fetch('/Student_Get_Pass/check-auth.php', {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.isLoggedIn) {
            window.location.href = '/Student_Get_Pass/index.html';
            return;
        }

        // Redirect if user is on wrong dashboard
        const currentPage = window.location.pathname;
        const userType = data.userType;

        if (!currentPage.includes(`${userType}-dashboard.html`)) {
            window.location.href = `/Student_Get_Pass/${userType}-dashboard.html`;
        }
    })
    .catch(error => {
        console.error('Auth check failed:', error);
        window.location.href = '/Student_Get_Pass/index.html';
    });
}

// Handle Student Login
function handleStudentLogin(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;

    console.log('Login attempt:', { studentId, password: password ? 'SET' : 'EMPTY' });

    if (!studentId || !password) {
        alert('Please enter both Student ID and password');
        return;
    }

    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('password', password);

    console.log('Sending login request...');

    fetch('/Student_Get_Pass/student-login.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(result => {
        console.log('Server response:', result);
        if (result.includes('success')) {
            console.log('Login successful, redirecting...');
            window.location.href = '/Student_Get_Pass/student-dashboard.html';
        } else {
            alert('Login failed: ' + result);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('An error occurred during login: ' + error.message);
    });
}

// Handle Faculty Login
function handleFacultyLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Clear previous errors
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    fetch('/Student_Get_Pass/faculty-login.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        if (result.includes('success')) {
            window.location.href = '/Student_Get_Pass/faculty-dashboard.html';
        } else {
            if (errorDiv) {
                errorDiv.textContent = result;
                errorDiv.style.display = 'block';
            } else {
                alert(result);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login');
    });
}

// Handle Admin Login
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    console.log('Admin login attempt:', { username, password: password ? 'SET' : 'EMPTY' });

    // Clear previous error messages
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    console.log('Sending admin login request...');

    fetch('/Student_Get_Pass/admin-login.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(result => {
        console.log('Server response:', result);
        if (result.includes('success')) {
            console.log('Admin login successful, redirecting...');
            window.location.href = '/Student_Get_Pass/admin-dashboard.html';
        } else {
            if (errorDiv) {
                errorDiv.textContent = result;
                errorDiv.style.display = 'block';
            } else {
                alert('Login failed: ' + result);
            }
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('An error occurred during login: ' + error.message);
    });
}

// Handle Student Registration
function handleStudentRegistration(event) {
    event.preventDefault();
    
    // Get form element
    const form = event.target;
    
    // Get all form values
    const fullName = form.fullName.value;
    const email = form.email.value;
    const studentId = form.studentId.value;
    const classValue = form.class.value;
    const division = form.division.value;
    const rollNo = form.rollNo.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Debug: Log all values
    console.log('Form values:', {
        fullName, email, studentId, classValue, division, rollNo, password, confirmPassword
    });

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Validate all fields are filled
    if (!fullName || !email || !studentId || !classValue || !division || !rollNo || !password) {
        alert('Please fill in all fields');
        return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('studentId', studentId);
    formData.append('class', classValue);
    formData.append('division', division);
    formData.append('rollNo', rollNo);
    formData.append('password', password);

    // Debug: Log form data
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    fetch('/Student_Get_Pass/student-register.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        console.log('Server response:', result);
        if (result.includes('success')) {
            alert('Registration successful! Please login with your credentials');
            window.location.href = '/Student_Get_Pass/student-login.html';
        } else {
            alert('Error: ' + result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration: ' + error.message);
    });
}

// Handle Faculty Registration
function handleFacultyRegistration(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('department', department);
    formData.append('phone', phone);
    formData.append('password', password);

    fetch('/Student_Get_Pass/faculty-register.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        if (result.includes('success')) {
            alert('Registration successful! Please login with your credentials');
            window.location.href = '/Student_Get_Pass/faculty-login.html';
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration');
    });
}

// Update Passes List
function updatePassesList() {
    fetch('/Student_Get_Pass/get-passes.php', {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(passes => {
        displayPasses(passes);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching gate passes');
    });
}

// Submit Student Gate Pass Request
function submitGatePass(event) {
    event.preventDefault();
    
    // Get form element
    const form = event.target;
    
    // Get all form values
    const rollNo = form.rollNo.value;
    const classValue = form.class.value;
    const div = form.div.value;
    const contactNo = form.contactNo.value;
    const date = form.date.value;
    const timeOut = form.timeOut.value;
    const reason = form.reason.value;

    console.log('Student pass data:', { rollNo, classValue, div, contactNo, date, timeOut, reason });

    // Validate all fields are filled
    if (!rollNo || !classValue || !div || !contactNo || !date || !timeOut || !reason) {
        alert('Please fill in all fields');
        return;
    }

    const formData = new FormData();
    formData.append('type', 'student');
    formData.append('rollNo', rollNo);
    formData.append('class', classValue);
    formData.append('div', div);
    formData.append('contactNo', contactNo);
    formData.append('date', date);
    formData.append('timeOut', timeOut);
    formData.append('reason', reason);

    console.log('Sending student pass request...');

    fetch('/Student_Get_Pass/submit-pass.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        console.log('Server response:', result);
        if (result.includes('success')) {
            alert('Gate pass request submitted successfully!');
            updatePassesList();
            event.target.reset();
        } else {
            alert('Error: ' + result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the gate pass request: ' + error.message);
    });
}

// Submit Faculty Gate Pass Request
function submitFacultyPass(event) {
    event.preventDefault();
    
    // Get form element
    const form = event.target;
    
    // Get all form values
    const date = form.date.value;
    const timeOut = form.timeOut.value;
    const timeFormat = form.timeFormat.value;
    const duration = form.duration.value;
    const phone = form.phone.value;
    const reason = form.reason.value;

    console.log('Faculty pass data:', { date, timeOut, timeFormat, duration, phone, reason });

    // Validate all fields are filled
    if (!date || !timeOut || !timeFormat || !duration || !phone || !reason) {
        alert('Please fill in all fields');
        return;
    }

    const formData = new FormData();
    formData.append('type', 'faculty');
    formData.append('date', date);
    formData.append('timeOut', timeOut);
    formData.append('timeFormat', timeFormat);
    formData.append('duration', duration);
    formData.append('phone', phone);
    formData.append('reason', reason);

    console.log('Sending faculty pass request...');

    fetch('/Student_Get_Pass/submit-pass.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        console.log('Server response:', result);
        if (result.includes('success')) {
            alert('Gate pass request submitted successfully!');
            updatePassesList();
            toggleRequestPassForm();
            event.target.reset();
        } else {
            alert('Error: ' + result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the gate pass request: ' + error.message);
    });
}

// Handle Pass Actions (Approve/Reject)
function handlePassAction(action, passId) {
    if (!confirm(`Are you sure you want to ${action} this pass request?`)) {
        return;
    }

    const formData = new FormData();
    formData.append('passId', passId);
    formData.append('status', action === 'approve' ? 'approved' : 'rejected');

    fetch('/Student_Get_Pass/update-pass-status.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        if (result.includes('success')) {
            alert(`Pass ${action}d successfully!`);
            // Update both the list and stats
            updatePassesList();
            updateDashboardStats();
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the pass status');
    });
}

// Display Passes
function displayPasses(passes) {
    const container = document.getElementById('passesList') || document.getElementById('pendingPassList');
    if (!container) return;

    if (!Array.isArray(passes)) {
        container.innerHTML = '<div class="alert alert-danger">Error loading passes</div>';
        return;
    }

    if (passes.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No gate passes found</div>';
        return;
    }

    container.innerHTML = passes.map(pass => `
        <div class="pass-request-card ${pass.status || 'pending'}">
            <div class="pass-header">
                <span class="badge badge-${pass.pass_type}">${pass.pass_type.charAt(0).toUpperCase() + pass.pass_type.slice(1)}</span>
                <span class="status-badge status-${pass.status || 'pending'}">${(pass.status || 'pending').toUpperCase()}</span>
                <span class="pass-date">Date: ${new Date(pass.date).toLocaleDateString()}</span>
            </div>
            <div class="pass-details">
                <p><strong>Name:</strong> ${pass.name || 'N/A'}</p>
                ${pass.pass_type === 'student' ? `
                    <p><strong>Class:</strong> ${pass.class || 'N/A'}</p>
                    <p><strong>Division:</strong> ${pass.division || 'N/A'}</p>
                    <p><strong>Roll No:</strong> ${pass.roll_no || 'N/A'}</p>
                ` : `
                    <p><strong>Department:</strong> ${pass.class_or_department || 'N/A'}</p>
                    <p><strong>Duration:</strong> ${pass.duration || 'Not specified'}</p>
                `}
                <p><strong>Contact:</strong> ${pass.contact_no || 'N/A'}</p>
                <p><strong>Time Out:</strong> ${pass.time_out || 'N/A'} ${pass.time_format || ''}</p>
                <p><strong>Reason:</strong> ${pass.reason || 'N/A'}</p>
                ${pass.status ? `
                    <div class="status-message ${pass.status}">
                        ${pass.status === 'approved' ? 
                            '<p class="success-message">✓ Your request has been approved. You may leave the campus.</p>' :
                            pass.status === 'rejected' ? 
                            '<p class="error-message">✗ Your request has been rejected.</p>' : ''
                        }
                    </div>
                ` : ''}
            </div>
            ${window.location.pathname.includes('admin-dashboard') && (!pass.status || pass.status === 'pending') ? `
                <div class="pass-actions">
                    <button onclick="handlePassAction('approve', '${pass.id}')" class="btn btn-success">Approve</button>
                    <button onclick="handlePassAction('reject', '${pass.id}')" class="btn btn-danger">Reject</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Toggle Request Pass Form
function toggleRequestPassForm() {
    const form = document.getElementById('gatePassForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

// Handle Logout
function handleLogout() {
    fetch('/Student_Get_Pass/logout.php', {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then(() => {
        window.location.href = '/Student_Get_Pass/index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during logout');
    });
}

// Update Dashboard Stats
function updateDashboardStats() {
    fetch('/Student_Get_Pass/get-dashboard-stats.php', {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(stats => {
        // Update admin dashboard stats
        if (window.location.pathname.includes('admin-dashboard')) {
            document.getElementById('totalStudents').textContent = stats.totalStudents;
            document.getElementById('totalFaculty').textContent = stats.totalFaculty;
            document.getElementById('studentPasses').textContent = stats.studentPasses;
            document.getElementById('facultyPasses').textContent = stats.facultyPasses;
            document.getElementById('totalPasses').textContent = stats.totalPasses;
            document.getElementById('pendingPasses').textContent = stats.pendingPasses;
        }
        // Update student/faculty dashboard stats
        else {
            const totalPassesElement = document.getElementById('totalPasses');
            const activePassesElement = document.getElementById('activePasses');
            
            if (totalPassesElement) {
                if (window.location.pathname.includes('student-dashboard')) {
                    totalPassesElement.textContent = stats.studentPasses;
                } else if (window.location.pathname.includes('faculty-dashboard')) {
                    totalPassesElement.textContent = stats.facultyPasses;
                }
            }
            if (activePassesElement) {
                activePassesElement.textContent = stats.activePasses;
            }
        }
    })
    .catch(error => {
        console.error('Error fetching dashboard stats:', error);
    });
}

// Fetch Passes with Filters
function fetchPasses(status = 'pending', type = 'all') {
    const queryParams = new URLSearchParams({
        status: status,
        type: type
    });
    
    fetch(`/Student_Get_Pass/get-passes.php?${queryParams}`, {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(passes => {
        displayPasses(passes);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while filtering passes');
    });
}

// Filter Passes by Status
function filterPasses(status) {
    const type = document.getElementById('userTypeFilter').value;
    fetchPasses(status, type);
}

// Filter Passes by Type
function filterPassesByType(type) {
    const status = document.getElementById('passFilter').value;
    fetchPasses(status, type);
}

// Initialize Dashboard Data
function initializeDashboard() {
    checkAuth();
    updateDashboardStats();
    updatePassesList();
    updateUserName();

    // Set up auto-refresh for admin dashboard
    if (window.location.pathname.includes('admin-dashboard')) {
        setInterval(() => {
            updateDashboardStats();
            updatePassesList();
        }, 30000); // Refresh every 30 seconds
    }
}

// Update User Name in Dashboard
function updateUserName() {
    fetch('/Student_Get_Pass/check-auth.php', {
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn && data.userName) {
            const nameElement = document.getElementById('studentName') || 
                               document.getElementById('facultyName') || 
                               document.getElementById('adminName');
            if (nameElement) {
                nameElement.textContent = data.userName;
            }
        }
    })
    .catch(error => {
        console.error('Error fetching user name:', error);
    });
}

// Call initializeDashboard when the page loads
if (document.body.classList.contains('dashboard') || 
    window.location.pathname.includes('dashboard.html')) {
    initializeDashboard();
}