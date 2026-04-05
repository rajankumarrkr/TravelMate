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

    // Expense by Category
    const categoryMap = {};
    expenses.forEach(exp => {
        const cat = exp.category.charAt(0).toUpperCase() + exp.category.slice(1);
        categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
    });
    const expenseByCategory = Object.keys(categoryMap).map(key => ({
        name: key,
        value: categoryMap[key]
    }));

    // Monthly Spending
    const monthlyMap = {};
    expenses.forEach(exp => {
        const date = new Date(exp.createdAt);
        const monthYear = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
        if (!monthlyMap[monthYear]) {
            monthlyMap[monthYear] = { amount: 0, date: new Date(date.getFullYear(), date.getMonth(), 1) };
        }
        monthlyMap[monthYear].amount += exp.amount;
    });
    const monthlySpending = Object.keys(monthlyMap)
        .map(key => ({
            month: key,
            amount: monthlyMap[key].amount,
            date: monthlyMap[key].date // for sorting
        }))
        .sort((a, b) => a.date - b.date)
        .map(({ month, amount }) => ({ month, amount }));

    // Trip Duration Stats
    let totalDaysTraveled = 0;
    trips.forEach(trip => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        totalDaysTraveled += (days > 0 ? days : 1);
    });
    const avgTripDuration = trips.length > 0 ? Math.round(totalDaysTraveled / trips.length) : 0;

    // --- Notifications Logic ---
    const notifications = [];
    const today = new Date();
    const upcomingWeek = new Date(today);
    upcomingWeek.setDate(today.getDate() + 7);

    // 1. Upcoming Trip Reminders
    trips.forEach(trip => {
        const startDate = new Date(trip.startDate);
        // Normalize time to compare dates strictly
        startDate.setHours(0, 0, 0, 0);
        const todayNormalized = new Date(today);
        todayNormalized.setHours(0, 0, 0, 0);
        
        if (startDate >= todayNormalized && startDate <= upcomingWeek) {
            const timeDiff = startDate.getTime() - todayNormalized.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            notifications.push({
                id: `reminder-${trip._id}`,
                type: 'reminder',
                title: 'Upcoming Trip',
                message: `Pack your bags! Your trip to ${trip.destination} is coming up in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}.`,
                isCritical: daysLeft <= 2
            });
        }
    });

    // 2. Expense Alerts
    const tripExpenseMap = {};
    expenses.forEach(exp => {
        tripExpenseMap[exp.trip] = (tripExpenseMap[exp.trip] || 0) + exp.amount;
    });

    trips.forEach(trip => {
        const totalSpent = tripExpenseMap[trip._id] || 0;
        const budget = trip.budget || 0;

        if (budget > 0) {
            const percentSpent = (totalSpent / budget) * 100;
            if (percentSpent > 100) {
                notifications.push({
                    id: `alert-critical-${trip._id}`,
                    type: 'alert',
                    title: 'Budget Exceeded',
                    message: `You have exceeded your budget of ₹${budget.toLocaleString()} for ${trip.destination}. Total spent: ₹${totalSpent.toLocaleString()}`,
                    isCritical: true
                });
            } else if (percentSpent >= 80) {
                notifications.push({
                    id: `alert-warning-${trip._id}`,
                    type: 'alert',
                    title: 'Budget Warning',
                    message: `You have spent ${Math.round(percentSpent)}% of your budget for ${trip.destination}. Nearing the limit!`,
                    isCritical: false
                });
            }
        }
    });

    // Upcoming trips for the stats card
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
        expenseByCategory,
        monthlySpending,
        totalDaysTraveled,
        avgTripDuration,
        notifications,
    };
};

module.exports = { getDashboardData };