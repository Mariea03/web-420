const request = require('supertest');
const app = require('../src/app');
const { books } = require("../database/books");

beforeEach(() => {
  books.length = 0;
  books.push(
    { id: 1, title: "Book One", author: "Author One" },
    { id: 2, title: "Book Two", author: "Author Two" }
  );
});


describe("In-N-Out-Books: API Tests", () => {
  // GET books test
  test("Should return all books", async ()=> {
    const response = await request(app).get("/api/books");
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

// POST book test
test("Should create a new book and return 201", async () => {
  const response = await request(app)
   .post("/api/books")
   .send({ title: "New Book", author: "New Author" });
  expect(response.status).toEqual(201);
  expect(response.body.title).toBe("New Book");
 });

test("Should return 400 when creating a book without a title", async () => {
  const response = await request(app)
   .post("/api/books")
   .send({ author: "Missing Title" });
  expect(response.status).toEqual(400);
  expect(response.body.error).toBe("Bad Request");
 });

// PUT book tests
test("Should update a book and return 204", async () => {
  const response = await request(app)
   .put("/api/books/1")
   .send({ title: "Updated Title", author: "Updated Author" });
  expect(response.status).toEqual(204);
 });

test("Should return 400 when using non-numeric id", async () => {
  const response = await request (app)
   .put("/api/books/foo")
   .send({ title: "Some Title", author: "Some Author" });
  expect(response.status).toEqual(400);
  expect(response.body.error).toBe("Input must be a number");
 });


test("Should return 400 when updating a book without a title", async () => {
  const response = await request(app)
   .put("/api/books/1")
   .send({ author: "Missing Title" });
  expect(response.status).toEqual(400);
  expect(response.body.error).toBe("Bad Request");
 });

 // New suite for Chapter 5
 describe("Chapter 5: API Tests", () => {
  test("It should return 200 with success message when security questions are correct", async () => {
    const response = await request(app)
     .post("/api/users/test@example.com/verify-security-question")
     .send([{ answer: "cherry" }, { answer: "dog"}]);

    expect(response.status).toEqual(200);
    expect(response.body.message).toBe("Security questions successfully answered");
  });

  test("It should return 400 with Bad Request when request body fails validation", async () => {
    const response = await request(app)
     .post("/api/users/test@example.com/verify-security-question")
     .send([{ wrongField: 123 }]); // Invalid format

    expect(response.status).toEqual(400);
    expect(response.body.error).toBe("Bad Request"); 
  });

  test("It should return 401 with Unauthorized when ansers are incorrect", async () => {
    const response = await request(app)
     .post("/api/users/test@example.com/verify-security-question")
     .send([{ answer: "wrong" }, {answer: "wrong" }]);

    expect(response.status).toEqual(401);
    expect(response.body.error).toBe("Unauthorized"); 
  });
 });
 
});