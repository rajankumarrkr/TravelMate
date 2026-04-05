const express = require('express');
const router = express.Router();

const {
    createTripController,
    getTripsController,
    getTripController,
    deleteTripController,
    uploadTripPhotoController,
    generateShareTokenController,
    getSharedTripController,
} = require('../controllers/trip.controller');

const { protect } = require('../middlewares/auth.middleware');
const upload = require('../utils/multer');

// Public routes MUST be defined before the router.use(protect)
router.get('/shared/:token', getSharedTripController);

router.use(protect);

router.post('/', createTripController);
router.get('/', getTripsController);
router.get('/:id', getTripController);
router.delete('/:id', deleteTripController);
router.post('/:id/photos', upload.single('image'), uploadTripPhotoController);
router.post('/:id/share', generateShareTokenController);

module.exports = router;