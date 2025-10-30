const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (uploaded certificates)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public API Routes (no auth required)
app.use('/api/match', matchRoutes); // Public: Browse causes
app.use('/api/chat', chatRoutes); // Public: Chat suggestions

// Protected API Routes (require auth - to be implemented)
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/verify', verifyRoutes);

// Admin Routes (protected)
app.use('/api/admin', adminRoutes);

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ImpactMatch API is running' });
});

// Public endpoint to get all causes (browse without login)
app.get('/api/causes', async (req, res) => {
  try {
    const Cause = require('./models/Cause');
    const causes = await Cause.find().limit(50);
    res.json({ causes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch causes' });
  }
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`✓ ImpactMatch server running on port ${PORT}`);
  console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Frontend should run on port 3000`);
});
