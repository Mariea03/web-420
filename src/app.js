// Name: Mariea Nies
// Date: 9/13/2025
// File: app.js
// Description: Express app serving IN-N-Out-Books landing page

const express = require('express');
const books = require('../database/books');

const app = express();
app.use(express.json());

app.post('/api/books', (req, res) =>{
    try{
        const {id, title, author} = req.body;

        if (!title) {
            return res.status(400).json({ message: "Book title is required"});
        }

        const newBook = { id, title, author};
        books.addBook(newBook);

        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ message: "Server error"});
    }
});


app.delete('/api/books/:id', (req, res) => {
    try {
        const id = req.params.id;
        const success = books.deleteBook(id);

        if (success) {
            return res.status(204).send();
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = app;

