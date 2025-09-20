const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // Require studentId
  courseId: { type: String, required: true },
  status: String,
  timestamp: Date,
  qrData: String,
});

module.exports = mongoose.model('Attendance', attendanceSchema);