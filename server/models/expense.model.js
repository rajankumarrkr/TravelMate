const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip',
            required: true,
        },
        category: {
            type: String,
            enum: ['travel', 'food', 'hotel', 'other'],
            default: 'other',
        },
        amount: {
            type: Number,
            required: true,
        },
        note: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);