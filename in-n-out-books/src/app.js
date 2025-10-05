// Name: Mariea Nies
// Date: 9/13/2025
// File: app.js
// Description: Express app serving IN-N-Out-Books landing page

const express = require("express");
const Ajv = require("ajv");
const { getAllBooks, addBook, updateBook } = require("../database/books");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("../database/users");

const app = express();
app.use(express.json());

const ajv = new Ajv();

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
        return res.status(500).json({ error: error.message });
    }        
});

// Adding wk 6
app.post("/api/login", (req, res)=> {
    try{
        const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password){
        return res.status(400).json({ error: "Bad Request" });
    } 
    
    const user = getUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Compare password with stored hash
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Adding wk 7
const securitySchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            answer: {type: "string" }
        },
        required: ["answer"],
        additionalProperties: false
    }
};
const validateSecurity = ajv.compile(securitySchema);

app.post("/api/users/:email/verify-security-question", (req, res) => {
    try{
        const valid = validateSecurity(req.body);
        if (!valid) return res.status(400).json({ error: "Bad Request" });

        const email = req.params.email;
        const user = getUserByEmail(email);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const correct = user.securityQuestions.every(
            (q, i) => q.answer === req.body[i]?.answer
        );

        if (!correct) return res.status(401).json({ error: "Unauthorized" });

        return res.status(200).json({ message: "Security questions successfully answered" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = app;

