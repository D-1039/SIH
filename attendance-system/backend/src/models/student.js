const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Remove select: false if present
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);