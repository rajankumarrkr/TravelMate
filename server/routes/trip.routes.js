const express = require('express');
const router = express.Router();

const {
    createTripController,
    getTripsController,
    getTripController,
    deleteTripController,
} = require('../controllers/trip.controller');

const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', createTripController);
router.get('/', getTripsController);
router.get('/:id', getTripController);
router.delete('/:id', deleteTripController);

module.exports = router;