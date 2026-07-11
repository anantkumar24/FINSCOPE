const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'frontend');

const fs = require('fs');
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data file exists with initial structure
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      profile: null,
      goals: [],
      transactions: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

function readData() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw || '{}');
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Serve static frontend files
// Parse JSON bodies for API endpoints
app.use(express.json());

app.use(express.static(PUBLIC_DIR));

// Simple API endpoint for quick checks
app.get('/api/ping', (req, res) => {
      res.json({ ok: true, time: new Date().toISOString() });
});

// --- Persistence API: profile, goals, transactions ---

// Get full data (profile, goals, transactions)
app.get('/api/data', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Update profile (replace)
app.put('/api/profile', (req, res) => {
  try {
    const payload = req.body;
    const data = readData();
    data.profile = payload;
    writeData(data);
    res.json({ ok: true, profile: data.profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Goals endpoints
app.get('/api/goals', (req, res) => {
  try {
    const data = readData();
    res.json(data.goals || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read goals' });
  }
});

app.post('/api/goals', (req, res) => {
  try {
    const goal = req.body;
    const data = readData();
    goal.id = goal.id || Date.now().toString();
    data.goals = data.goals || [];
    data.goals.push(goal);
    writeData(data);
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add goal' });
  }
});

// Transactions endpoints
app.get('/api/transactions', (req, res) => {
  try {
    const data = readData();
    res.json(data.transactions || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read transactions' });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const tx = req.body;
    tx.id = tx.id || Date.now().toString();
    const data = readData();
    data.transactions = data.transactions || [];
    data.transactions.push(tx);
    writeData(data);
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Fallback to index.html for SPA routing
// Fallback to index.html for any unmatched route (SPA support)
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
    });

app.listen(PORT, () => {
  console.log(`Express server serving '${PUBLIC_DIR}' at http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/ping`);
});
