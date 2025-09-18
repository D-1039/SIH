const QRCode = require('qrcode');

exports.generateQR = async (courseId) => {
  const qrData = `${courseId}_${Date.now()}`; // Unique QR data
  const qrCodeUrl = await QRCode.toDataURL(qrData);
  return { qrCodeUrl, qrData };
};