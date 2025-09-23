const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const cors = require('cors');
const authMiddleware = require('./src/middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' })); // Allow frontend

// Apply middleware to all routes except register and login
app.use((req, res, next) => {
  if (req.path === '/api/auth/register' || req.path === '/api/auth/login') {
    return next();
  }
  authMiddleware(req, res, next);
});

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app; // Export the configured app