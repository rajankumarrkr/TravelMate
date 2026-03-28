const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

const registerUser = async (data) => {
    const { name, email, password } = data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return user;
};

const loginUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(400, 'Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { user, token };
};

module.exports = {
    registerUser,
    loginUser,
};