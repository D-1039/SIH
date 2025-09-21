const express = require('express');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const authRoutes = require('./src/routes/authRoutes');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' })); // Allow frontend

app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app; // Export the configured app