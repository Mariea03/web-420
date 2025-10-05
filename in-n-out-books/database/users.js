const bcrypt = require("bcryptjs");

const users = [
    {
        email: "test@example.com",
        password: bcrypt.hashSync("password123", 10), // store hashed password
        securityQuestions: [
            { question: "What is your favorite fruit?", answer: "cherry"},
            { question: "What is your favorite animal?", answer: "dog"}
        ]
    }
];

function getUserByEmail(email) {
    return users.find((user) => user.email === email);
}

module.exports = { getUserByEmail };