// Admin Dashboard Functions
function initializeAdminDashboard() {
    checkAuth();
    updateDashboardStats();
    updatePassesList();
    updateUserName();

    // Set up auto-refresh
    setInterval(() => {
        updateDashboardStats();
        updatePassesList();
    }, 30000); // Refresh every 30 seconds
}

// Display passes in the grid
function displayPasses(passes) {
    const passListContainer = document.getElementById('pendingPassList');
    if (!passListContainer) return;

    passListContainer.innerHTML = '';
    
    if (passes.length === 0) {
        passListContainer.innerHTML = `
            <div class="no-passes">
                <div class="no-passes-icon">📋</div>
                <p>No passes found</p>
            </div>`;
        return;
    }

    passes.forEach(pass => {
        const passCard = document.createElement('div');
        passCard.className = 'pass-card';
        
        const statusClass = pass.status.toLowerCase();
        const passType = pass.pass_type;
        
        // Build the details based on pass type
        let detailsHTML = `
            <div class="pass-header">
                <span class="pass-type">${passType.toUpperCase()} PASS</span>
                <span class="pass-status status-${statusClass}">${pass.status.toUpperCase()}</span>
            </div>
            <div class="pass-content">
                <p class="student-name">${pass.full_name || 'N/A'}</p>
                <div class="pass-info">
                    <div class="info-item">
                        <span class="info-label">Date:</span>
                        <span class="info-value">${pass.date || 'N/A'}</span>
                    </div>`;

        if (passType === 'student') {
            detailsHTML += `
                    <div class="info-item">
                        <span class="info-label">Class:</span>
                        <span class="info-value">${pass.class || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Division:</span>
                        <span class="info-value">${pass.division || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Roll No:</span>
                        <span class="info-value">${pass.roll_no || 'N/A'}</span>
                    </div>`;
        } else {
            detailsHTML += `
                    <div class="info-item">
                        <span class="info-label">Department:</span>
                        <span class="info-value">${pass.department || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Duration:</span>
                        <span class="info-value">${pass.duration || 'N/A'}</span>
                    </div>`;
        }

        detailsHTML += `
                    <div class="info-item">
                        <span class="info-label">Time Out:</span>
                        <span class="info-value">${pass.time_out || 'N/A'} ${pass.time_format || ''}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Contact:</span>
                        <span class="info-value">${pass.contact_no || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Reason:</span>
                        <span class="info-value">${pass.reason || 'N/A'}</span>
                    </div>
                </div>
            </div>`;

        if (pass.status === 'pending') {
            detailsHTML += `
                <div class="pass-actions">
                    <button onclick="updatePassStatus(${pass.id}, 'approved')" class="btn-action btn-approve">Approve</button>
                    <button onclick="updatePassStatus(${pass.id}, 'rejected')" class="btn-action btn-reject">Reject</button>
                </div>`;
        }

        passCard.innerHTML = detailsHTML;
        passListContainer.appendChild(passCard);
    });
}

// Fetch passes with filters
function fetchPasses(status = 'pending', type = 'all') {
    // Show loading state
    const passListContainer = document.getElementById('pendingPassList');
    if (passListContainer) {
        passListContainer.innerHTML = `
            <div class="loading-message">
                <p>Loading passes...</p>
            </div>`;
    }

    const queryParams = new URLSearchParams({
        status: status,
        type: type
    });
    
    fetch(`get-passes.php?${queryParams}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('Response was not JSON');
        }
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Server error');
            });
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data)) {
            displayPasses(data);
        } else if (data.error) {
            throw new Error(data.error);
        } else {
            throw new Error('Invalid response format');
        }
    })
    .catch(error => {
        console.error('Error fetching passes:', error);
        if (passListContainer) {
            passListContainer.innerHTML = `
                <div class="error-message">
                    <p>Error loading passes: ${error.message}</p>
                    <button onclick="updatePassesList()" class="retry-button">Retry</button>
                </div>`;
        }
    });
}

// Filter passes by status
function filterPasses(status) {
    const type = document.getElementById('userTypeFilter').value;
    fetchPasses(status, type);
}

// Filter passes by type
function filterPassesByType(type) {
    const status = document.getElementById('passFilter').value;
    fetchPasses(status, type);
}

// Update pass status
function updatePassStatus(passId, newStatus) {
    if (!confirm(`Are you sure you want to ${newStatus} this pass?`)) {
        return;
    }

    const formData = new FormData();
    formData.append('pass_id', passId);
    formData.append('status', newStatus);

    fetch('/Student_Get_Pass/update-pass-status.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            // Show success message
            alert(`Pass has been ${newStatus} successfully.`);
            
            // Refresh the passes list
            const status = document.getElementById('passFilter').value;
            const type = document.getElementById('userTypeFilter').value;
            fetchPasses(status, type);
            
            // Update dashboard stats
            updateDashboardStats();
        } else {
            console.error('Server response:', result);
            alert('Error updating pass status: ' + result);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the pass status');
    });
}

// Update passes list
function updatePassesList() {
    const status = document.getElementById('passFilter').value;
    const type = document.getElementById('userTypeFilter').value;
    fetchPasses(status, type);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin-dashboard.html')) {
        initializeAdminDashboard();
    }
});