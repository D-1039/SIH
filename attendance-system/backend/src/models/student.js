const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  studentId: { type: String, required: true, unique: true },
  courseId: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  __v: Number,
});

module.exports = mongoose.model('Student', studentSchema);