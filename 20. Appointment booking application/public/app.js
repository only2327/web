// Global State
let appointments = [];

// DOM Elements
const dashboardSection = document.getElementById('dashboard-section');
const bookSection = document.getElementById('book-section');
const pageTitle = document.getElementById('page-title');
const navLinks = document.querySelectorAll('.nav-menu a');

const appointmentsList = document.getElementById('appointments-list');
const emptyState = document.getElementById('empty-state');
const bookingForm = document.getElementById('booking-form');

const pendingCount = document.getElementById('pending-count');
const confirmedCount = document.getElementById('confirmed-count');
const totalCount = document.getElementById('total-count');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();
    
    // Set min date for booking form to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
});

// Navigation Logic
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');
        showSection(target);
    });
});

function showSection(sectionId) {
    // Update Nav Links
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('active');
            pageTitle.textContent = link.textContent.trim();
        } else {
            link.classList.remove('active');
        }
    });

    // Toggle Sections
    if (sectionId === 'dashboard') {
        dashboardSection.classList.add('active');
        bookSection.classList.remove('active');
        fetchAppointments(); // Refresh data when showing dashboard
    } else if (sectionId === 'book') {
        dashboardSection.classList.remove('active');
        bookSection.classList.add('active');
        pageTitle.textContent = 'Book Appointment';
    }
}

// Fetch Appointments from API
async function fetchAppointments() {
    try {
        const response = await fetch('/api/appointments');
        if (!response.ok) throw new Error('Failed to fetch');
        appointments = await response.json();
        
        updateStats();
        renderAppointments();
    } catch (err) {
        console.error('Error fetching appointments:', err);
    }
}

// Update Stats Dashboard
function updateStats() {
    totalCount.textContent = appointments.length;
    
    const pending = appointments.filter(app => app.status === 'Pending').length;
    const confirmed = appointments.filter(app => app.status === 'Confirmed').length;
    
    pendingCount.textContent = pending;
    confirmedCount.textContent = confirmed;
}

// Render Appointments List
function renderAppointments() {
    // Clear existing (except empty state)
    const cards = appointmentsList.querySelectorAll('.appointment-card');
    cards.forEach(card => card.remove());

    if (appointments.length === 0) {
        emptyState.classList.add('active');
    } else {
        emptyState.classList.remove('active');
        
        appointments.forEach(app => {
            const dateObj = new Date(app.appointmentDate);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = dateObj.toLocaleString('default', { month: 'short' });

            const card = document.createElement('div');
            card.className = 'appointment-card';
            
            // Format time nicely
            const [hours, minutes] = app.appointmentTime.split(':');
            const timeStr = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            card.innerHTML = `
                <div class="appointment-info">
                    <div class="appointment-date">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="appointment-details">
                        <h4>${app.patientName}</h4>
                        <p><span>🩺</span> ${app.doctorName}</p>
                        <p><span>🕒</span> ${timeStr}</p>
                        ${app.reason ? `<p><span>📝</span> ${app.reason}</p>` : ''}
                        <span class="status-badge ${app.status}">${app.status}</span>
                    </div>
                </div>
                <div class="appointment-actions">
                    ${app.status === 'Pending' ? `
                        <button class="btn btn-secondary" onclick="updateStatus('${app._id}', 'Confirmed')">Confirm</button>
                    ` : ''}
                    <button class="btn btn-danger" onclick="cancelAppointment('${app._id}')">Cancel</button>
                </div>
            `;
            appointmentsList.appendChild(card);
        });
    }
}

// Handle Form Submit (Book Appointment)
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        patientName: document.getElementById('patientName').value,
        doctorName: document.getElementById('doctorName').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        reason: document.getElementById('reason').value
    };

    try {
        const btn = bookingForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Booking...';
        btn.disabled = true;

        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            bookingForm.reset();
            showSection('dashboard');
        } else {
            alert('Failed to book appointment.');
        }
    } catch (err) {
        console.error('Error booking appointment:', err);
        alert('An error occurred.');
    } finally {
        const btn = bookingForm.querySelector('button[type="submit"]');
        btn.textContent = 'Confirm Booking';
        btn.disabled = false;
    }
});

// Update Status API Call
async function updateStatus(id, newStatus) {
    try {
        const response = await fetch(`/api/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            fetchAppointments(); // Refresh
        }
    } catch (err) {
        console.error('Error updating status:', err);
    }
}

// Cancel (Delete) Appointment API Call
async function cancelAppointment(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
        const response = await fetch(`/api/appointments/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchAppointments(); // Refresh
        }
    } catch (err) {
        console.error('Error cancelling appointment:', err);
    }
}
