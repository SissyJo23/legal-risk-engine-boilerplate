require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Basic Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// API Routes
app.use('/api/v1', analyzeRouter);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`⚡ Legal Tech Risk Assessment Engine running on http://localhost:${PORT}`);
  console.log(`🛠️ Mode: ${process.env.LLM_PROVIDER_MODE || 'local'} (Zero API Dependency)`);
});
