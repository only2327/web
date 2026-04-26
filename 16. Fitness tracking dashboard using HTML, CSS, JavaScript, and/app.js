/* =========================================================
   FitTrack – Fitness Dashboard  |  app.js
   All data is local/hardcoded – no internet required
   ========================================================= */

'use strict';

// ── Chart.js Global Defaults ──────────────────────────────
Chart.defaults.color          = '#8b92b5';
Chart.defaults.borderColor    = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family    = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.animation.duration = 800;

// ─────────────────────────────────────────────────────────
//  DATA  (4 weeks × 7 days)
// ─────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_LABELS = ['This Week', 'Last Week', '2 Weeks Ago', '3 Weeks Ago'];

/**
 * Each week: array of 7 day objects
 * { steps, calories, distKm, activeMin, walk, run, cycle }
 * walk/run/cycle are percentages that sum to 100
 */
const DATA = [
  // Week 0 – This Week
  [
    { steps: 8420,  calories: 2100, distKm: 6.1, activeMin: 52, walk: 55, run: 25, cycle: 20 },
    { steps: 11300, calories: 2650, distKm: 8.2, activeMin: 74, walk: 40, run: 40, cycle: 20 },
    { steps: 7850,  calories: 1980, distKm: 5.7, activeMin: 48, walk: 60, run: 20, cycle: 20 },
    { steps: 9600,  calories: 2350, distKm: 7.0, activeMin: 63, walk: 45, run: 35, cycle: 20 },
    { steps: 12100, calories: 2900, distKm: 8.8, activeMin: 80, walk: 35, run: 45, cycle: 20 },
    { steps: 6300,  calories: 1700, distKm: 4.6, activeMin: 38, walk: 70, run: 10, cycle: 20 },
    { steps: 5400,  calories: 1500, distKm: 3.9, activeMin: 30, walk: 75, run:  5, cycle: 20 },
  ],
  // Week 1 – Last Week
  [
    { steps: 7200,  calories: 1900, distKm: 5.2, activeMin: 44, walk: 60, run: 20, cycle: 20 },
    { steps: 9400,  calories: 2200, distKm: 6.8, activeMin: 61, walk: 50, run: 30, cycle: 20 },
    { steps: 10800, calories: 2500, distKm: 7.8, activeMin: 70, walk: 42, run: 38, cycle: 20 },
    { steps: 8100,  calories: 2050, distKm: 5.9, activeMin: 50, walk: 55, run: 25, cycle: 20 },
    { steps: 13200, calories: 3000, distKm: 9.6, activeMin: 85, walk: 30, run: 50, cycle: 20 },
    { steps: 7700,  calories: 1950, distKm: 5.6, activeMin: 46, walk: 65, run: 15, cycle: 20 },
    { steps: 4900,  calories: 1400, distKm: 3.6, activeMin: 28, walk: 78, run:  2, cycle: 20 },
  ],
  // Week 2 – 2 Weeks Ago
  [
    { steps: 6800,  calories: 1800, distKm: 4.9, activeMin: 40, walk: 62, run: 18, cycle: 20 },
    { steps: 8900,  calories: 2150, distKm: 6.5, activeMin: 58, walk: 48, run: 32, cycle: 20 },
    { steps: 11500, calories: 2700, distKm: 8.4, activeMin: 76, walk: 38, run: 42, cycle: 20 },
    { steps: 7400,  calories: 1920, distKm: 5.4, activeMin: 47, walk: 58, run: 22, cycle: 20 },
    { steps: 9900,  calories: 2400, distKm: 7.2, activeMin: 65, walk: 44, run: 36, cycle: 20 },
    { steps: 8500,  calories: 2100, distKm: 6.2, activeMin: 55, walk: 50, run: 30, cycle: 20 },
    { steps: 5100,  calories: 1450, distKm: 3.7, activeMin: 32, walk: 76, run:  4, cycle: 20 },
  ],
  // Week 3 – 3 Weeks Ago
  [
    { steps: 7600,  calories: 1950, distKm: 5.5, activeMin: 46, walk: 57, run: 23, cycle: 20 },
    { steps: 10200, calories: 2450, distKm: 7.4, activeMin: 68, walk: 43, run: 37, cycle: 20 },
    { steps: 9100,  calories: 2200, distKm: 6.6, activeMin: 60, walk: 52, run: 28, cycle: 20 },
    { steps: 8700,  calories: 2080, distKm: 6.3, activeMin: 55, walk: 54, run: 26, cycle: 20 },
    { steps: 11800, calories: 2800, distKm: 8.6, activeMin: 78, walk: 33, run: 47, cycle: 20 },
    { steps: 7000,  calories: 1850, distKm: 5.1, activeMin: 42, walk: 67, run: 13, cycle: 20 },
    { steps: 4700,  calories: 1350, distKm: 3.4, activeMin: 26, walk: 80, run:  0, cycle: 20 },
  ],
];

// Goals
const GOAL_STEPS   = 10000;
const GOAL_CAL     = 2500;
const GOAL_DIST    = 10;    // km
const GOAL_ACTIVE  = 60;    // min

// Accent colours reused across charts
const COLORS = {
  accent  : '#6c63ff',
  accent2 : '#ff6b6b',
  accent3 : '#43e97b',
  accent4 : '#a78bfa',
  orange  : '#ff9f43',
  cyan    : '#00c6ff',
};

// ─────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────
let selectedWeek   = 0;   // 0-3
let selectedDay    = 0;   // 0-6  (Mon-Sun)
let selectedMetric = 'steps'; // 'steps' | 'calories'

// Chart instances (kept so we can update/destroy)
let lineChart, pieChart, barChart;

// ─────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────
function fmt(n)     { return n.toLocaleString(); }
function pct(v, g)  { return Math.min(100, Math.round((v / g) * 100)); }

/** Animate SVG ring: strokeDashoffset from 157 → value */
function animateRing(id, percentage) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 157 - (157 * Math.min(percentage, 100)) / 100;
  el.style.strokeDashoffset = offset;
}

function setRingPct(id, percentage) {
  const el = document.getElementById(id);
  if (el) el.textContent = percentage + '%';
}

// Gradient helper for canvas charts
function makeGradient(ctx, colorTop, colorBot) {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, colorTop);
  g.addColorStop(1, colorBot);
  return g;
}

// ─────────────────────────────────────────────────────────
//  KPI CARDS
// ─────────────────────────────────────────────────────────
function updateKPIs() {
  const d = DATA[selectedWeek][selectedDay];

  // Steps
  document.getElementById('kpi-val-steps').textContent = fmt(d.steps);
  document.getElementById('today-steps').textContent   = fmt(d.steps);
  const sp = pct(d.steps, GOAL_STEPS);
  animateRing('ring-steps', sp);
  setRingPct('ring-pct-steps', sp);

  // Calories
  document.getElementById('kpi-val-cal').textContent = fmt(d.calories) + ' kcal';
  document.getElementById('today-cal').textContent   = fmt(d.calories);
  const cp = pct(d.calories, GOAL_CAL);
  animateRing('ring-cal', cp);
  setRingPct('ring-pct-cal', cp);

  // Distance
  document.getElementById('kpi-val-dist').textContent = d.distKm.toFixed(1) + ' km';
  const dp = pct(d.distKm, GOAL_DIST);
  animateRing('ring-dist', dp);
  setRingPct('ring-pct-dist', dp);

  // Active minutes
  document.getElementById('kpi-val-active').textContent = d.activeMin + ' min';
  const ap = pct(d.activeMin, GOAL_ACTIVE);
  animateRing('ring-active', ap);
  setRingPct('ring-pct-active', ap);
}

// ─────────────────────────────────────────────────────────
//  LINE CHART  – daily steps/calories for selected week
// ─────────────────────────────────────────────────────────
function buildLineChart() {
  const ctx = document.getElementById('lineChart').getContext('2d');
  const week = DATA[selectedWeek];
  const values = week.map(d => selectedMetric === 'steps' ? d.steps : d.calories);
  const goalLine = new Array(7).fill(selectedMetric === 'steps' ? GOAL_STEPS : GOAL_CAL);
  const label = selectedMetric === 'steps' ? 'Steps' : 'Calories';

  // Update title
  document.getElementById('line-title').textContent =
    `📈 Daily ${label} — ${WEEK_LABELS[selectedWeek]}`;

  // Legend
  document.getElementById('line-legend').innerHTML = `
    <div class="legend-item"><span class="legend-dot" style="background:#6c63ff"></span>${label}</div>
    <div class="legend-item"><span class="legend-dot" style="background:rgba(255,107,107,.7)"></span>Goal</div>
  `;

  const grad = makeGradient(ctx, 'rgba(108,99,255,0.35)', 'rgba(108,99,255,0.0)');

  const config = {
    type: 'line',
    data: {
      labels: DAYS,
      datasets: [
        {
          label: label,
          data: values,
          borderColor: COLORS.accent,
          backgroundColor: grad,
          borderWidth: 3,
          pointBackgroundColor: COLORS.accent,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.45,
        },
        {
          label: 'Goal',
          data: goalLine,
          borderColor: 'rgba(255,107,107,0.6)',
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1e30',
          borderColor: 'rgba(108,99,255,.4)',
          borderWidth: 1,
          titleColor: '#f0f2ff',
          bodyColor: '#8b92b5',
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}${selectedMetric === 'calories' ? ' kcal' : ''}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8b92b5' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#8b92b5',
            callback: v => selectedMetric === 'calories' ? v.toLocaleString() + ' kcal' : v.toLocaleString()
          },
          beginAtZero: true
        }
      }
    }
  };

  if (lineChart) lineChart.destroy();
  lineChart = new Chart(ctx, config);
}

// ─────────────────────────────────────────────────────────
//  PIE CHART  – activity distribution for selected day
// ─────────────────────────────────────────────────────────
function buildPieChart() {
  const ctx = document.getElementById('pieChart').getContext('2d');
  const d = DATA[selectedWeek][selectedDay];

  const pieColors = [COLORS.accent, COLORS.accent2, COLORS.accent3];
  const activities = ['Walking', 'Running', 'Cycling'];
  const values = [d.walk, d.run, d.cycle];

  // Build custom legend
  const legendEl = document.getElementById('pie-legend');
  legendEl.innerHTML = activities.map((a, i) => `
    <div class="pie-legend-item">
      <span class="pie-dot" style="background:${pieColors[i]}"></span>
      ${a} <strong style="color:#f0f2ff">${values[i]}%</strong>
    </div>
  `).join('');

  const config = {
    type: 'doughnut',
    data: {
      labels: activities,
      datasets: [{
        data: values,
        backgroundColor: pieColors,
        hoverBackgroundColor: [
          'rgba(108,99,255,0.9)',
          'rgba(255,107,107,0.9)',
          'rgba(67,233,123,0.9)'
        ],
        borderColor: '#141726',
        borderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1e30',
          borderColor: 'rgba(108,99,255,.4)',
          borderWidth: 1,
          titleColor: '#f0f2ff',
          bodyColor: '#8b92b5',
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  };

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, config);
}

// ─────────────────────────────────────────────────────────
//  BAR CHART  – weekly comparison (all 4 weeks side by side)
// ─────────────────────────────────────────────────────────
function buildBarChart() {
  const ctx = document.getElementById('barChart').getContext('2d');
  const metric = selectedMetric;
  const label = metric === 'steps' ? 'Steps' : 'Calories';

  document.getElementById('bar-title').textContent = `📊 Weekly Comparison — ${label}`;

  // Aggregate weekly totals
  const weekTotals = DATA.map(week =>
    week.reduce((sum, d) => sum + (metric === 'steps' ? d.steps : d.calories), 0)
  );

  const barColors = [
    COLORS.accent,
    COLORS.accent4,
    COLORS.orange,
    COLORS.accent2,
  ];

  const config = {
    type: 'bar',
    data: {
      labels: WEEK_LABELS,
      datasets: [{
        label: `Total ${label}`,
        data: weekTotals,
        backgroundColor: barColors.map(c => c + 'cc'),
        hoverBackgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1e30',
          borderColor: 'rgba(108,99,255,.4)',
          borderWidth: 1,
          titleColor: '#f0f2ff',
          bodyColor: '#8b92b5',
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${label}: ${fmt(ctx.parsed.y)}${metric === 'calories' ? ' kcal' : ''}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#8b92b5' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#8b92b5',
            callback: v => v.toLocaleString()
          },
          beginAtZero: true
        }
      }
    }
  };

  if (barChart) barChart.destroy();
  barChart = new Chart(ctx, config);
}

// ─────────────────────────────────────────────────────────
//  DAY DETAIL CARD
// ─────────────────────────────────────────────────────────
function updateDayDetail() {
  const d   = DATA[selectedWeek][selectedDay];
  const day = DAYS[selectedDay];

  // Stat tiles
  document.getElementById('day-detail-body').innerHTML = `
    <div class="detail-item">
      <p class="detail-item-label">👟 Steps</p>
      <p class="detail-item-value">${fmt(d.steps)}</p>
    </div>
    <div class="detail-item">
      <p class="detail-item-label">🔥 Calories</p>
      <p class="detail-item-value">${fmt(d.calories)} kcal</p>
    </div>
    <div class="detail-item">
      <p class="detail-item-label">📍 Distance</p>
      <p class="detail-item-value">${d.distKm.toFixed(1)} km</p>
    </div>
    <div class="detail-item">
      <p class="detail-item-label">⏱️ Active</p>
      <p class="detail-item-value">${d.activeMin} min</p>
    </div>
  `;

  // Activity progress bars (animated via CSS transition)
  const barsEl = document.getElementById('activity-bars');
  barsEl.innerHTML = `
    <div class="act-row">
      <div class="act-header"><span>🚶 Walking</span><span>${d.walk}%</span></div>
      <div class="act-bar-track"><div class="act-bar-fill bar-walk" id="bar-walk"></div></div>
    </div>
    <div class="act-row">
      <div class="act-header"><span>🏃 Running</span><span>${d.run}%</span></div>
      <div class="act-bar-track"><div class="act-bar-fill bar-run" id="bar-run"></div></div>
    </div>
    <div class="act-row">
      <div class="act-header"><span>🚴 Cycling</span><span>${d.cycle}%</span></div>
      <div class="act-bar-track"><div class="act-bar-fill bar-cycle" id="bar-cycle"></div></div>
    </div>
  `;

  // Trigger CSS transition after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('bar-walk').style.width  = d.walk  + '%';
      document.getElementById('bar-run').style.width   = d.run   + '%';
      document.getElementById('bar-cycle').style.width = d.cycle + '%';
    });
  });
}

// ─────────────────────────────────────────────────────────
//  FULL REFRESH  – called whenever any control changes
// ─────────────────────────────────────────────────────────
function refresh() {
  updateKPIs();
  buildLineChart();
  buildPieChart();
  buildBarChart();
  updateDayDetail();
}

// ─────────────────────────────────────────────────────────
//  CONTROL EVENT LISTENERS
// ─────────────────────────────────────────────────────────
document.getElementById('select-week').addEventListener('change', function () {
  selectedWeek = parseInt(this.value, 10);
  refresh();
});

document.getElementById('select-day').addEventListener('change', function () {
  selectedDay = parseInt(this.value, 10);
  refresh();
});

document.getElementById('metric-toggle').addEventListener('change', function () {
  selectedMetric = this.value;
  refresh();
});

// ─────────────────────────────────────────────────────────
//  INIT – set default day to today (Mon=0 … Sun=6)
// ─────────────────────────────────────────────────────────
(function init() {
  // Map JS getDay() (0=Sun) → our index (0=Mon)
  const jsDay   = new Date().getDay();            // 0-6 (Sun-Sat)
  selectedDay   = jsDay === 0 ? 6 : jsDay - 1;   // convert to Mon-based

  // Clamp just in case
  selectedDay = Math.max(0, Math.min(6, selectedDay));

  // Sync the select element
  document.getElementById('select-day').value = selectedDay;

  refresh();
})();
