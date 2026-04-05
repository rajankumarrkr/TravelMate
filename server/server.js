const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const expenseRoutes = require('./routes/expense.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const aiRoutes = require('./routes/ai.routes');

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// Error Handler
app.use(errorHandler);
// Test Route
app.get('/', (req, res) => {
    res.send('TravelMate API is running 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});