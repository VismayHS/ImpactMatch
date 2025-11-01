const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const matchesRoutes = require('./routes/matchesRoutes');
const causeRoutes = require('./routes/causeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partnershipRoutes = require('./routes/partnershipRoutes');

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
app.use('/api/match', matchRoutes); // Public: Browse causes (AI matching)
app.use('/api/matches', matchesRoutes); // Matches CRUD (join/view causes)
app.use('/api/chat', chatRoutes); // Public: Chat suggestions
app.use('/api/causes', causeRoutes); // Causes CRUD
app.use('/api/partnerships', partnershipRoutes); // Partnership/Collaboration requests

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

// Alias route for verifications (some components use /api/verifications instead of /api/verify)
app.use('/api/verifications', verifyRoutes);

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`✓ ImpactMatch server running on port ${PORT}`);
  console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Frontend should run on port 3000`);
});
