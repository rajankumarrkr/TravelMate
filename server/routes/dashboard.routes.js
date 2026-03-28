const express = require('express');
const router = express.Router();

const { getDashboardController } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, getDashboardController);

module.exports = router;