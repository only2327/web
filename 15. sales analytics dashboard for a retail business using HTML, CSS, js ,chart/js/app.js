/* =========================================
   RetailIQ – Sales Analytics Dashboard JS
   ========================================= */

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const CATEGORIES = ["Electronics","Clothing","Groceries","Home & Garden","Sports"];

// Monthly revenue per category (rows = categories, cols = months)
const monthlyCategoryRevenue = {
  "Electronics":   [42000,38000,51000,47000,60000,55000,72000,68000,80000,91000,110000,130000],
  "Clothing":      [28000,31000,25000,33000,40000,37000,45000,50000,42000,55000, 70000, 88000],
  "Groceries":     [55000,52000,58000,60000,62000,65000,63000,61000,66000,70000, 72000, 78000],
  "Home & Garden": [15000,12000,18000,22000,30000,35000,33000,28000,20000,16000, 13000, 11000],
  "Sports":        [10000,11000,13000,16000,22000,28000,32000,30000,24000,18000, 14000, 12000],
};

// Monthly orders per category
const monthlyCategoryOrders = {
  "Electronics":   [210,190,255,235,300,275,360,340,400,455,550,650],
  "Clothing":      [560,620,500,660,800,740,900,1000,840,1100,1400,1760],
  "Groceries":     [1375,1300,1450,1500,1550,1625,1575,1525,1650,1750,1800,1950],
  "Home & Garden": [125,100,150,183,250,292,275,233,167,133,108, 92],
  "Sports":        [167,183,217,267,367,467,533,500,400,300,233,200],
};

// Top products (static sample)
const TOP_PRODUCTS = [
  { name:"Smart TV 55\"",    category:"Electronics",   revenue:185000, trend:"up"   },
  { name:"Winter Jacket",    category:"Clothing",      revenue:142000, trend:"up"   },
  { name:"Organic Rice 5kg", category:"Groceries",     revenue:98000,  trend:"flat" },
  { name:"Laptop Pro 14",    category:"Electronics",   revenue:95000,  trend:"up"   },
  { name:"Garden Hose Set",  category:"Home & Garden", revenue:61000,  trend:"down" },
  { name:"Running Shoes",    category:"Sports",        revenue:54000,  trend:"up"   },
  { name:"Bluetooth Speaker",category:"Electronics",   revenue:48000,  trend:"up"   },
  { name:"Yoga Mat Pro",     category:"Sports",        revenue:31000,  trend:"flat" },
];

// ─── COLOUR PALETTE ───────────────────────────────────────────────────────────
const PALETTE = {
  blue:    "#3b82f6",
  violet:  "#8b5cf6",
  cyan:    "#06b6d4",
  pink:    "#ec4899",
  emerald: "#10b981",
  amber:   "#f59e0b",
};

const CAT_COLORS = {
  "Electronics":   PALETTE.blue,
  "Clothing":      PALETTE.violet,
  "Groceries":     PALETTE.emerald,
  "Home & Garden": PALETTE.amber,
  "Sports":        PALETTE.cyan,
};

const CAT_PILL_STYLE = {
  "Electronics":   "background:rgba(59,130,246,0.15);color:#3b82f6;",
  "Clothing":      "background:rgba(139,92,246,0.15);color:#8b5cf6;",
  "Groceries":     "background:rgba(16,185,129,0.15);color:#10b981;",
  "Home & Garden": "background:rgba(245,158,11,0.15);color:#f59e0b;",
  "Sports":        "background:rgba(6,182,212,0.15);color:#06b6d4;",
};

// ─── CHART INSTANCES ─────────────────────────────────────────────────────────
let lineChart    = null;
let barChart     = null;
let doughnutChart = null;

// ─── CHART.JS GLOBAL DEFAULTS ─────────────────────────────────────────────────
Chart.defaults.color           = "#8b949e";
Chart.defaults.borderColor     = "rgba(255,255,255,0.07)";
Chart.defaults.font.family     = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
Chart.defaults.plugins.tooltip.backgroundColor = "#1c2230";
Chart.defaults.plugins.tooltip.borderColor     = "rgba(255,255,255,0.1)";
Chart.defaults.plugins.tooltip.borderWidth     = 1;
Chart.defaults.plugins.tooltip.padding         = 10;
Chart.defaults.plugins.tooltip.cornerRadius    = 8;
Chart.defaults.plugins.tooltip.titleColor      = "#e6edf3";
Chart.defaults.plugins.tooltip.bodyColor       = "#8b949e";
Chart.defaults.plugins.legend.display          = false;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n;
}

function sum(arr) { return arr.reduce((a, b) => a + b, 0); }

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function makeGradient(ctx, color, h) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, hexToRgba(color, 0.35));
  grad.addColorStop(1, hexToRgba(color, 0.0));
  return grad;
}

// ─── FILTER STATE ─────────────────────────────────────────────────────────────

function getFilters() {
  return {
    month:    document.getElementById("monthFilter").value,
    category: document.getElementById("categoryFilter").value,
  };
}

// ─── COMPUTE AGGREGATED DATA ──────────────────────────────────────────────────

/**
 * Returns filtered monthly revenue array (sum across selected categories).
 * If a single month is selected the line chart shows daily-simulated data (12 pts).
 */
function getLineData(filters) {
  const activeCats = filters.category === "all"
    ? CATEGORIES
    : [filters.category];

  if (filters.month === "all") {
    // Sum across all active categories per month
    return MONTHS.map((_, mi) =>
      activeCats.reduce((s, cat) => s + monthlyCategoryRevenue[cat][mi], 0)
    );
  } else {
    // Single month selected → show per-week simulation across 12 data points
    const mi = parseInt(filters.month);
    return activeCats.map(cat => monthlyCategoryRevenue[cat][mi]);
  }
}

function getLineLabels(filters) {
  if (filters.month === "all") return MONTHS.map(m => m.slice(0,3));
  const activeCats = filters.category === "all" ? CATEGORIES : [filters.category];
  return activeCats;
}

function getBarData(filters) {
  const mi = filters.month === "all" ? null : parseInt(filters.month);
  const activeCats = filters.category === "all"
    ? CATEGORIES
    : [filters.category];

  return activeCats.map(cat => {
    if (mi === null) return sum(monthlyCategoryRevenue[cat]);
    return monthlyCategoryRevenue[cat][mi];
  });
}

function getDoughnutData(filters) {
  const mi = filters.month === "all" ? null : parseInt(filters.month);
  return CATEGORIES.map(cat => {
    if (mi === null) return sum(monthlyCategoryRevenue[cat]);
    return monthlyCategoryRevenue[cat][mi];
  });
}

// ─── KPI CALCULATIONS ─────────────────────────────────────────────────────────

function computeKPIs(filters) {
  const mi = filters.month === "all" ? null : parseInt(filters.month);
  const activeCats = filters.category === "all" ? CATEGORIES : [filters.category];

  let totalRevenue = 0, totalOrders = 0;
  activeCats.forEach(cat => {
    if (mi === null) {
      totalRevenue += sum(monthlyCategoryRevenue[cat]);
      totalOrders  += sum(monthlyCategoryOrders[cat]);
    } else {
      totalRevenue += monthlyCategoryRevenue[cat][mi];
      totalOrders  += monthlyCategoryOrders[cat][mi];
    }
  });

  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Top category by revenue
  let topCat = CATEGORIES[0], topRev = 0;
  CATEGORIES.forEach(cat => {
    const r = mi === null ? sum(monthlyCategoryRevenue[cat]) : monthlyCategoryRevenue[cat][mi];
    if (r > topRev) { topRev = r; topCat = cat; }
  });

  return { totalRevenue, totalOrders, avgOrder, topCat };
}

// ─── UPDATE KPI CARDS ─────────────────────────────────────────────────────────

function updateKPIs(filters) {
  const { totalRevenue, totalOrders, avgOrder, topCat } = computeKPIs(filters);
  document.getElementById("kpiRevenue").textContent = fmt(totalRevenue);
  document.getElementById("kpiOrders").textContent  = totalOrders.toLocaleString();
  document.getElementById("kpiAvg").textContent     = fmt(avgOrder);
  document.getElementById("kpiGrowth").textContent  = topCat;

  document.getElementById("kpiRevenueChange").textContent = "+12.4%";
  document.getElementById("kpiRevenueChange").className   = "kpi-change positive";
  document.getElementById("kpiOrdersChange").textContent  = "+8.7%";
  document.getElementById("kpiOrdersChange").className    = "kpi-change positive";
  document.getElementById("kpiAvgChange").textContent     = "+3.2%";
  document.getElementById("kpiAvgChange").className       = "kpi-change positive";
  document.getElementById("kpiGrowthChange").textContent  = "Best Seller";
  document.getElementById("kpiGrowthChange").className    = "kpi-change neutral";
}

// ─── LINE CHART ───────────────────────────────────────────────────────────────

function buildLineChart(filters) {
  const ctx = document.getElementById("lineTrendChart").getContext("2d");
  const labels = getLineLabels(filters);
  const data   = getLineData(filters);
  const color  = PALETTE.blue;
  const grad   = makeGradient(ctx, color, 300);

  if (lineChart) lineChart.destroy();

  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Revenue",
        data,
        borderColor: color,
        borderWidth: 2.5,
        pointBackgroundColor: color,
        pointBorderColor: "#161b22",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        backgroundColor: grad,
        fill: true,
        tension: 0.42,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { font: { size: 11 } }
        },
        y: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: {
            font: { size: 11 },
            callback: v => fmt(v)
          },
          beginAtZero: false,
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => " Revenue: " + fmt(ctx.parsed.y)
          }
        }
      }
    }
  });
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────

function buildBarChart(filters) {
  const ctx = document.getElementById("barCategoryChart").getContext("2d");
  const activeCats = filters.category === "all"
    ? CATEGORIES
    : [filters.category];

  const data   = getBarData(filters);
  const colors = activeCats.map(c => CAT_COLORS[c]);
  const bgs    = activeCats.map(c => hexToRgba(CAT_COLORS[c], 0.75));

  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: activeCats.map(c => c.length > 10 ? c.replace(" & ", "\n& ") : c),
      datasets: [{
        label: "Revenue",
        data,
        backgroundColor: bgs,
        borderColor: colors,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: colors,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: "easeOutQuart" },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        },
        y: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: {
            font: { size: 11 },
            callback: v => fmt(v)
          },
          beginAtZero: true,
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => " Revenue: " + fmt(ctx.parsed.y)
          }
        }
      }
    }
  });
}

// ─── DOUGHNUT CHART ───────────────────────────────────────────────────────────

function buildDoughnutChart(filters) {
  const ctx  = document.getElementById("doughnutChart").getContext("2d");
  const data = getDoughnutData(filters);
  const bgColors  = CATEGORIES.map(c => hexToRgba(CAT_COLORS[c], 0.85));
  const bdrColors = CATEGORIES.map(c => CAT_COLORS[c]);

  if (doughnutChart) doughnutChart.destroy();

  doughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: CATEGORIES,
      datasets: [{
        data,
        backgroundColor: bgColors,
        borderColor: bdrColors,
        borderWidth: 2,
        hoverOffset: 12,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      cutout: "68%",
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${fmt(ctx.parsed)}`
          }
        }
      }
    }
  });

  // Build custom legend
  const legendEl = document.getElementById("doughnutLegend");
  legendEl.innerHTML = "";
  CATEGORIES.forEach((cat, i) => {
    const pct = Math.round(data[i] / data.reduce((a,b)=>a+b,0) * 100);
    legendEl.innerHTML += `
      <div class="legend-item">
        <span class="legend-dot" style="background:${bdrColors[i]}"></span>
        <span>${cat} <strong style="color:#e6edf3">${pct}%</strong></span>
      </div>`;
  });
}

// ─── TOP PRODUCTS TABLE ───────────────────────────────────────────────────────

function buildTable(filters) {
  const activeCat = filters.category;
  const mi        = filters.month === "all" ? null : parseInt(filters.month);

  let products = TOP_PRODUCTS;
  if (activeCat !== "all") {
    products = products.filter(p => p.category === activeCat);
  }

  const tbody = document.getElementById("topProductsBody");
  tbody.innerHTML = "";

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#8b949e;padding:24px">No products for selected filters</td></tr>`;
    return;
  }

  products.forEach((p, i) => {
    const trendIcon  = p.trend === "up"   ? "▲" : p.trend === "down" ? "▼" : "●";
    const trendClass = p.trend === "up"   ? "trend-up" : p.trend === "down" ? "trend-down" : "trend-flat";
    const pillStyle  = CAT_PILL_STYLE[p.category] || "";
    tbody.innerHTML += `
      <tr>
        <td><div class="table-rank">${i+1}</div></td>
        <td style="font-weight:600">${p.name}</td>
        <td><span class="cat-pill" style="${pillStyle}">${p.category}</span></td>
        <td style="font-weight:700;color:#e6edf3">${fmt(p.revenue)}</td>
        <td><span class="${trendClass}">${trendIcon}</span></td>
      </tr>`;
  });
}

// ─── APPLY & RESET FILTERS ────────────────────────────────────────────────────

function applyFilters() {
  const filters = getFilters();
  updateKPIs(filters);
  buildLineChart(filters);
  buildBarChart(filters);
  buildDoughnutChart(filters);
  buildTable(filters);
}

function resetFilters() {
  document.getElementById("monthFilter").value    = "all";
  document.getElementById("categoryFilter").value = "all";
  applyFilters();
}

// ─── DATE DISPLAY ─────────────────────────────────────────────────────────────

function setDate() {
  const now = new Date();
  const opts = { weekday:"long", year:"numeric", month:"long", day:"numeric" };
  document.getElementById("currentDate").textContent =
    now.toLocaleDateString("en-IN", opts);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  setDate();
  applyFilters();
});
