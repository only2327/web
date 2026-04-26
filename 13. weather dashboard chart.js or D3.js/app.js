/* ═══════════════════════════════════════════════════
   WeatherVision Dashboard – app.js
   All data is static (offline-safe). Uses Chart.js (local).
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── 1. WEATHER DATA ────────────────────────────── */
const WEATHER_DB = {
  mumbai: {
    jan: { temps: genArr(30,28,26,29,31,30,28,27,29,30,31,29,28,30,31,30,29,28,31,30,29,28,30,31,29,28,30,31,29,28),
           humid: genArr(70,68,72,74,71,69,73,75,70,68,72,74,71,73,70,69,72,74,68,70,73,75,71,70,72,74,69,71,73,70),
           rain:  genArr(2,0,4,1,0,3,0,2,1,0,3,0,1,2,0,0,1,4,0,2,3,0,1,0,2,1,0,3,0,1),
           wind:  genArr(12,14,10,16,18,15,12,10,14,16,13,11,15,17,14,12,10,13,16,14,11,13,15,12,10,14,16,13,11,12),
           uv:    genArr(8,7,9,9,8,10,9,8,10,11,8,9,7,10,9,8,11,10,8,9,10,7,8,9,10,8,7,9,8,10),
           conditions: { Sunny: 14, Cloudy: 8, Rainy: 5, Windy: 3 },
           monthly: [2,3,5,8,18,180,250,220,130,40,12,4],
           badge: { temp:'COOL', humid:'MOD', rain:'DRY', wind:'CALM', uv:'HIGH' } },
    apr: { temps: genArr(34,35,36,33,35,37,36,34,35,38,36,35,33,35,37,36,34,35,38,37,35,34,36,37,35,34,36,38,35,34),
           humid: genArr(72,75,78,74,76,79,77,73,75,80,76,74,72,75,78,77,73,74,79,78,75,73,76,78,75,73,76,79,74,72),
           rain:  genArr(0,2,4,1,0,6,3,0,1,0,5,2,0,3,0,0,2,5,0,4,2,0,1,0,3,1,0,6,0,2),
           wind:  genArr(18,20,16,22,24,19,16,14,18,22,17,15,19,23,18,16,14,17,22,18,15,17,21,16,14,18,22,17,15,16),
           uv:    genArr(9,10,11,10,9,12,11,10,12,13,10,11,9,12,11,10,13,12,10,11,12,9,10,11,12,10,9,11,10,12),
           conditions: { Sunny: 18, Cloudy: 6, Rainy: 4, Windy: 2 },
           monthly: [2,3,5,8,18,180,250,220,130,40,12,4],
           badge: { temp:'HOT', humid:'HIGH', rain:'WET', wind:'BREEZY', uv:'VERY HIGH' } },
    jul: { temps: genArr(29,30,28,29,28,30,29,28,30,29,28,29,30,28,29,30,28,29,30,29,28,29,30,29,28,29,30,28,29,30),
           humid: genArr(88,90,92,89,91,93,90,88,92,94,89,91,88,92,90,91,93,89,92,90,88,91,93,90,88,92,94,89,90,91),
           rain:  genArr(18,22,30,15,20,35,28,12,25,38,20,16,24,40,18,22,35,30,15,20,38,25,18,22,35,28,14,22,30,20),
           wind:  genArr(22,25,20,28,30,24,20,18,24,28,22,20,24,30,22,20,18,22,28,24,20,22,28,22,20,24,28,22,20,22),
           uv:    genArr(4,3,2,4,3,2,3,4,3,2,3,4,3,2,3,4,3,2,3,4,3,2,3,4,3,2,3,4,3,2),
           conditions: { Sunny: 2, Cloudy: 10, Rainy: 16, Windy: 2 },
           monthly: [2,3,5,8,18,180,250,220,130,40,12,4],
           badge: { temp:'MILD', humid:'VERY HIGH', rain:'HEAVY', wind:'STRONG', uv:'LOW' } },
  },
  delhi: {
    jan: { temps: genArr(14,12,16,13,15,11,13,14,12,15,13,11,14,16,13,12,15,14,11,13,15,12,14,16,13,11,14,15,12,13),
           humid: genArr(60,65,58,62,64,60,63,65,58,62,60,64,62,58,63,65,60,62,64,60,63,65,58,62,60,64,62,58,63,60),
           rain:  genArr(0,1,2,0,0,1,0,0,2,0,1,0,0,1,2,0,0,1,0,0,2,0,1,0,0,1,2,0,0,1),
           wind:  genArr(8,10,7,9,11,8,7,9,10,8,7,9,11,8,7,9,10,8,7,9,11,8,7,9,10,8,7,9,11,8),
           uv:    genArr(4,5,4,5,6,4,5,6,4,5,6,4,5,6,4,5,6,4,5,6,4,5,6,4,5,6,4,5,6,4),
           conditions: { Sunny: 20, Cloudy: 6, Rainy: 3, Windy: 1 },
           monthly: [15,12,8,5,2,20,180,160,80,20,5,10],
           badge: { temp:'COLD', humid:'LOW', rain:'DRY', wind:'CALM', uv:'MOD' } },
    apr: { temps: genArr(38,40,37,39,41,40,38,37,39,42,40,38,37,40,41,39,37,38,42,41,39,37,40,42,39,37,40,41,39,37),
           humid: genArr(22,20,25,23,21,19,22,24,21,19,23,25,22,20,22,24,21,19,22,24,21,19,22,24,21,19,22,24,21,19),
           rain:  genArr(0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0),
           wind:  genArr(14,16,12,18,20,15,12,10,14,18,13,11,15,19,14,12,10,13,18,14,11,13,17,12,10,14,18,13,11,12),
           uv:    genArr(11,12,11,12,13,11,12,13,11,12,13,11,12,13,11,12,13,11,12,13,11,12,13,11,12,13,11,12,13,11),
           conditions: { Sunny: 22, Cloudy: 5, Rainy: 1, Windy: 2 },
           monthly: [15,12,8,5,2,20,180,160,80,20,5,10],
           badge: { temp:'VERY HOT', humid:'LOW', rain:'DRY', wind:'BREEZY', uv:'EXTREME' } },
    jul: { temps: genArr(33,32,34,33,32,35,33,31,33,35,32,31,33,34,32,31,33,35,32,31,33,35,32,31,33,35,32,31,33,35),
           humid: genArr(78,80,82,79,81,84,80,78,82,86,79,81,78,82,80,81,84,79,82,80,78,81,84,80,78,82,86,79,80,81),
           rain:  genArr(12,18,25,10,15,30,22,8,20,32,15,12,20,35,14,18,30,24,10,15,32,20,14,18,30,22,10,18,25,16),
           wind:  genArr(18,20,16,22,24,18,15,13,18,22,16,14,18,24,16,14,12,16,22,18,14,16,22,16,14,18,22,16,14,16),
           uv:    genArr(5,4,3,5,4,3,4,5,4,3,4,5,4,3,4,5,4,3,4,5,4,3,4,5,4,3,4,5,4,3),
           conditions: { Sunny: 4, Cloudy: 8, Rainy: 18, Windy: 0 },
           monthly: [15,12,8,5,2,20,180,160,80,20,5,10],
           badge: { temp:'WARM', humid:'HIGH', rain:'HEAVY', wind:'STRONG', uv:'LOW' } },
  }
};

// Fill gaps: use mumbai data for other cities/months not in DB
function fillDB() {
  const cities = ['bangalore','kolkata','chennai'];
  const months = ['jan','feb','mar','apr','may','jun','jul'];
  cities.forEach(c => {
    WEATHER_DB[c] = {};
    months.forEach(m => {
      const ref = WEATHER_DB.mumbai[m] || WEATHER_DB.mumbai.apr;
      const tOffset = c === 'bangalore' ? -5 : c === 'kolkata' ? 2 : 1;
      WEATHER_DB[c][m] = {
        temps:      ref.temps.map(v => Math.max(10, v + tOffset + rnd(-2,2))),
        humid:      ref.humid.map(v => Math.min(100, Math.max(10, v + rnd(-5,5)))),
        rain:       ref.rain.map(v  => Math.max(0,   v + rnd(-2,4))),
        wind:       ref.wind.map(v  => Math.max(2,   v + rnd(-3,3))),
        uv:         ref.uv.map(v   => Math.min(13,  Math.max(1, v + rnd(-1,1)))),
        conditions: ref.conditions,
        monthly:    ref.monthly,
        badge:      ref.badge
      };
    });
  });
  // also fill remaining months for delhi/mumbai
  ['mumbai','delhi'].forEach(c => {
    months.forEach(m => {
      if (!WEATHER_DB[c][m]) {
        const ref = WEATHER_DB[c].apr;
        WEATHER_DB[c][m] = { ...ref, temps: ref.temps.map(v=>v+rnd(-3,3)), rain: ref.rain.map(v=>Math.max(0,v+rnd(-2,5))) };
      }
    });
  });
}

function rnd(a, b) { return Math.round(Math.random() * (b - a) + a); }
function genArr(...vals) {
  // If passed 30 values, use them; otherwise generate
  if (vals.length >= 28) return vals.slice(0, 30);
  return Array.from({length: 30}, () => rnd(vals[0], vals[1]));
}
fillDB();

/* ─── 2. CHART THEME ─────────────────────────────── */
const THEME = {
  blue:   '#3b82f6',
  cyan:   '#06b6d4',
  violet: '#8b5cf6',
  pink:   '#ec4899',
  amber:  '#f59e0b',
  green:  '#22c55e',
  red:    '#ef4444',
  grid:   'rgba(255,255,255,0.07)',
  text:   '#94a3b8',
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: THEME.text, font: { size: 11, family: 'Segoe UI' }, boxWidth: 14, padding: 14 } },
    tooltip: {
      backgroundColor: 'rgba(17,23,40,0.95)',
      borderColor: 'rgba(59,130,246,0.3)',
      borderWidth: 1,
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    x: { ticks: { color: THEME.text, font: { size: 10 } }, grid: { color: THEME.grid } },
    y: { ticks: { color: THEME.text, font: { size: 10 } }, grid: { color: THEME.grid }, beginAtZero: false },
  }
};

function gradFill(ctx, color1, color2) {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, color1);
  g.addColorStop(1, color2);
  return g;
}

/* ─── 3. CHART INSTANCES ─────────────────────────── */
let charts = {};

function destroyAll() {
  Object.values(charts).forEach(c => c && c.destroy());
  charts = {};
}

function dayLabels(n = 30) {
  return Array.from({length: n}, (_, i) => `Day ${i + 1}`);
}

function buildCharts(city, month) {
  destroyAll();
  const d = WEATHER_DB[city]?.[month] || WEATHER_DB.mumbai.apr;

  /* ── Temperature Line/Bar Chart ── */
  const tempCtx = document.getElementById('tempChart').getContext('2d');
  const tempGrad = gradFill(tempCtx, 'rgba(59,130,246,0.5)', 'rgba(59,130,246,0.02)');
  charts.temp = new Chart(tempCtx, {
    type: 'line',
    data: {
      labels: dayLabels(),
      datasets: [
        {
          label: 'Max Temp (°C)',
          data: d.temps.map(v => v + rnd(1, 4)),
          borderColor: THEME.red,
          backgroundColor: 'rgba(239,68,68,0.12)',
          borderWidth: 2,
          tension: 0.42,
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: false,
        },
        {
          label: 'Avg Temp (°C)',
          data: d.temps,
          borderColor: THEME.blue,
          backgroundColor: tempGrad,
          borderWidth: 2.5,
          tension: 0.42,
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: true,
        },
        {
          label: 'Min Temp (°C)',
          data: d.temps.map(v => v - rnd(3, 6)),
          borderColor: THEME.cyan,
          backgroundColor: 'rgba(6,182,212,0.08)',
          borderWidth: 2,
          tension: 0.42,
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: false,
        }
      ]
    },
    options: { ...JSON.parse(JSON.stringify(baseOptions)),
      plugins: { ...baseOptions.plugins,
        tooltip: { ...baseOptions.plugins.tooltip, mode: 'index', intersect: false }
      },
      scales: { ...baseOptions.scales,
        y: { ...baseOptions.scales.y,
          ticks: { ...baseOptions.scales.y.ticks, callback: v => v + '°C' }
        }
      }
    }
  });

  /* ── Condition Doughnut ── */
  const condCtx = document.getElementById('condChart').getContext('2d');
  charts.cond = new Chart(condCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(d.conditions),
      datasets: [{
        data: Object.values(d.conditions),
        backgroundColor: [THEME.amber, THEME.text, THEME.blue, THEME.green],
        hoverOffset: 10,
        borderColor: '#1a2340',
        borderWidth: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { color: THEME.text, font: { size: 11 }, padding: 14, boxWidth: 12 } },
        tooltip: baseOptions.plugins.tooltip
      }
    }
  });

  /* ── Humidity + Rainfall Dual Axis ── */
  const humidCtx = document.getElementById('humidChart').getContext('2d');
  const humGrad = gradFill(humidCtx, 'rgba(6,182,212,0.45)', 'rgba(6,182,212,0.03)');
  charts.humid = new Chart(humidCtx, {
    type: 'bar',
    data: {
      labels: dayLabels(),
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: d.rain,
          backgroundColor: 'rgba(59,130,246,0.7)',
          borderRadius: 4,
          yAxisID: 'y1',
          order: 2,
        },
        {
          label: 'Humidity (%)',
          data: d.humid,
          type: 'line',
          borderColor: THEME.cyan,
          backgroundColor: humGrad,
          borderWidth: 2.5,
          tension: 0.4,
          pointRadius: 2,
          fill: true,
          yAxisID: 'y',
          order: 1,
        }
      ]
    },
    options: { ...JSON.parse(JSON.stringify(baseOptions)),
      scales: {
        x: baseOptions.scales.x,
        y: { ticks: { color: THEME.text, callback: v => v + '%' }, grid: { color: THEME.grid }, min: 0, max: 100, title: { display: true, text: 'Humidity (%)', color: THEME.text } },
        y1: { position: 'right', ticks: { color: THEME.text, callback: v => v + 'mm' }, grid: { drawOnChartArea: false }, title: { display: true, text: 'Rainfall (mm)', color: THEME.text } }
      }
    }
  });

  /* ── Wind Speed Radar / Area ── */
  const windCtx = document.getElementById('windChart').getContext('2d');
  const windGrad = gradFill(windCtx, 'rgba(34,197,94,0.4)', 'rgba(34,197,94,0.02)');
  // Sample every 3rd day for cleaner look
  const windLabels = dayLabels().filter((_, i) => i % 3 === 0);
  const windData   = d.wind.filter((_, i) => i % 3 === 0);
  charts.wind = new Chart(windCtx, {
    type: 'line',
    data: {
      labels: windLabels,
      datasets: [{
        label: 'Wind Speed (km/h)',
        data: windData,
        borderColor: THEME.green,
        backgroundColor: windGrad,
        borderWidth: 2.5,
        tension: 0.5,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: THEME.green,
        pointBorderColor: '#1a2340',
        pointBorderWidth: 2,
      }]
    },
    options: { ...JSON.parse(JSON.stringify(baseOptions)),
      scales: { ...baseOptions.scales,
        y: { ...baseOptions.scales.y,
          ticks: { ...baseOptions.scales.y.ticks, callback: v => v + ' km/h' },
          beginAtZero: true
        }
      }
    }
  });

  /* ── UV Index Bar ── */
  const uvCtx = document.getElementById('uvChart').getContext('2d');
  const uvColors = d.uv.map(v =>
    v >= 11 ? '#dc2626' : v >= 8 ? '#f59e0b' : v >= 6 ? '#22c55e' : '#3b82f6'
  );
  charts.uv = new Chart(uvCtx, {
    type: 'bar',
    data: {
      labels: dayLabels(),
      datasets: [{
        label: 'UV Index',
        data: d.uv,
        backgroundColor: uvColors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: { ...JSON.parse(JSON.stringify(baseOptions)),
      plugins: { ...baseOptions.plugins,
        tooltip: { ...baseOptions.plugins.tooltip,
          callbacks: {
            label: ctx => {
              const v = ctx.raw;
              const level = v >= 11 ? 'Extreme' : v >= 8 ? 'Very High' : v >= 6 ? 'High' : v >= 3 ? 'Moderate' : 'Low';
              return ` UV ${v} – ${level}`;
            }
          }
        }
      },
      scales: { ...baseOptions.scales,
        y: { ...baseOptions.scales.y, beginAtZero: true, max: 14, ticks: { ...baseOptions.scales.y.ticks, stepSize: 2 } }
      }
    }
  });

  /* ── Monthly Rainfall Comparison ── */
  const cmpCtx = document.getElementById('compareChart').getContext('2d');
  const months12 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const cmpGrad = gradFill(cmpCtx, 'rgba(139,92,246,0.6)', 'rgba(139,92,246,0.1)');
  charts.compare = new Chart(cmpCtx, {
    type: 'bar',
    data: {
      labels: months12,
      datasets: [{
        label: 'Monthly Rainfall (mm)',
        data: d.monthly,
        backgroundColor: cmpGrad,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: THEME.violet,
      }]
    },
    options: { ...JSON.parse(JSON.stringify(baseOptions)),
      scales: { ...baseOptions.scales,
        y: { ...baseOptions.scales.y, beginAtZero: true, ticks: { ...baseOptions.scales.y.ticks, callback: v => v + ' mm' } }
      }
    }
  });
}

/* ─── 4. STAT CARDS ──────────────────────────────── */
function updateStats(city, month) {
  const d = WEATHER_DB[city]?.[month] || WEATHER_DB.mumbai.apr;
  const avg = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const avgUV = (d.uv.reduce((a,b) => a+b, 0) / d.uv.length).toFixed(1);

  document.getElementById('valTemp').textContent  = avg(d.temps) + '°C';
  document.getElementById('valHumid').textContent = avg(d.humid) + '%';
  document.getElementById('valRain').textContent  = sum(d.rain)  + 'mm';
  document.getElementById('valWind').textContent  = avg(d.wind)  + ' km/h';
  document.getElementById('valUV').textContent    = avgUV;

  // update badges
  const b = d.badge || {};
  const setBadge = (id, txt) => {
    const el = document.querySelector(`#${id} .stat-badge`);
    if (el && txt) el.textContent = txt;
  };
  setBadge('statTemp',  b.temp);
  setBadge('statHumid', b.humid);
  setBadge('statRain',  b.rain);
  setBadge('statWind',  b.wind);
  setBadge('statUV',    b.uv);
}

/* ─── 5. 7-DAY FORECAST ──────────────────────────── */
const FORECAST_ICONS = ['☀️','🌤️','⛅','🌦️','🌧️','⛈️','🌪️'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function buildForecast(city, month) {
  const d = WEATHER_DB[city]?.[month] || WEATHER_DB.mumbai.apr;
  const strip = document.getElementById('forecastStrip');
  strip.innerHTML = '';
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const dt   = new Date(today); dt.setDate(today.getDate() + i);
    const day  = DAYS[dt.getDay()];
    const hi   = d.temps[i] + rnd(1, 4);
    const lo   = d.temps[i] - rnd(3, 6);
    const rain = d.rain[i];
    const iconIdx = rain > 20 ? 5 : rain > 10 ? 3 : rain > 0 ? 2 : 1;
    const icon = FORECAST_ICONS[iconIdx];

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.style.animationDelay = (0.05 * i) + 's';
    card.innerHTML = `
      <div class="fc-day">${i === 0 ? 'TODAY' : day}</div>
      <span class="fc-icon">${icon}</span>
      <div class="fc-hi">${hi}°C</div>
      <div class="fc-lo">${lo}°C</div>
      <div class="fc-rain">💧 ${rain}mm</div>
    `;
    strip.appendChild(card);
  }
}

/* ─── 6. CHART TYPE TOGGLE ───────────────────────── */
document.querySelectorAll('.tog').forEach(btn => {
  btn.addEventListener('click', () => {
    const siblings = btn.parentElement.querySelectorAll('.tog');
    siblings.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');

    const chartId = btn.dataset.chart;
    const mode    = btn.dataset.mode;
    const instance = charts[chartId.replace('Chart', '')];
    if (!instance) return;

    // Toggle temp chart type
    if (chartId === 'tempChart') {
      instance.config.type = mode;
      if (mode === 'bar') {
        instance.data.datasets.forEach(ds => {
          ds.fill = false;
          ds.borderRadius = 4;
        });
      } else {
        instance.data.datasets[1].fill = true;
      }
      instance.update();
    }
  });
});

/* ─── 7. CONTROLS ────────────────────────────────── */
function getCurrentSelections() {
  return {
    city:  document.getElementById('citySelect').value,
    month: document.getElementById('monthSelect').value
  };
}

function refreshDashboard() {
  const { city, month } = getCurrentSelections();
  updateStats(city, month);
  buildCharts(city, month);
  buildForecast(city, month);

  // Pulse animation on refresh btn
  const btn = document.getElementById('refreshBtn');
  btn.style.transform = 'scale(0.92)';
  setTimeout(() => btn.style.transform = '', 200);
}

document.getElementById('citySelect').addEventListener('change', refreshDashboard);
document.getElementById('monthSelect').addEventListener('change', refreshDashboard);
document.getElementById('refreshBtn').addEventListener('click', refreshDashboard);

/* ─── 8. INIT ────────────────────────────────────── */
refreshDashboard();
