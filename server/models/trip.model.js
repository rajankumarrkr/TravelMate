const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    day: Number,
    title: String,
    activities: [String],
    foodSuggestion: String,
    staySuggestion: String,
    estimatedCost: Number,
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
        category: {
            type: String,
            enum: ['Adventure', 'Family', 'Solo', 'Romantic', 'Business', 'Other', 'Magic AI'],
            default: 'Other',
        },
        budget: {
            type: Number,
            default: 0,
        },
        photos: [{
            url: String,
            publicId: String
        }],
        notes: {
            type: String,
        },
        shareToken: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);