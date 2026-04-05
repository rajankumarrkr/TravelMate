const Trip = require('../models/trip.model');
const ApiError = require('../utils/apiError');
const { generateAIItinerary } = require('./itinerary.service');

/**
 * @desc    Create a new trip with auto-generated itinerary
 */
const createTrip = async (userId, data) => {
    const { destination, startDate, endDate, notes, budget, category } = data;

    if (!destination || !startDate || !endDate) {
        throw new ApiError(400, 'All required fields must be provided');
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
        throw new ApiError(400, 'Start date cannot be after end date');
    }

    // Generate itinerary using AI if not provided
    let finalItinerary = data.itinerary;
    if (!finalItinerary) {
        const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
        const aiResponse = await generateAIItinerary(destination, totalDays, budget || 10000);
        finalItinerary = aiResponse.itinerary;
    }

    const trip = await Trip.create({
        user: userId,
        destination,
        startDate,
        endDate,
        notes,
        category: category || 'Other',
        budget: budget || 10000,
        itinerary: finalItinerary,
    });

    return trip;
};

/**
 * @desc    Get all trips of logged-in user
 */
const getUserTrips = async (userId) => {
    return await Trip.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * @desc    Get single trip by ID
 */
const getTripById = async (tripId, userId) => {
    const trip = await Trip.findOne({ _id: tripId, user: userId });

    if (!trip) {
        throw new ApiError(404, 'Trip not found');
    }

    return trip;
};

/**
 * @desc    Delete trip
 */
const deleteTrip = async (tripId, userId) => {
    const trip = await Trip.findOneAndDelete({
        _id: tripId,
        user: userId,
    });

    if (!trip) {
        throw new ApiError(404, 'Trip not found');
    }

    return trip;
};

/**
 * @desc    Update trip (optional but important for real-world apps)
 */
const updateTrip = async (tripId, userId, data) => {
    const { destination, startDate, endDate, notes, budget, category } = data;

    const trip = await Trip.findOne({ _id: tripId, user: userId });

    if (!trip) {
        throw new ApiError(404, 'Trip not found');
    }

    // Update fields if provided
    if (destination) trip.destination = destination;
    if (notes) trip.notes = notes;
    if (budget) trip.budget = budget;
    if (category) trip.category = category;

    // If dates or budget updated → regenerate itinerary
    if (startDate || endDate || budget) {
        const newStartDate = startDate || trip.startDate;
        const newEndDate = endDate || trip.endDate;
        const newBudget = budget || trip.budget;

        if (new Date(newStartDate) > new Date(newEndDate)) {
            throw new ApiError(400, 'Start date cannot be after end date');
        }

        trip.startDate = newStartDate;
        trip.endDate = newEndDate;

        // Calculate total days
        const totalDays = Math.ceil((new Date(newEndDate) - new Date(newStartDate)) / (1000 * 60 * 60 * 24)) + 1;

        // Generate new itinerary using AI
        const aiResponse = await generateAIItinerary(trip.destination, totalDays, newBudget);
        trip.itinerary = aiResponse.itinerary;
    }

    await trip.save();

    return trip;
};

module.exports = {
    createTrip,
    getUserTrips,
    getTripById,
    deleteTrip,
    updateTrip,
};