const asyncHandler = require('../utils/asyncHandler');
const {
    registerUser,
    loginUser,
} = require('../services/auth.service');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { user, token } = await loginUser(req.body);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        },
    });
});

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile fetched successfully',
        data: req.user,
    });
});

module.exports = {
    register,
    login,
    getProfile,
};