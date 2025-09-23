const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  courseId: String,
  status: { type: String, enum: ['present', 'absent'], required: true },
  timestamp: { type: Date, default: Date.now }, // Ensure Date type
  qrData: String,
  __v: Number,
});

module.exports = mongoose.model('Attendance', attendanceSchema);