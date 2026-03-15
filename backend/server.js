const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jansuvidha')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Schemas ───────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const schemeSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  icon:        { type: String, default: '📋' },
  description: { type: String, required: true },
  benefit:     { type: String, required: true },
  applyLink:   { type: String, required: true },
  eligibility: {
    minAge:      { type: Number, default: 0 },
    maxAge:      { type: Number, default: 99 },
    maxIncome:   { type: Number, default: 999999 },
    gender:      { type: String, default: 'any' },
    castes:      { type: [String], default: [] },
    states:      { type: mongoose.Schema.Types.Mixed, default: 'all' },
    occupations: { type: mongoose.Schema.Types.Mixed, default: 'all' },
    conditions:  { type: [String], default: [] }
  }
}, { timestamps: true });

const searchSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profile:      { type: mongoose.Schema.Types.Mixed },
  resultsCount: { type: Number, default: 0 },
  categories:   { type: [String], default: [] },
  createdAt:    { type: Date, default: Date.now }
});

const User   = mongoose.model('User', userSchema);
const Scheme = mongoose.model('Scheme', schemeSchema);
const Search = mongoose.model('Search', searchSchema);

// ── Auto-seed if DB is empty ──────────────────────────────────────────────────
async function autoSeed() {
  const count = await Scheme.countDocuments();
  if (count === 0) {
    const schemesPath = path.join(__dirname, 'schemes.json');
    if (fs.existsSync(schemesPath)) {
      const schemes = JSON.parse(fs.readFileSync(schemesPath, 'utf8'));
      await Scheme.insertMany(schemes);
      console.log(`🌱 Auto-seeded ${schemes.length} schemes`);
    }
  } else {
    console.log(`📊 ${count} schemes already in database`);
  }
}
mongoose.connection.once('open', autoSeed);

// ── Auth Middleware ────────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET || 'jansuvidha_secret').id;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// ── Eligibility Engine ────────────────────────────────────────────────────────
function checkEligibility(scheme, profile) {
  const e = scheme.eligibility;
  const age = parseInt(profile.age);
  const income = parseInt(profile.income);
  const gender = profile.gender?.toLowerCase();
  const caste = profile.caste?.toLowerCase();
  const state = profile.state?.toLowerCase();
  const occupation = profile.occupation?.toLowerCase();

  // Age check
  if (age < e.minAge || age > e.maxAge) return false;

  // Income check
  if (income > e.maxIncome) return false;

  // Gender check
  if (e.gender !== 'any' && e.gender !== gender) return false;

  // Caste check
  if (e.castes && e.castes.length > 0) {
    const casteMatch = e.castes.some(c =>
      c === caste ||
      c === 'general' ||
      (c === 'ews' && (caste === 'ews' || caste === 'general')) ||
      (c === 'minority' && ['muslim','christian','sikh','buddhist','jain','parsi'].includes(caste))
    );
    if (!casteMatch) return false;
  }

  // State check
  if (e.states !== 'all' && Array.isArray(e.states)) {
    if (!e.states.map(s => s.toLowerCase()).includes(state)) return false;
  }

  // Occupation check
  if (e.occupations !== 'all' && Array.isArray(e.occupations)) {
    const occMatch = e.occupations.some(o => o.toLowerCase() === occupation);
    if (!occMatch) return false;
  }

  return true;
}

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'jansuvidha_secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'jansuvidha_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/auth/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

// ── Scheme Routes ─────────────────────────────────────────────────────────────

// Check eligibility — main feature
app.post('/api/schemes/check', auth, async (req, res) => {
  try {
    const { age, income, gender, caste, state, occupation } = req.body;
    if (!age || !income || !gender || !caste || !state || !occupation)
      return res.status(400).json({ error: 'All profile fields are required' });

    const allSchemes = await Scheme.find({});
    const eligible = allSchemes.filter(s => checkEligibility(s, req.body));

    // Group by category
    const grouped = eligible.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});

    // Save search to history
    await Search.create({
      userId: req.userId,
      profile: req.body,
      resultsCount: eligible.length,
      categories: Object.keys(grouped)
    });

    res.json({
      total: eligible.length,
      schemes: eligible,
      grouped,
      categories: Object.keys(grouped)
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all schemes (browse)
app.get('/api/schemes', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { benefit: { $regex: search, $options: 'i' } }
    ];
    const schemes = await Scheme.find(query).sort({ category: 1, name: 1 });
    res.json(schemes);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get categories
app.get('/api/schemes/categories', async (req, res) => {
  try {
    const categories = await Scheme.distinct('category');
    const counts = await Promise.all(
      categories.map(async cat => ({
        name: cat,
        count: await Scheme.countDocuments({ category: cat })
      }))
    );
    res.json(counts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single scheme
app.get('/api/schemes/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findOne({ id: req.params.id });
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Search history for logged-in user
app.get('/api/history', auth, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.userId })
      .sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Dashboard stats
app.get('/api/stats', auth, async (req, res) => {
  try {
    const totalSchemes = await Scheme.countDocuments();
    const categories = await Scheme.distinct('category');
    const searches = await Search.countDocuments({ userId: req.userId });
    const lastSearch = await Search.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ totalSchemes, totalCategories: categories.length, searches, lastSearch });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 JanSuvidha API running on http://localhost:${PORT}`));
