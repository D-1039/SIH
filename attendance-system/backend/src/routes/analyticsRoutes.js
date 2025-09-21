const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

router.get('/count', async (req, res) => {
  try {
    const count = await Attendance.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;