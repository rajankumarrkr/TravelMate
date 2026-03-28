const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    day: Number,
    plan: String,
});

const tripSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        itinerary: [itinerarySchema],
        budget: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);