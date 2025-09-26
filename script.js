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
            if (userType === 'student') {
                window.location.href = '/Student_Get_Pass/student-dashboard.html';
            } else if (userType === 'admin') {
                window.location.href = '/Student_Get_Pass/admin-dashboard.html';
            } else if (userType === 'faculty') {
                window.location.href = '/Student_Get_Pass/faculty-dashboard.html';
            }
        }
    })
    .catch(error => {
        console.error('Auth check failed:', error);
        window.location.href = '/Student_Get_Pass/index.html';
    });
}

// Update Passes List
function updatePassesList() {
    fetch('get-passes.php')
    .then(response => response.json())
    .then(passes => {
        displayPasses(passes);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching gate passes');
    });
}

// Handle Student Registration
function handleStudentRegistration(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('studentId', studentId);
    formData.append('password', password);

    fetch('student-register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('Registration successful! Please login with your credentials');
            window.location.href = 'student-login.html';
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration');
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
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('Registration successful! Please login with your credentials');
            window.location.href = 'faculty-login.html';
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration');
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
        if (errorDiv) {
            errorDiv.textContent = 'An error occurred during login';
            errorDiv.style.display = 'block';
        } else {
            alert('An error occurred during login');
        }
    });
}

// Handle Student Login
function handleStudentLogin(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('password', password);

    fetch('/Student_Get_Pass/student-login.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        if (result.includes('success')) {
            window.location.href = '/Student_Get_Pass/student-dashboard.html';
        } else {
            alert(result);
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

    // Clear previous error messages
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('/Student_Get_Pass/admin-login.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        if (result.includes('success')) {
            window.location.href = '/Student_Get_Pass/admin-dashboard.html';
        } else {
            if (errorDiv) {
                errorDiv.textContent = result;
                errorDiv.style.display = 'block';
            } else {
                alert(result);
            }
            document.getElementById('password').value = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (errorDiv) {
            errorDiv.textContent = 'An error occurred during login';
            errorDiv.style.display = 'block';
        } else {
            alert('An error occurred during login');
        }
    });
}

// Handle Student Registration
function handleStudentRegistration(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('studentId', studentId);
    formData.append('password', password);

    fetch('student-register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('Registration successful! Please login with your credentials');
            window.location.href = 'student-login.html';
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration');
    });
}

// Handle Logout
function handleLogout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Initialize Dashboard Data
function initializeDashboard() {
    const userType = localStorage.getItem('userType');
    const passes = JSON.parse(localStorage.getItem('passes') || '[]');
    
    if (userType === 'student') {
        const studentId = localStorage.getItem('studentId');
        const studentName = localStorage.getItem('studentName');
        document.getElementById('studentName').textContent = studentName;
        
        // Get student's passes
        const studentPasses = passes.filter(p => p.type === 'student' && p.studentId === studentId);
        const activePasses = studentPasses.filter(p => p.status === 'approved');
        
        // Update statistics
        document.getElementById('totalPasses').textContent = studentPasses.length;
        document.getElementById('activePasses').textContent = activePasses.length;
        
        // Update passes list
        updatePassesList();
    } else if (userType === 'faculty') {
        const facultyId = localStorage.getItem('facultyId');
        const facultyName = localStorage.getItem('facultyName');
        document.getElementById('facultyName').textContent = facultyName;
        
        // Get faculty's passes
        const facultyPasses = passes.filter(p => p.type === 'faculty' && p.facultyId === facultyId);
        const activePasses = facultyPasses.filter(p => p.status === 'approved');
        
        // Update statistics
        document.getElementById('totalPasses').textContent = facultyPasses.length;
        document.getElementById('activePasses').textContent = activePasses.length;
        
        // Update passes list
        updatePassesList();
    } else if (userType === 'admin') {
        const adminName = localStorage.getItem('adminName');
        document.getElementById('adminName').textContent = adminName;
        
        // Calculate statistics
        const studentPasses = passes.filter(p => p.type === 'student');
        const facultyPasses = passes.filter(p => p.type === 'faculty');
        const pendingPasses = passes.filter(p => p.status === 'pending');
        const approvedPasses = passes.filter(p => p.status === 'approved');
        
        // Get total users
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const faculty = JSON.parse(localStorage.getItem('faculty') || '[]');
        
        // Update statistics
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('totalFaculty').textContent = faculty.length;
        document.getElementById('totalPasses').textContent = passes.length;
        document.getElementById('studentPasses').textContent = studentPasses.length;
        document.getElementById('facultyPasses').textContent = facultyPasses.length;
        document.getElementById('pendingPasses').textContent = pendingPasses.length;
        document.getElementById('approvedPasses').textContent = approvedPasses.length;
        
        // Update passes list
        updatePassesList();
    }
}

// Toggle Gate Pass Request Form
function toggleRequestPassForm() {
    const form = document.getElementById('gatePassForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Submit Faculty Gate Pass Request
function submitFacultyPass(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('type', 'faculty');
    formData.append('phone', document.getElementById('phone').value);
    formData.append('date', document.getElementById('date').value);
    formData.append('timeOut', document.getElementById('timeOut').value);
    formData.append('timeFormat', document.getElementById('timeFormat').value);
    formData.append('duration', document.getElementById('duration').value);
    formData.append('reason', document.getElementById('reason').value);

    fetch('submit-pass.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('Gate pass request submitted successfully!');
            updatePassesList();
            toggleRequestPassForm();
            event.target.reset();
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the gate pass request');
    });
}

// Submit Student Gate Pass Request
function submitGatePass(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('type', 'student');
    formData.append('rollNo', document.getElementById('rollNo').value);
    formData.append('class', document.getElementById('class').value);
    formData.append('div', document.getElementById('div').value);
    formData.append('contactNo', document.getElementById('contactNo').value);
    formData.append('date', document.getElementById('date').value);
    formData.append('reason', document.getElementById('reason').value);
    formData.append('timeOut', document.getElementById('timeOut').value);

    fetch('submit-pass.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('Gate pass request submitted successfully!');
            updatePassesList();
            toggleRequestPassForm();
            event.target.reset();
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the gate pass request');
    });
}

// Handle Pass Actions (Approve/Reject)
function handlePassAction(action, passId) {
    const formData = new FormData();
    formData.append('passId', passId);
    formData.append('status', action === 'approve' ? 'approved' : 'rejected');

    fetch('update-pass-status.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            updatePassesList();
        } else {
            alert(result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the pass status');
    });
}

// Filter Passes
function filterPasses(status, type = 'all') {
    const passes = JSON.parse(localStorage.getItem('passes') || '[]');
    let filteredPasses = passes;

    // Filter by type if specified
    if (type !== 'all') {
        filteredPasses = filteredPasses.filter(p => p.type === type);
    }

    // Filter by status if specified
    if (status !== 'all') {
        filteredPasses = filteredPasses.filter(p => p.status === status);
    }

    displayPasses(filteredPasses);
}

// Display Passes
function displayPasses(passes) {
    const userType = localStorage.getItem('userType');
    const container = userType === 'admin' ? 
        document.getElementById('pendingPassList') : 
        document.getElementById('passesList');
    
    if (!container) return;

    container.innerHTML = passes.map(pass => {
        if (pass.type === 'faculty') {
            return `
                <div class="pass-request-card">
                    <div class="pass-header">
                        <span class="badge badge-${pass.type}">${pass.type}</span>
                        <span class="status-badge status-${pass.status}">${pass.status}</span>
                        <span class="pass-date">${pass.date}</span>
                    </div>
                    <div class="pass-details">
                        <div class="faculty-info">
                            <p><strong>Name:</strong> ${pass.facultyName}</p>
                            <p><strong>Department:</strong> ${pass.department}</p>
                            <p><strong>Phone:</strong> ${pass.phone}</p>
                        </div>
                        <div class="request-info">
                            <p><strong>Reason:</strong> ${pass.reason}</p>
                            <p><strong>Time Out:</strong> ${pass.timeOut} ${pass.timeFormat}</p>
                            <p><strong>Duration:</strong> ${pass.duration}</p>
                        </div>
                    </div>
                    ${userType === 'admin' && pass.status === 'pending' ? `
                        <div class="pass-actions">
                            <button class="btn btn-approve" onclick="handlePassAction('approve', '${pass.id}')">Approve</button>
                            <button class="btn btn-reject" onclick="handlePassAction('reject', '${pass.id}')">Reject</button>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            return `
                <div class="pass-request-card">
                    <div class="pass-header">
                        <span class="badge badge-${pass.type}">${pass.type}</span>
                        <span class="status-badge status-${pass.status}">${pass.status}</span>
                        <span class="pass-date">${pass.date}</span>
                    </div>
                    <div class="pass-details">
                        <div class="student-info">
                            <p><strong>Name:</strong> ${pass.studentName}</p>
                            <p><strong>Roll No:</strong> ${pass.rollNo}</p>
                            <p><strong>Class:</strong> ${pass.class} <strong>Div:</strong> ${pass.div}</p>
                            <p><strong>Contact:</strong> ${pass.contactNo}</p>
                        </div>
                        <div class="request-info">
                            <p><strong>Reason:</strong> ${pass.reason}</p>
                            <p><strong>Time Out:</strong> ${pass.timeOut}</p>
                        </div>
                    </div>
                    ${userType === 'admin' && pass.status === 'pending' ? `
                        <div class="pass-actions">
                            <button class="btn btn-approve" onclick="handlePassAction('approve', '${pass.id}')">Approve</button>
                            <button class="btn btn-reject" onclick="handlePassAction('reject', '${pass.id}')">Reject</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }).join('');
}

// Update Passes List
function updatePassesList() {
    const passes = JSON.parse(localStorage.getItem('passes') || '[]');
    const userType = localStorage.getItem('userType');
    
    if (userType === 'student') {
        const studentId = localStorage.getItem('studentId');
        const studentPasses = passes.filter(p => p.type === 'student' && p.studentId === studentId);
        displayPasses(studentPasses);
    } else if (userType === 'faculty') {
        const facultyId = localStorage.getItem('facultyId');
        const facultyPasses = passes.filter(p => p.type === 'faculty' && p.facultyId === facultyId);
        displayPasses(facultyPasses);
    } else if (userType === 'admin') {
        displayPasses(passes.filter(p => p.status === 'pending'));
    }
}

// Check if we're on a dashboard page and initialize if needed
if (window.location.pathname.includes('dashboard')) {
    checkAuth();
    initializeDashboard();
}