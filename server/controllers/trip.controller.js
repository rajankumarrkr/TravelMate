const asyncHandler = require('../utils/asyncHandler');
const {
    createTrip,
    getUserTrips,
    getTripById,
    deleteTrip,
} = require('../services/trip.service');

// Create Trip
const createTripController = asyncHandler(async (req, res) => {
    const trip = await createTrip(req.user._id, req.body);

    res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: trip,
    });
});

// Get all trips
const getTripsController = asyncHandler(async (req, res) => {
    const trips = await getUserTrips(req.user._id);

    res.status(200).json({
        success: true,
        data: trips,
    });
});

// Get single trip
const getTripController = asyncHandler(async (req, res) => {
    const trip = await getTripById(req.params.id, req.user._id);

    res.status(200).json({
        success: true,
        data: trip,
    });
});

// Delete trip
const deleteTripController = asyncHandler(async (req, res) => {
    await deleteTrip(req.params.id, req.user._id);

    res.status(200).json({
        success: true,
        message: 'Trip deleted successfully',
    });
});

module.exports = {
    createTripController,
    getTripsController,
    getTripController,
    deleteTripController,
};