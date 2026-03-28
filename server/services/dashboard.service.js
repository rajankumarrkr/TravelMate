const Trip = require('../models/trip.model');
const Expense = require('../models/expense.model');

// Dashboard summary
const getDashboardData = async (userId) => {
    // Total trips
    const totalTrips = await Trip.countDocuments({ user: userId });

    // Get all trips
    const trips = await Trip.find({ user: userId });

    const tripIds = trips.map((trip) => trip._id);

    // Total expenses
    const expenses = await Expense.find({ trip: { $in: tripIds } });

    const totalExpenses = expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
    );

    // Upcoming trips
    const today = new Date();

    const upcomingTrips = trips.filter(
        (trip) => new Date(trip.startDate) > today
    );

    // Recent trips (last 5)
    const recentTrips = await Trip.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5);

    return {
        totalTrips,
        totalExpenses,
        upcomingTripsCount: upcomingTrips.length,
        recentTrips,
    };
};

module.exports = { getDashboardData };