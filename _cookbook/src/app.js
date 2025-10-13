/* Mariea Nies
09/04/2025
 app.js
*/

// Require dependencies
const express = require("express");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const Ajv = require("ajv");
const users = require("../database/users");
const recipes = require("../database/recipes");

//  Create an Express application
const app=express(); 

//  Use middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended:true }));


// AJV Setup 
const ajv = new Ajv();
const securityQuestionSchema = {
    type: "object",
    properties: {
        newPassword: { type: "string" },
        securityQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: { answer: { type: "string" } },
                required: ["answer"],
                additionalProperties: false
            }
        }
    },
    required: ["newPassword", "securityQuestions"],
    additionalProperties: false
};


// GET route for root URL ("/")
app.get("/",async (req, res, next) => {
    //HTML content for the landing page
    const html =`
    <html>
    <head>
        <title>Cookbook App</title>
        <style>
            body, h1, h2, h3 {margin: 0; padding: 0, border: 0;}
            body {
                background: #424242;
                color: #fff;
                margin: 1.25;
                font-size: 1.25rem;
            }
            h1, h2, h3 { color: #EF5350; font-family: 'Emblema One', cursive;}
            h1, h2 { text-align: center }
            h3 { color: #fff;}
            .container { width: 50%; margin: 0 auto; font-family: 'Lora', serif; }
            .recipe { border: 1px solid # EF5350; padding: 1rem; margin: 1rem 0; }
            .recipe h3 { margin-top: 0; }
            main a { color: #fff; text-decoration: none; }
            main a:hover { color: #EF3550; text-decoration: underline;}
        </style>
        </head>   
        <body>
            <div class="container">
                <header>
                    <h1>Cookbook App</h1>
                    <h2>Discover and Share Amazing Recipes</h2>
                </header>
                <br />
                <main>
                    <div class="recipe">
                        <h3>Classic Beef Taco</h3>
                        <p>1. Brown the ground beef in a skillet. <br />
                        2. Warm the taco shells in the oven. <br />
                        3. Fill the taco shells with beef, lettuce, and cheese.</p>
                    </div>
                    <div class="recipe">
                        <h3>Vegetarian Lasagna</h3>
                        <p>1. Layer lasagna noodles, marinara sauce, and cheese in a baking dish.<br />
                        2. Bake at 375 degrees for 45 minutes. <br />
                        3. Let cool before serving. </p>
                    </div>
                </main>
            </div>
            </body> 
    </html>
    `; 
    res.send(html); 
});

// Get all recipes
app.get("/api/recipies", async (req, res, next) => {
    try {
        const allRecipes = await recipes.find();
        res.send(allRecipes);
    } catch (err) {
        next(err);
    }
});

// Get a single recipe by id
app.get("/api/recipies/:id", async (req, res, next) => {
    try{
        let { id } = req.params;
        id = parseInt(id);
        if (isNaN(id)) return next(createError(400, "Input must be a number"));
        const recipe = await recipes.findOne({ id });
    } catch (err) {
        next(err);
    }
});

app.post("/api/recipies", async (req, res, next) => {
    try{
        const newRecipe = req.body;
        const expectedKeys = ["id", "name", "ingredients"];
        const recievedKeys = Object.keys(newRecipe);
        if (!recievedKeys.every(key => expectedKeys.includes(key)) ||
           recievedKeys.length !== expectedKeys.length) {
       return next(createError(400, "Bad Request"));
    }
    const result = await recipes.insertOne(newRecipe);
    res.status(201).send({ id: result.ops[0].id});
  } catch (err) {
    next (err);
  }
});

app.post("/api/register", async (req, res, next) => {
    console.log("Request body: ", req.body);
    try {
        const user = req.body;

        // Validate request body keys
        const expectedKeys = ["email", "password"];
        const recievedKeys = Object.keys(user);
        if (!recievedKeys.every(key => expectedKeys.includes(key)) ||
            recievedKeys.length !== expectedKeys.length) {
                return next(createError(400, "Bad Request"));
            }
        
        // Check for duplicate email
        let duplicateUser;
        try {
            duplicateUser = await users.findOne({ email: user.email });
        }    catch (err) {
             duplicateUser = null;
        }
        if (duplicateUser) {
            return next(createError(409, "Conflict"));
        }

        // Hash password and insert new user
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        const newUser = await users.insertOne({
            email: user.email,
            password: hashedPassword
        });

        res.status(200).send({ user: newUser, message: "Registration successful" });
      } catch (err) {
        next (err);
      }  
});

app.put("/api/recipies/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let recipe = req.body;

        // Validate numeric ID
        id = parseInt(id);
        if (isNaN(id)) {
            return next(createError(400, "Input must be a number"));
        }

        //validate request body keys
        const expectedKeys = ["name", "ingredients"];
        const recievedKeys = Object.keys(recipe);
        if (!recievedKeys.every(key => expectedKeys.includes(key)) ||
            recievedKeys.length !== expectedKeys.length) {
          return next(createError(400, "Bad Request"));
        }

        // Update recipe
        const result = await recipes.updateOne({ id: id }, recipe);
        console.log("Result: ", result);
        res.status(204).send();

    } catch (err) {
        if (err.message === "no matching item found") {
            return next(createError(404, "Recipe not found"));
        }
        next(err);
    }
});

// Password reset route
app.post("/api/users/:email/reset-password", async (req, res, next) => {
    try {
        const { email } = req.params;
        const { newPassword, securityQuestions } = req.body;

        const validate = ajv.compile(securityQuestionsSchema);
        if (!validate(req.body)) {
            return next(createError(400, "Bad Request"));
        }

        const user = await users.findOne({ email });

        if (
            securityQuestions[0].answer !== user.securityQuestions[0].answer ||
            securityQuestions[1].answer !== user.securityQuestions[1].answer ||
            securityQuestions[2].answer !== user.securityQuestions[2].answer 
        ){
            return next(createError(401, "Unauthorized"));
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;

        await users.updateOne({ email }, { user });

        res.status(200).send({ message: "Password reset seccessful", user });
    } catch (err) {
        next (err);
    }
});

app.delete("/api/recipies/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await recipes.deleteOne({ id: parseInt(id) });
        res.status(204).send();
    } catch (err) {
        if (err.message === "No matching item found") {
            return next(createError(404, "Recipe not found"));
        }
        next(err);
    }
});

// Middleware to handle 404 errors
app.use((req, res, next) => {
    next(createError(404, "This page could not be found."));
});

// Middleware to handle 500 errors
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: err.status || 500,
        message: err.message,
        stack: req.app.get("env") === "development" ? err.stack : {}
    });
});

module.exports = app;