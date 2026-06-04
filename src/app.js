const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Simple Health-Check Route
app.get('/', (req, res) => {
    res.json({ 
        message: "Welcome to Paisa Tracker API Framework", 
        status: "Running" 
    });
});

// Start the server listener
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});