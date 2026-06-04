require('dotenv').config(); // Load environment variables first
const express = require('express');
const connectDB = require('../src/config/db'); // Import the DB connection function

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Initialize Database Connection
connectDB();

// 2. Middleware to parse incoming JSON payloads
app.use(express.json());

// 3. Simple Health-Check Route
app.get('/', (req, res) => {
    res.json({ 
        message: "Welcome to Paisa Tracker API Framework", 
        status: "Running" 
    });
});

// 4. Start the server listener
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});