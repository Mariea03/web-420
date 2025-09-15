const request = require('supertest');
const app = require('../src/app');
const books = require('../database/books')

describe("In-N-Out-Books: API Tests", () => {
    beforeEach(() => {
        books.resetBooks();
    });

    test("Should return a 201-status code when adding a new book", async () => {
        const response = await request(app)
          .post('/api/books')
          .send({id: "1", title: "Test Book", author: "Author A"});

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({id: "1", title: "Test Book", author: "Author A"})
        );
    });

    test("Should return a 400-status code when adding a new book with missing title", async () => {
        const response = await request(app)
          .post('/api/books')
          .send({ id: "2", author: "Author B"});
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Book title is required");
    });

    test("Should return a 204-status code when deleting a book", async () => {
        books.addBook({ id: "3", title: "Delete Me", author: "Author C"});

        const response = await request(app)
          .delete('/api/books/3');

        expect(response.status).toBe(204);
    });
});