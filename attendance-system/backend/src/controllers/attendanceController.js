exports.recordAttendance = async (req, res) => {
  try {
    const { studentId, courseId, qrData } = req.body;
    const expectedQrData = `${courseId}_${Date.now()}`; // Simplified validation
    if (!qrData || qrData !== expectedQrData) throw new Error('Invalid QR data');
    const attendance = new Attendance({ studentId, courseId, status: 'present', timestamp: new Date() });
    await attendance.save();
    res.json({ message: 'Attendance recorded', attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};