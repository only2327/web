const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect('mongodb://127.0.0.1:27017/insuranceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('ℹ️  Server running without DB (in-memory mode)');
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Models ────────────────────────────────────────────────────────────────────

// Quote Schema
const quoteSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  planType: { type: String, required: true }, // health, life, vehicle, home
  coverAmount: { type: Number, required: true },
  premium: { type: Number },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// Policy Schema
const policySchema = new mongoose.Schema({
  policyNumber: { type: String, unique: true },
  holderName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  planType: { type: String, required: true },
  coverAmount: { type: Number, required: true },
  premium: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

// Claim Schema
const claimSchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  holderName: { type: String, required: true },
  claimType: { type: String, required: true },
  description: { type: String, required: true },
  claimAmount: { type: Number, required: true },
  status: { type: String, default: 'Under Review' },
  createdAt: { type: Date, default: Date.now }
});

const Quote = mongoose.model('Quote', quoteSchema);
const Policy = mongoose.model('Policy', policySchema);
const Claim = mongoose.model('Claim', claimSchema);

// ─── Helper: calculate premium ────────────────────────────────────────────────
function calculatePremium(planType, age, coverAmount) {
  const rates = { health: 0.025, life: 0.018, vehicle: 0.030, home: 0.012 };
  const ageFactor = age < 30 ? 1.0 : age < 45 ? 1.2 : age < 60 ? 1.5 : 1.8;
  const baseRate = rates[planType] || 0.02;
  return Math.round(coverAmount * baseRate * ageFactor / 12); // monthly premium
}

// ─── Helper: generate policy number ──────────────────────────────────────────
function generatePolicyNumber() {
  return 'POL-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// ─── API Routes ───────────────────────────────────────────────────────────────

/* ---- QUOTES ---- */
// POST /api/quotes  – Submit a quote request
app.post('/api/quotes', async (req, res) => {
  try {
    const { fullName, email, phone, age, planType, coverAmount } = req.body;
    if (!fullName || !email || !phone || !age || !planType || !coverAmount) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const premium = calculatePremium(planType, parseInt(age), parseInt(coverAmount));
    const quote = new Quote({ fullName, email, phone, age, planType, coverAmount, premium });
    await quote.save();
    res.json({ success: true, message: 'Quote submitted successfully!', premium, quote });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/quotes  – List all quotes
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json({ success: true, quotes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---- POLICIES ---- */
// POST /api/policies  – Create a policy (activate a quote)
app.post('/api/policies', async (req, res) => {
  try {
    const { holderName, email, phone, planType, coverAmount, premium } = req.body;
    if (!holderName || !email || !phone || !planType || !coverAmount || !premium) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const policyNumber = generatePolicyNumber();
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const policy = new Policy({ policyNumber, holderName, email, phone, planType, coverAmount, premium, startDate, endDate });
    await policy.save();
    res.json({ success: true, message: 'Policy created successfully!', policy });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/policies  – List all policies
app.get('/api/policies', async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.json({ success: true, policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/policies/:number  – Get single policy
app.get('/api/policies/:number', async (req, res) => {
  try {
    const policy = await Policy.findOne({ policyNumber: req.params.number });
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found.' });
    res.json({ success: true, policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---- CLAIMS ---- */
// POST /api/claims  – Submit a claim
app.post('/api/claims', async (req, res) => {
  try {
    const { policyNumber, holderName, claimType, description, claimAmount } = req.body;
    if (!policyNumber || !holderName || !claimType || !description || !claimAmount) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const claim = new Claim({ policyNumber, holderName, claimType, description, claimAmount });
    await claim.save();
    res.json({ success: true, message: 'Claim submitted successfully! We will review it shortly.', claim });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// GET /api/claims  – List all claims
app.get('/api/claims', async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json({ success: true, claims });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/claims/:id/status  – Update claim status
app.patch('/api/claims/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await Claim.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found.' });
    res.json({ success: true, message: 'Status updated.', claim });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---- STATS ---- */
app.get('/api/stats', async (req, res) => {
  try {
    const totalPolicies = await Policy.countDocuments();
    const totalClaims = await Claim.countDocuments();
    const totalQuotes = await Quote.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'Under Review' });
    res.json({ success: true, stats: { totalPolicies, totalClaims, totalQuotes, pendingClaims } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Page Routes ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/plans', (req, res) => res.sendFile(path.join(__dirname, 'public', 'plans.html')));
app.get('/quote', (req, res) => res.sendFile(path.join(__dirname, 'public', 'quote.html')));
app.get('/claims', (req, res) => res.sendFile(path.join(__dirname, 'public', 'claims.html')));
app.get('/policy', (req, res) => res.sendFile(path.join(__dirname, 'public', 'policy.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ShieldSure Insurance Server running at http://localhost:${PORT}`);
  console.log('📄 Pages: Home | Plans | Quote | Claims | Policy | Admin\n');
});
