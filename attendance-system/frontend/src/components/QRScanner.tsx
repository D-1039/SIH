import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Use QRCodeSVG as the named export

const QRScanner: React.FC = () => {
  const [studentId] = useState('STUD001');
  const [classId] = useState('CLASS101');
  const qrData = `${studentId}-${classId}-${Date.now()}`;

  // Type assertion with unknown first to satisfy TypeScript
  const QRCodeComponent = QRCodeSVG as unknown as React.ComponentType<{ value: string }>;

  return (
    <div>
      <h2>Scan QR Code</h2>
      <QRCodeComponent value={qrData} />
      <p>Scan this code to mark attendance.</p>
    </div>
  );
};

export default QRScanner;