const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const mongoose = require('mongoose');
const Attendance = require('../models/attendance'); // Add this import
const secret = process.env.JWT_SECRET || 'your-secret-key';

exports.register = async (req, res) => {
  try {
    const { name, studentId, courseId, email, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      const result = await mongoose.connection.db.collection('students').updateOne(
        { studentId },
        { $set: { password: hashedPassword } }
      );
      console.log('Update result:', result);
      if (result.modifiedCount === 0) {
        throw new Error('No documents modified');
      }
      const token = jwt.sign({ studentId }, secret, { expiresIn: '1h' });
      return res.json({ message: 'Student updated with password', token });
    }
    const student = new Student({ name, studentId, courseId, email, password: hashedPassword });
    await student.save();
    const token = jwt.sign({ studentId }, secret, { expiresIn: '1h' });
    res.json({ message: 'Student registered', token });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (!studentId || !password) {
      return res.status(400).json({ error: 'Student ID and password are required' });
    }
    const student = await mongoose.connection.db.collection('students').findOne({ studentId });
    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }
    if (!student.password) {
      return res.status(500).json({ error: 'Password not set for this student' });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ studentId }, secret, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this new method
exports.getAnalytics = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }
    const attendances = await mongoose.connection.db.collection('attendances')
      .find({ studentId })
      .toArray();
    const totalClasses = attendances.length;
    const presentDays = attendances.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? ((presentDays / totalClasses) * 100).toFixed(2) : 0;

    res.json({
      studentId,
      totalClasses,
      presentDays,
      attendancePercentage: Number(attendancePercentage),
    });
  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ error: err.message });
  }
};