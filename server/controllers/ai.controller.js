const asyncHandler = require('../utils/asyncHandler');
const { extractTripDetails, generateAIItinerary } = require('../services/itinerary.service');

/**
 * @desc    Generate a magic trip plan from a prompt
 * @route   POST /api/ai/plan-magic
 */
const planMagic = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    // 1. Extract details from prompt
    const details = await extractTripDetails(prompt);

    // 2. Generate full itinerary
    const itineraryData = await generateAIItinerary(
        details.destination,
        details.totalDays,
        details.budget
    );

    res.status(200).json({
        success: true,
        data: {
            ...itineraryData,
            prompt,
        },
    });
});

module.exports = { planMagic };
