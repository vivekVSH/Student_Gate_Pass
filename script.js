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
    
    if (userType === 'student') {
        const studentName = localStorage.getItem('studentName');
        document.getElementById('studentName').textContent = studentName;
        
        // Initialize student dashboard data
        document.getElementById('totalPasses').textContent = '5'; // Demo data
        document.getElementById('activePasses').textContent = '2'; // Demo data
        
        // Load passes list (demo data)
        const passesList = document.getElementById('passesList');
        if (passesList) {
            passesList.innerHTML = `
                <div class="pass-card">
                    <h3>Library Pass</h3>
                    <p>Date: 2025-09-21</p>
                    <p>Status: Active</p>
                </div>
                <div class="pass-card">
                    <h3>Lab Access Pass</h3>
                    <p>Date: 2025-09-20</p>
                    <p>Status: Approved</p>
                </div>
            `;
        }
    } else if (userType === 'admin') {
        const adminName = localStorage.getItem('adminName');
        document.getElementById('adminName').textContent = adminName;
        
        // Initialize admin dashboard data
        document.getElementById('totalStudents').textContent = '150'; // Demo data
        document.getElementById('pendingPasses').textContent = '3'; // Demo data
        document.getElementById('approvedPasses').textContent = '45'; // Demo data
        
        // Load pending passes (demo data)
        const pendingPassList = document.getElementById('pendingPassList');
        if (pendingPassList) {
            pendingPassList.innerHTML = `
                <div class="pass-card">
                    <h3>Library Pass Request</h3>
                    <p>Student: John Doe</p>
                    <p>Date: 2025-09-21</p>
                    <div class="action-buttons">
                        <button onclick="approvePass(1)" class="btn">Approve</button>
                        <button onclick="rejectPass(1)" class="btn btn-reject">Reject</button>
                    </div>
                </div>
            `;
        }
        
        // Load student list (demo data)
        const studentList = document.getElementById('studentList');
        if (studentList) {
            studentList.innerHTML = `
                <div class="student-card">
                    <h3>John Doe</h3>
                    <p>ID: STU001</p>
                    <p>Active Passes: 2</p>
                </div>
            `;
        }
    }
}

// Toggle Gate Pass Request Form
function toggleRequestPassForm() {
    const form = document.getElementById('gatePassForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Submit Gate Pass Request
function submitGatePass(event) {
    event.preventDefault();
    
    const pass = {
        rollNo: document.getElementById('rollNo').value,
        class: document.getElementById('class').value,
        div: document.getElementById('div').value,
        contactNo: document.getElementById('contactNo').value,
        date: document.getElementById('date').value,
        reason: document.getElementById('reason').value,
        timeOut: document.getElementById('timeOut').value,
        status: 'pending'
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
function filterPasses(status) {
    const passes = JSON.parse(localStorage.getItem('passes') || '[]');
    const filteredPasses = status === 'all' ? passes : passes.filter(p => p.status === status);
    displayPasses(filteredPasses);
}

// Display Passes
function displayPasses(passes) {
    const userType = localStorage.getItem('userType');
    const container = userType === 'admin' ? 
        document.getElementById('pendingPassList') : 
        document.getElementById('passesList');
    
    if (!container) return;

    container.innerHTML = passes.map(pass => `
        <div class="pass-request-card">
            <div class="pass-header">
                <span class="status-badge status-${pass.status}">${pass.status}</span>
                <span class="pass-date">${pass.date}</span>
            </div>
            <div class="pass-details">
                <div class="student-info">
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
    `).join('');
}

// Update Passes List
function updatePassesList() {
    const passes = JSON.parse(localStorage.getItem('passes') || '[]');
    const userType = localStorage.getItem('userType');
    
    if (userType === 'student') {
        const studentId = localStorage.getItem('studentId');
        const studentPasses = passes.filter(p => p.rollNo === studentId);
        displayPasses(studentPasses);
    } else if (userType === 'admin') {
        displayPasses(passes.filter(p => p.status === 'pending'));
    }
}

// Check if we're on a dashboard page and initialize if needed
if (window.location.pathname.includes('dashboard')) {
    checkAuth();
    initializeDashboard();
}