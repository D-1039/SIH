const express = require('express');
const { connectDB } = require('./src/config/db');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const cors = require('cors'); // Add this line

const app = express();
app.use(express.json());

// Enable CORS for the frontend port (3001)
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // If you need cookies/auth
}));

// Mount attendance routes
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});