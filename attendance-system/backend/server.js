require('dotenv').config();
console.log('Loading app from:', require.resolve('./app')); // Add this line
const app = require('./app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));