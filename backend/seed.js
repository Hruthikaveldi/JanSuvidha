const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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

const Scheme = mongoose.model('Scheme', schemeSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jansuvidha');
    console.log('✅ MongoDB connected');

    const schemes = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'schemes.json'), 'utf8')
    );

    await Scheme.deleteMany({});
    console.log('🗑️  Cleared existing schemes');

    await Scheme.insertMany(schemes);
    console.log(`🌱 Seeded ${schemes.length} government schemes`);

    const categories = [...new Set(schemes.map(s => s.category))];
    console.log('\n📊 Categories:');
    categories.forEach(cat => {
      const count = schemes.filter(s => s.category === cat).length;
      console.log(`   ${cat}: ${count} schemes`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
