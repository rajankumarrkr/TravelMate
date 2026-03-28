const express = require('express');
const router = express.Router();

const {
    addExpenseController,
    getExpensesController,
} = require('../controllers/expense.controller');

const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', addExpenseController);
router.get('/:tripId', getExpensesController);

module.exports = router;