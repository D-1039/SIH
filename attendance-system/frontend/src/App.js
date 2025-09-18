import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [qrCode, setQrCode] = useState('');
  const [courseId, setCourseId] = useState('CLASS101');
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');

  const generateQR = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/attendance/generate-qr', { courseId });
      setQrCode(response.data.qrCodeUrl);
    } catch (err) {
      console.error('Error generating QR:', err);
    }
  }, [courseId]);

  const recordAttendance = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/attendance/record', {
        studentId,
        courseId,
        qrData: qrCode ? 'VALID_QR' : '',
      });
      setMessage(response.data.message);
    } catch (err) {
      console.error('Error recording attendance:', err);
      setMessage('Error recording attendance');
    }
  };

  useEffect(() => {
    generateQR();
  }, [courseId, generateQR]);

  return (
    <div className="App">
      <h1>Attendance QR Code</h1>
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <input
        type="text"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        placeholder="Enter Course ID"
      />
      <button onClick={generateQR}>Generate QR</button>
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Enter Student ID"
      />
      <button onClick={recordAttendance}>Record Attendance</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;