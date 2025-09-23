const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/analytics', authController.getAnalytics);
router.post('/record', authController.recordAttendance); // Add this
router.post('/generate-qr', authController.generateQR); // Add this

module.exports = router;