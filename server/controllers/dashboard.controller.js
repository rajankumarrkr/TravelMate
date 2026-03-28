const asyncHandler = require('../utils/asyncHandler');
const { getDashboardData } = require('../services/dashboard.service');

const getDashboardController = asyncHandler(async (req, res) => {
    const data = await getDashboardData(req.user._id);

    res.status(200).json({
        success: true,
        data,
    });
});

module.exports = { getDashboardController };