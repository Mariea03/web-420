// Name: Mariea Nies
// Date: 8/30/25
// File: app.js
// Description: Express app serving IN-N-Out-Books landing page

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// GET route for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 middleware
app.use((req, res, next) => {
    res.status(404).send('404 - Page Not Found');
});

// 500 middleware
app.use((err, req, res, next) => {
    res.status(500);
    const response = { message: err.message };
    if (app.get('env') === 'development') response.stack = err.stack;
    res.json(response);
});

module.exports = app;