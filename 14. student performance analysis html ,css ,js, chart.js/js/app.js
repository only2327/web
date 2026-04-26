/* =============================================
   STUDENT PERFORMANCE ANALYSIS — app.js
   ============================================= */

// ─── STUDENT DATA ────────────────────────────────────────────────────────────
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Sc.', 'Biology'];
const MAX_MARKS = 100;
const PASS_MARK = 35;

const STUDENTS = [
  {
    name: 'Alice Johnson',
    rollNo: 'XII-A/01',
    // Marks per subject (out of 100)
    marks: [92, 88, 76, 95, 97, 81],
    // Progress over 6 months (avg scores)
    progress: [62, 68, 74, 79, 85, 91],
  },
  {
    name: 'Bob Smith',
    rollNo: 'XII-B/07',
    marks: [55, 60, 48, 72, 65, 58],
    progress: [40, 47, 52, 56, 61, 60],
  },
  {
    name: 'Priya Sharma',
    rollNo: 'XII-A/03',
    marks: [85, 79, 90, 88, 95, 92],
    progress: [70, 76, 80, 84, 89, 91],
  },
  {
    name: 'Rohan Mehta',
    rollNo: 'XII-C/11',
    marks: [42, 38, 33, 60, 55, 40],
    progress: [35, 38, 36, 42, 48, 45],
  },
  {
    name: 'Emily Davis',
    rollNo: 'XII-B/15',
    marks: [78, 82, 74, 91, 88, 70],
    progress: [55, 62, 68, 74, 80, 83],
  }
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// ─── GRADE LOGIC ─────────────────────────────────────────────────────────────
function getGrade(marks) {
  if (marks >= 90) return 'O';
  if (marks >= 75) return 'A';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 35) return 'D';
  return 'F';
}

function getGradeLabel(grade) {
  const labels = { O: 'Outstanding (90–100)', A: 'Excellent (75–89)', B: 'Good (60–74)', C: 'Average (50–59)', D: 'Pass (35–49)', F: 'Fail (<35)' };
  return labels[grade] || grade;
}

const GRADE_COLORS = {
  O: '#10b981',
  A: '#6377ff',
  B: '#22d3ee',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
};

// ─── CHART INSTANCES ─────────────────────────────────────────────────────────
let barChart  = null;
let pieChart  = null;
let lineChart = null;

// ─── CHART DEFAULTS ──────────────────────────────────────────────────────────
Chart.defaults.color           = '#8b92b8';
Chart.defaults.font.family     = "'Segoe UI', -apple-system, sans-serif";
Chart.defaults.font.size       = 12;

const GRID_COLOR  = 'rgba(99,119,255,0.08)';
const TICK_COLOR  = '#565e88';

// ─── BAR CHART ───────────────────────────────────────────────────────────────
function buildBarChart(student) {
  const ctx = document.getElementById('barChart').getContext('2d');

  // Gradient per bar
  const colors = [
    '#6377ff', '#9f6bff', '#22d3ee', '#10b981', '#f59e0b', '#ec4899'
  ];
  const bgColors  = colors.map(c => c + '99'); // semi-transparent
  const bdrColors = colors;

  const data = {
    labels: SUBJECTS,
    datasets: [{
      label: 'Marks (out of 100)',
      data: student.marks,
      backgroundColor: bgColors,
      borderColor: bdrColors,
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const config = {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#181d35',
          borderColor: 'rgba(99,119,255,0.4)',
          borderWidth: 1,
          callbacks: {
            label: ctx => `  Marks: ${ctx.parsed.y} / ${MAX_MARKS}  (${getGrade(ctx.parsed.y)})`,
          }
        }
      },
      scales: {
        x: {
          grid: { color: GRID_COLOR },
          ticks: { color: TICK_COLOR, font: { weight: '500' } },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: GRID_COLOR },
          ticks: { color: TICK_COLOR, stepSize: 20 },
        }
      }
    }
  };

  if (barChart) { barChart.destroy(); }
  barChart = new Chart(ctx, config);
}

// ─── PIE CHART ───────────────────────────────────────────────────────────────
function buildPieChart(student) {
  const ctx = document.getElementById('pieChart').getContext('2d');

  // Count grades
  const gradeCounts = {};
  student.marks.forEach(m => {
    const g = getGrade(m);
    gradeCounts[g] = (gradeCounts[g] || 0) + 1;
  });

  const labels = Object.keys(gradeCounts);
  const values = labels.map(g => gradeCounts[g]);
  const bgColors  = labels.map(g => GRADE_COLORS[g] + 'cc');
  const bdrColors = labels.map(g => GRADE_COLORS[g]);

  // Update custom legend
  const legendEl = document.getElementById('gradeLegend');
  legendEl.innerHTML = labels.map((g, i) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${GRADE_COLORS[g]}"></div>
      <span>${g} — ${getGradeLabel(g).split(' ')[0]}</span>
      <strong style="color:${GRADE_COLORS[g]}">${values[i]}</strong>
    </div>
  `).join('');

  const config = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: bgColors,
        borderColor: bdrColors,
        borderWidth: 2,
        hoverOffset: 12,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#181d35',
          borderColor: 'rgba(99,119,255,0.4)',
          borderWidth: 1,
          callbacks: {
            label: ctx => `  ${ctx.label}: ${ctx.parsed} subject(s)`,
          }
        }
      }
    }
  };

  if (pieChart) { pieChart.destroy(); }
  pieChart = new Chart(ctx, config);
}

// ─── LINE CHART ──────────────────────────────────────────────────────────────
function buildLineChart(student) {
  const ctx = document.getElementById('lineChart').getContext('2d');

  // Build gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0,   'rgba(99,119,255,0.35)');
  gradient.addColorStop(1,   'rgba(99,119,255,0.00)');

  const config = {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'Average Score',
        data: student.progress,
        borderColor: '#6377ff',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.45,
        pointBackgroundColor: '#6377ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: '#9f6bff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#8b92b8',
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
          }
        },
        tooltip: {
          backgroundColor: '#181d35',
          borderColor: 'rgba(99,119,255,0.4)',
          borderWidth: 1,
          callbacks: {
            label: ctx => `  Average Score: ${ctx.parsed.y}`,
          }
        }
      },
      scales: {
        x: {
          grid: { color: GRID_COLOR },
          ticks: { color: TICK_COLOR },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: GRID_COLOR },
          ticks: { color: TICK_COLOR, stepSize: 20 },
        }
      }
    }
  };

  if (lineChart) { lineChart.destroy(); }
  lineChart = new Chart(ctx, config);
}

// ─── STAT CARDS ──────────────────────────────────────────────────────────────
function updateStats(student) {
  const avg  = Math.round(student.marks.reduce((a, b) => a + b, 0) / student.marks.length);
  const high = Math.max(...student.marks);
  const low  = Math.min(...student.marks);
  const pass = student.marks.filter(m => m >= PASS_MARK).length;

  document.getElementById('statAvg').textContent  = avg;
  document.getElementById('statHigh').textContent = high;
  document.getElementById('statLow').textContent  = low;
  document.getElementById('statPass').textContent = `${pass}/${student.marks.length}`;

  // Overall grade tag
  const grade = getGrade(avg);
  const tagEl = document.getElementById('gradeTag');
  tagEl.textContent = `Overall Grade: ${grade}`;
  const colors = { O: '#10b981', A: '#6377ff', B: '#22d3ee', C: '#f59e0b', D: '#f97316', F: '#ef4444' };
  tagEl.style.background = colors[grade];
  tagEl.style.boxShadow  = `0 4px 15px ${colors[grade]}55`;
}

// ─── SCORE TABLE ─────────────────────────────────────────────────────────────
function updateTable(student) {
  const tbody = document.getElementById('scoreTableBody');
  tbody.innerHTML = '';

  student.marks.forEach((mark, i) => {
    const pct   = mark; // out of 100
    const grade = getGrade(mark);
    const pass  = mark >= PASS_MARK;
    const row   = document.createElement('tr');

    row.innerHTML = `
      <td>${i + 1}</td>
      <td><span class="subject-name">${SUBJECTS[i]}</span></td>
      <td>
        <div class="marks-bar-wrap">
          <span style="min-width:28px;text-align:right;font-weight:600;color:#f0f2ff">${mark}</span>
          <div class="marks-mini-bar">
            <div class="marks-mini-fill" style="width:${pct}%;background:${GRADE_COLORS[grade]}cc"></div>
          </div>
        </div>
      </td>
      <td>${MAX_MARKS}</td>
      <td style="font-weight:600;color:#f0f2ff">${pct}%</td>
      <td><span class="grade-pill grade-${grade}">${grade}</span></td>
      <td><span class="${pass ? 'status-pass' : 'status-fail'}">${pass ? '✓ Pass' : '✗ Fail'}</span></td>
    `;
    tbody.appendChild(row);
  });
}

// ─── MAIN UPDATE ─────────────────────────────────────────────────────────────
function updateDashboard(index) {
  const student = STUDENTS[index];
  updateStats(student);
  buildBarChart(student);
  buildPieChart(student);
  buildLineChart(student);
  updateTable(student);
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Set current date in navbar
  const dateEl = document.getElementById('currentDate');
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Student dropdown listener
  const select = document.getElementById('studentSelect');
  select.addEventListener('change', () => {
    updateDashboard(parseInt(select.value));
  });

  // Initial render
  updateDashboard(0);
});
