const express = require('express');
const { connectDB, mongoose } = require('./src/config/db');
const attendanceRoutes = require('./src/routes/attendanceRoutes');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use('/api/attendance', attendanceRoutes);

module.exports = app;