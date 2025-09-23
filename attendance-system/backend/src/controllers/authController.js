const { MongoClient, ObjectId } = require('mongodb'); // For native driver if needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student'); // Adjust path as needed
const Attendance = require('../models/attendance'); // Adjust path as needed
const mongoose = require('mongoose');
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

exports.getAnalytics = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const startDate = new Date('2025-09-22T20:26:24.949Z'); // First attendance
    const query = { studentId, timestamp: { $gt: startDate } }; // Exclude the first
    console.log('Attendance query:', query);
    const attendances = await Attendance.find(query);
    console.log('Fetched attendances:', attendances);
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

// Add attendance methods
exports.recordAttendance = async (req, res) => {
  try {
    const { studentId, courseId, qrData } = req.body;
    if (!studentId || !courseId || !qrData) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const result = await mongoose.connection.db.collection('attendances').insertOne({
      studentId, courseId, status: 'present', qrData, timestamp: new Date()
    });
    res.json({ message: 'Attendance recorded', attendance: { _id: result.insertedId, studentId, courseId, status: 'present', qrData, timestamp: new Date() } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateQR = async (req, res) => {
  try {
    const qrData = `CLASS101_${Date.now()}`;
    res.json({ message: 'QR generated', qrData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};