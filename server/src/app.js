require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.route'); 
const transactionRoutes = require('./routes/transactions.route');

const app = express();
app.use((req, res, next) => {
    console.log(`DEBUG: Request received at ${req.path}`);
    next();
});
const PORT = process.env.PORT || 3000;

// 1. Connect to DB
connectDB();

// 2. Middleware
app.use(express.json());

// 3. Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 4. Default Route
app.get('/', (req, res) => {
    res.json({ message: "API is running" });
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});