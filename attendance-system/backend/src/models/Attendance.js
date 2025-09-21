const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  status: { type: String, required: true, enum: ['present', 'absent'] },
  timestamp: { type: Date, default: Date.now },
  qrData: { type: String },
  __v: { type: Number, default: 0 },
});

module.exports = mongoose.model('Attendance', attendanceSchema);