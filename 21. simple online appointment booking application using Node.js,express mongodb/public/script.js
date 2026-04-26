document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // LOGIC FOR INDEX.HTML (BOOKING FORM)
  // ----------------------------------------------------
  const bookingForm = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('service');
  const alertBox = document.getElementById('alertBox');

  if (serviceSelect) {
    // Fetch available services
    fetch('/api/services')
      .then(response => response.json())
      .then(services => {
        serviceSelect.innerHTML = '<option value="" disabled selected>Select a service</option>';
        services.forEach(service => {
          const option = document.createElement('option');
          option.value = service.name; // Store the service name
          option.textContent = service.name;
          serviceSelect.appendChild(option);
        });
      })
      .catch(err => {
        console.error('Error fetching services:', err);
        serviceSelect.innerHTML = '<option value="" disabled selected>Error loading services</option>';
      });
  }

  if (bookingForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Handle form submission
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const appointmentData = {
        name: document.getElementById('name').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
      };

      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(appointmentData)
        });

        const result = await response.json();

        if (response.ok) {
          showAlert(result.message, 'success');
          bookingForm.reset();
        } else {
          showAlert(result.error || 'Failed to book appointment', 'error');
        }
      } catch (error) {
        console.error('Submission error:', error);
        showAlert('Network error. Please try again.', 'error');
      }
    });
  }

  // ----------------------------------------------------
  // LOGIC FOR APPOINTMENTS.HTML (VIEW APPOINTMENTS)
  // ----------------------------------------------------
  const appointmentsList = document.getElementById('appointmentsList');
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const editServiceSelect = document.getElementById('editService');

  if (appointmentsList) {
    // Populate services in edit modal
    if (editServiceSelect) {
      fetch('/api/services')
        .then(response => response.json())
        .then(services => {
          editServiceSelect.innerHTML = '<option value="" disabled>Select a service</option>';
          services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.name;
            option.textContent = service.name;
            editServiceSelect.appendChild(option);
          });
        });
    }

    fetchAppointments();

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        editModal.classList.remove('show');
      });
    }

    // Close modal if clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === editModal) {
        editModal.classList.remove('show');
      }
    });

    if (editForm) {
      // Set minimum date for edit form
      const editDateInput = document.getElementById('editDate');
      const today = new Date().toISOString().split('T')[0];
      editDateInput.min = today;

      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const appointmentData = {
          name: document.getElementById('editName').value,
          service: document.getElementById('editService').value,
          date: document.getElementById('editDate').value,
          time: document.getElementById('editTime').value
        };

        try {
          const response = await fetch(`/api/appointments/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
          });

          if (response.ok) {
            editModal.classList.remove('show');
            fetchAppointments(); // Refresh list
          } else {
            alert('Failed to update appointment');
          }
        } catch (error) {
          console.error('Update error:', error);
          alert('Network error. Please try again.');
        }
      });
    }
  }

  function fetchAppointments() {
    fetch('/api/appointments')
      .then(response => response.json())
      .then(appointments => {
        if (appointments.length === 0) {
          appointmentsList.innerHTML = '<div class="no-appointments" style="grid-column: 1 / -1;">No appointments booked yet.</div>';
          return;
        }

        appointmentsList.innerHTML = '';
        appointments.forEach(app => {
          const card = document.createElement('div');
          card.className = 'appointment-card';
          
          const dateObj = new Date(app.date);
          const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

          card.innerHTML = `
            <div class="appointment-header">
              <span class="appointment-service">${app.service}</span>
            </div>
            <h3 class="appointment-name">${app.name}</h3>
            <div class="appointment-detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${formattedDate || app.date}
            </div>
            <div class="appointment-detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${app.time}
            </div>
            <div class="card-actions">
              <button class="btn-edit" data-id="${app._id}">Edit</button>
              <button class="btn-delete" data-id="${app._id}">Delete</button>
            </div>
          `;
          appointmentsList.appendChild(card);
          
          // Attach listeners for this specific card's buttons
          const editBtn = card.querySelector('.btn-edit');
          const deleteBtn = card.querySelector('.btn-delete');
          
          editBtn.addEventListener('click', () => {
            document.getElementById('editId').value = app._id;
            document.getElementById('editName').value = app.name;
            document.getElementById('editService').value = app.service;
            document.getElementById('editDate').value = app.date;
            document.getElementById('editTime').value = app.time;
            editModal.classList.add('show');
          });

          deleteBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this appointment?')) {
              try {
                const response = await fetch(`/api/appointments/${app._id}`, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  fetchAppointments(); // Refresh list
                } else {
                  alert('Failed to delete appointment');
                }
              } catch (error) {
                console.error('Delete error:', error);
              }
            }
          });
        });
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        appointmentsList.innerHTML = '<div class="no-appointments" style="grid-column: 1 / -1; color: var(--error);">Error loading appointments. Please try again later.</div>';
      });
  }

  // Utility to show alerts
  function showAlert(message, type) {
    if (!alertBox) return;
    
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    
    // Hide after 4 seconds
    setTimeout(() => {
      alertBox.className = 'alert';
      alertBox.style.display = 'none';
      // Force reflow
      void alertBox.offsetWidth;
      alertBox.style.display = '';
    }, 4000);
  }
});
