// Name: Mariea Nies
// Date: 9/13/2025
// File: app.js
// Description: Express app serving IN-N-Out-Books landing page

const express = require("express");
const app = express();
const { getAllBooks, addBook, updateBook } = require("../database/books");

app.use(express.json());

// Get all books
app.get("/api/books", (req, res) => {
    res.json(getAllBooks());
});

// POST a new book
app.post("/api/books", (req,res) => {
    try {
        const { title, author } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Bad Request"});
        }
        const newBook = addBook({ title, author});
        return res.status(201).json(newBook);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// PUT update an existing book
app.put("/api/books/:id", (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ error: "Input must be a number" });
        }

        const { title, author } = req.body;

        if (!title) {
            return res.status(400).json ({error: "Bad Request"});
        }

        // Update the book
        const updated = updateBook(Number(id), { title, author});

        if (!updated) {
            return res.status(404).json({ error: "Book not found"});
        }
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ error:message });
    }        
});


module.exports = app;

