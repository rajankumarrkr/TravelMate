const asyncHandler = require('../utils/asyncHandler');
const {
    addExpense,
    getExpensesByTrip,
} = require('../services/expense.service');

// Add expense
const addExpenseController = asyncHandler(async (req, res) => {
    const expense = await addExpense(req.user._id, req.body);

    res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: expense,
    });
});

// Get expenses
const getExpensesController = asyncHandler(async (req, res) => {
    const result = await getExpensesByTrip(req.user._id, req.params.tripId);

    res.status(200).json({
        success: true,
        data: result,
    });
});

module.exports = {
    addExpenseController,
    getExpensesController,
};