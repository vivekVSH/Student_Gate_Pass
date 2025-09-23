// Check if user is logged in
function checkAuth() {
    const userType = localStorage.getItem('userType');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // Redirect if user is on wrong dashboard
    const currentPage = window.location.pathname;
    if (userType === 'student' && currentPage.includes('admin-dashboard.html')) {
        window.location.href = 'student-dashboard.html';
    } else if (userType === 'admin' && currentPage.includes('student-dashboard.html')) {
        window.location.href = 'admin-dashboard.html';
    }
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

    // Demo faculty login (in real app, would verify against server)
    if (email && password) {
        const faculty = JSON.parse(localStorage.getItem('faculty') || '[]')
            .find(f => f.email === email && f.password === password);

        if (faculty) {
            localStorage.setItem('userType', 'faculty');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('facultyId', faculty.id);
            localStorage.setItem('facultyName', `${faculty.firstName} ${faculty.lastName}`);
            localStorage.setItem('facultyDepartment', faculty.department);
            window.location.href = 'faculty-dashboard.html';
        } else {
            if (errorDiv) {
                errorDiv.textContent = 'Invalid credentials';
                errorDiv.style.display = 'block';
            }
        }
    } else {
        if (errorDiv) {
            errorDiv.textContent = 'Please fill in all fields';
            errorDiv.style.display = 'block';
        }
    }
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

    // Create faculty object
    const faculty = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        department,
        phone,
        password
    };

    // Store faculty data
    let facultyList = JSON.parse(localStorage.getItem('faculty') || '[]');
    facultyList.push(faculty);
    localStorage.setItem('faculty', JSON.stringify(facultyList));

    alert('Registration successful! Please login with your credentials');
    window.location.href = 'faculty-login.html';
}

// Handle Student Login
function handleStudentLogin(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;

    // Here you would typically make an API call to verify credentials
    // For demo purposes, we'll use a simple check
    if (studentId && password) {
        localStorage.setItem('userType', 'student');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('studentId', studentId);
        localStorage.setItem('studentName', 'Demo Student'); // This would come from API
        window.location.href = 'student-dashboard.html';
    } else {
        alert('Please fill in all fields');
    }
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

    // Admin credentials check
    if (username === 'admin' && password === 'admin123') {
        // Store admin session
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminName', 'Admin User');
        
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
    } else {
        // Show error message
        if (errorDiv) {
            errorDiv.textContent = 'Invalid username or password. Admin credentials are username: "admin" and password: "admin123"';
            errorDiv.style.display = 'block';
        } else {
            alert('Invalid username or password. Admin credentials are username: "admin" and password: "admin123"');
        }
        
        // Clear password field
        document.getElementById('password').value = '';
    }
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

    // Here you would typically make an API call to register the student
    // For demo purposes, we'll just show a success message
    alert('Registration successful! Please login with your credentials');
    window.location.href = 'student-login.html';
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
    
    const facultyId = localStorage.getItem('facultyId');
    const facultyName = localStorage.getItem('facultyName');
    const facultyDepartment = localStorage.getItem('facultyDepartment');
    
    if (!facultyId) {
        alert('Please login again');
        window.location.href = 'faculty-login.html';
        return;
    }
    
    const pass = {
        id: Date.now(),
        type: 'faculty',
        facultyId: facultyId,
        facultyName: facultyName,
        department: facultyDepartment,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        timeOut: document.getElementById('timeOut').value,
        timeFormat: document.getElementById('timeFormat').value,
        duration: document.getElementById('duration').value,
        reason: document.getElementById('reason').value,
        status: 'pending',
        requestedAt: new Date().toISOString()
    };

    // Store the pass request
    let passes = JSON.parse(localStorage.getItem('passes') || '[]');
    passes.push(pass);
    localStorage.setItem('passes', JSON.stringify(passes));

    // Update the display
    updatePassesList();
    toggleRequestPassForm();
    
    // Reset form
    event.target.reset();
    
    // Show success message
    alert('Gate pass request submitted successfully!');
}

// Submit Student Gate Pass Request
function submitGatePass(event) {
    event.preventDefault();
    
    const studentId = localStorage.getItem('studentId');
    const studentName = localStorage.getItem('studentName');
    
    if (!studentId) {
        alert('Please login again');
        window.location.href = 'student-login.html';
        return;
    }
    
    const pass = {
        id: Date.now(),
        type: 'student',
        studentId: studentId,
        studentName: studentName,
        rollNo: document.getElementById('rollNo').value,
        class: document.getElementById('class').value,
        div: document.getElementById('div').value,
        contactNo: document.getElementById('contactNo').value,
        date: document.getElementById('date').value,
        reason: document.getElementById('reason').value,
        timeOut: document.getElementById('timeOut').value,
        status: 'pending',
        requestedAt: new Date().toISOString()
    };

    // Store the pass request in localStorage (in a real app, this would be sent to a server)
    let passes = JSON.parse(localStorage.getItem('passes') || '[]');
    passes.push({...pass, id: Date.now()});
    localStorage.setItem('passes', JSON.stringify(passes));

    // Update the display
    updatePassesList();
    toggleRequestPassForm();
    
    // Reset form
    event.target.reset();
}

// Handle Pass Actions (Approve/Reject)
function handlePassAction(action, passId) {
    let passes = JSON.parse(localStorage.getItem('passes') || '[]');
    const passIndex = passes.findIndex(p => p.id === parseInt(passId));
    
    if (passIndex !== -1) {
        passes[passIndex].status = action === 'approve' ? 'approved' : 'rejected';
        localStorage.setItem('passes', JSON.stringify(passes));
        updatePassesList();
    }
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