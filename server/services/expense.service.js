const Expense = require('../models/expense.model');
const Trip = require('../models/trip.model');
const ApiError = require('../utils/apiError');

// Add expense
const addExpense = async (userId, data) => {
    const { tripId, category, amount, note } = data;

    // Check trip ownership
    const trip = await Trip.findOne({ _id: tripId, user: userId });
    if (!trip) {
        throw new ApiError(404, 'Trip not found');
    }

    const expense = await Expense.create({
        trip: tripId,
        category,
        amount,
        note,
    });

    return expense;
};

// Get all expenses of a trip
const getExpensesByTrip = async (userId, tripId) => {
    const trip = await Trip.findOne({ _id: tripId, user: userId });
    if (!trip) {
        throw new ApiError(404, 'Trip not found');
    }

    const expenses = await Expense.find({ trip: tripId }).sort({ createdAt: -1 });

    // Calculate total
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return { expenses, total };
};

module.exports = {
    addExpense,
    getExpensesByTrip,
};