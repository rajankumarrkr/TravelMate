const asyncHandler = require('../utils/asyncHandler');
const {
    createTrip,
    getUserTrips,
    getTripById,
    deleteTrip,
    addPhotoToTrip,
    generateShareToken,
    getSharedTripByToken,
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

// Upload trip photo
const uploadTripPhotoController = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an image file');
    }

    const photoData = {
        url: req.file.path,
        publicId: req.file.filename,
    };

    const trip = await addPhotoToTrip(req.params.id, req.user._id, photoData);

    res.status(200).json({
        success: true,
        message: 'Photo uploaded successfully',
        data: trip.photos,
    });
});

// Generate Share Token
const generateShareTokenController = asyncHandler(async (req, res) => {
    const token = await generateShareToken(req.params.id, req.user._id);

    res.status(200).json({
        success: true,
        message: 'Share token generated successfully',
        data: { token },
    });
});

// Get Shared Trip (Public)
const getSharedTripController = asyncHandler(async (req, res) => {
    const trip = await getSharedTripByToken(req.params.token);

    res.status(200).json({
        success: true,
        data: trip,
    });
});

module.exports = {
    createTripController,
    getTripsController,
    getTripController,
    deleteTripController,
    uploadTripPhotoController,
    generateShareTokenController,
    getSharedTripController,
};