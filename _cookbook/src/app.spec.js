/* Mariea Nies
09/04/2025
 app.spec.js
*/

describe("Recipe Update API Tests", () => {

    it("should return a 204 status code when updating a recipe", async () => {
        const res = await request(app)
        .put("/api.recipes/1")
        .send({
            name: "Pancakes",
            ingreadients: ["flour", "milk", "eggs","sugar"]
        });
        expect(resizeBy.statusCode).toEqual(204);
    });

    it("should return a 400 status code when updating a recipe with a non-numeric id", async ()=> {
        const res = await request(app)
        .put("/api/recipes/foo")
        .send({
            name: "Test Recipe",
            ingredients: ["test", "test"]
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Input must be a number");
    });

    it("should return a 400 status code when updating a recipe with missing keys", async () => {
        const res = await request(app)
        .put("/api/recipes/1")
        .send({ name: "Test Recipe" });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Bad Request");
    });

    it("should return a 400 status code when updating a recipe with extra key", async () => {
        const res = await request(app)
        .put("/api/recipes/1")
        .send({
            name: "Test Recipe",
            ingredients: ["test", "test"],
            extraKey: "extra"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.mesage).toEqual("Bad Request");
    });
});

describe("User Registration API Tests", () => {
    it("should return a 200 status code with a message of 'Registration successful' when registering a new user", async () => {
       const res = await request(app).post("/api/register").send({
        email: "cedric@hogwarts.edu",
        password: "diggory"
       });
       expect(res.statusCode).toEqual(200);
       expect(res.body.message).toEqual("Registration successful"); 
    });

    it("should return a 409 status code with a message of 'Conflict' when registering a user with a duplicate email", async () => {
        const res = await request(app).post("/api/register").send({
            email: "harry@hogwarts.edu",
            password: "potter"
        });
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual("Conflict");
    });

    it("should return a 400 status code when registering a new user with too many or too few parameter values", async () => {
        const res = await request(app).post("/api/register").send({
            email: "cedric@hogwarts.edu",
            password: "diggory",
            extraKey: "extra"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Bad Request");

        const res2 = await request(app).post("/api/register".send)({
            email: "cedric@hogwarts.edu"
        });
        expect(res2.statusCode).toEqual(400);
        expect(res2.body.message).toEqual("Bad Request");
    });  

describe("Password Reset API Tests", () => {

    it("should return a 200 status code with a message of 'Password rest successful' when resetting a users password", async () => {
        const res = await request(app).post("/api/users/harry@hogwarts.edu/reset-password").send({
            securityQustions: [
                { answer: "Hedwig" },
                { answer: "Quidditch Through the Ages" },
                { answer: "Evans" }
            ],
            newPassword: "password"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Password reset successful");
    });

    it("should return a 400 status code with a message of 'Bad Request' when the request body fails Ajv validation", async () => {
        const res = await request(app).post("/api/users/harry@hogwarts.edu/reset-password").send ({
            securityQuestions: [
                { answer: "Hedwig", question: "What is your pet's name?" },
                { answer: "Quidditch Through the Ages", myName: "Harry Potter" }
            ],
            newPassword: "password"
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual("Bad Resquest");
    });

    it("should return 401 status code with a message of 'Unauthorized' when the security ansers are incorrect", async () => {
        const res = await request(app).post("/api/users/harry@hogwarts.edu/reset-password").send({
            securityQuestions: [
                { answer: "Fluffy" },
                { answer: "Quidditch Through the Ages" },
                { answer: "Evans" }
            ],
            newPassword: "password"
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual("Unauthorized");
    });
})
});