// ── Form Validation & UX Enhancements ─────────────────────────

const form        = document.getElementById('feedbackForm');
const nameInput   = document.getElementById('studentName');
const subjectSel  = document.getElementById('subject');
const feedbackTA  = document.getElementById('feedback');
const charCount   = document.getElementById('charCount');
const submitBtn   = document.getElementById('submitBtn');

// ── Character Counter ─────────────────────────────────────────
feedbackTA.addEventListener('input', function () {
  const len = this.value.length;
  charCount.textContent = len + ' / 1000';
  if (len > 900) {
    charCount.style.color = '#ef4444';
  } else if (len > 700) {
    charCount.style.color = '#f59e0b';
  } else {
    charCount.style.color = '#64748b';
  }
});

// ── Input Error Helpers ────────────────────────────────────────
function showError(input, errorId) {
  input.classList.add('input-error');
  document.getElementById(errorId).classList.add('visible');
}

function clearError(input, errorId) {
  input.classList.remove('input-error');
  document.getElementById(errorId).classList.remove('visible');
}

// ── Live validation on blur ────────────────────────────────────
nameInput.addEventListener('blur', () => {
  if (nameInput.value.trim().length < 2) {
    showError(nameInput, 'nameError');
  } else {
    clearError(nameInput, 'nameError');
  }
});

subjectSel.addEventListener('change', () => {
  if (!subjectSel.value) {
    showError(subjectSel, 'subjectError');
  } else {
    clearError(subjectSel, 'subjectError');
  }
});

feedbackTA.addEventListener('blur', () => {
  if (feedbackTA.value.trim().length < 10) {
    showError(feedbackTA, 'feedbackError');
  } else {
    clearError(feedbackTA, 'feedbackError');
  }
});

// ── Form Submit Validation ─────────────────────────────────────
form.addEventListener('submit', function (e) {
  let valid = true;

  if (nameInput.value.trim().length < 2) {
    showError(nameInput, 'nameError');
    valid = false;
  } else {
    clearError(nameInput, 'nameError');
  }

  if (!subjectSel.value) {
    showError(subjectSel, 'subjectError');
    valid = false;
  } else {
    clearError(subjectSel, 'subjectError');
  }

  if (feedbackTA.value.trim().length < 10) {
    showError(feedbackTA, 'feedbackError');
    valid = false;
  } else {
    clearError(feedbackTA, 'feedbackError');
  }

  if (!valid) {
    e.preventDefault();
    // Scroll to first error
    const firstError = form.querySelector('.input-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Show loading state on button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Submitting...';
});
