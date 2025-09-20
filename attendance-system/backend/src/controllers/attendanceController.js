const Attendance = require('../../models/attendance');

exports.recordAttendance = async (req, res) => {
  try {
    const { studentId, courseId, qrData } = req.body;
    const expectedQrData = qrData || `${courseId}_${Date.now()}`; // Use received qrData if available
    console.log('Received:', { studentId, courseId, qrData });
    console.log('Expected:', expectedQrData);
    if (!qrData) throw new Error('No QR data provided');
    const attendance = new Attendance({ studentId, courseId, status: 'present', timestamp: new Date(), qrData: expectedQrData });
    await attendance.save();
    res.json({ message: 'Attendance recorded', attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateQR = async (req, res) => {
  try {
    const { courseId } = req.body;
    const qrData = `${courseId}_${Date.now()}`;
    res.json({ qrData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};