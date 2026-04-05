const express = require('express');
const router = express.Router();
const { planMagic } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');

// Generate magic trip plan (Natural Language)
router.post('/plan-magic', protect, planMagic);

module.exports = router;
