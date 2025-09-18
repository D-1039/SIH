const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/generate-qr', attendanceController.generateQR);
router.post('/record', attendanceController.recordAttendance);

module.exports = router;