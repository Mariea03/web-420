// Name: Mariea Nies
// Date: 8/30/25
// File: app.js
// Description: Express app serving IN-N-Out-Books landing page

const express = require('express');
const path = require('path');
const booksDB = require('../database/books')
const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// GET route for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes

//get all books
app.get('/api/books', (req, res) => {
    try {
        const books = booksDB.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch books'});
    }
});

// GET a single book by ID
app.get('/api/books/:id', (req,res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID. Must be a number.'});
        }

        const book = booksDB.findOne(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found.'});
        }

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch book'});
    }
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