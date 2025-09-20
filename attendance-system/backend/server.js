const express = require('express');
const { connectDB } = require('./src/config/db');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' })); // Allow frontend origin
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));