const Trip = require('../models/trip.model');
const ApiError = require('../utils/apiError');
const { generateItinerary } = require('./itinerary.service');

/**
 * @desc    Create a new trip with auto-generated itinerary
 */
const createTrip = async (userId, data) => {
    const { destination, startDate, endDate, notes } = data;

    if (!destination || !startDate || !endDate) {
        throw new ApiError(400, 'All required fields must be provided');
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
        throw new ApiError(400, 'Start date cannot be after end date');
    }

    // Generate itinerary
    const itinerary = generateItinerary(startDate, endDate);

    const trip = await Trip.create({
        user: userId,
        destination,
        startDate,
        endDate,
        notes,
        itinerary,
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
    const { destination, startDate, endDate, notes } = data;

    const trip = await Trip.findOne({ _id: tripId, user: userId });

    if (!trip) {
        throw new ApiError(404, 'Trip not found');
    }

    // Update fields if provided
    if (destination) trip.destination = destination;
    if (notes) trip.notes = notes;

    // If dates updated → regenerate itinerary
    if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
            throw new ApiError(400, 'Start date cannot be after end date');
        }

        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.itinerary = generateItinerary(startDate, endDate);
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