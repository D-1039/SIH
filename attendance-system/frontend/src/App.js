import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [studentId, setStudentId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');

  const generateQR = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/attendance/generate-qr', { courseId: 'CLASS101' });
      setQrCode(response.data.qrData);
      console.log('QR Generated:', response.data.qrData);
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  }, []); // Empty array if no dependencies; add [courseId] if dynamic

  useEffect(() => {
    generateQR();
  }, [generateQR]); // This works, but see note below

  const recordAttendance = async () => {
  try {
    console.log('Button clicked');
    if (!studentId.trim()) {
      setMessage('Please enter a Student ID');
      return;
    }
    const response = await axios.post('http://localhost:3000/api/attendance/record', {
      studentId,
      courseId: 'CLASS101',
      qrData: qrCode || 'INVALID_QR',
    });
    setMessage(response.data.message);
    console.log('Attendance Recorded:', response.data);
  } catch (error) {
    console.error('Error recording attendance:', error.response?.data?.error || error.message);
    setMessage('Error recording attendance');
  }
};

  return (
    <div>
      <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student ID" />
      <button onClick={recordAttendance}>Record Attendance</button>
      <p>{message}</p>
    </div>
  );
}

export default App;