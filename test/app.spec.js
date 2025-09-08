const request = require("supertest");
const express = require("express");
const app = require("../src/app");

describe("Chapter [Number]: API Tests", () => {
    // Test GET /api/books
    test("Should return an array of books", async () => {
        const res = await request(app).get("/api/books");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("id");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("author");
    });

    // Test Get /api/books/:id
    test("Should return a single book", async () =>{
        const res = await request(app).get("/api/books/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id",1);
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("author");
    });

    // Test 400 error if id is not a number
    test("Should return a 400 error if the id is not a number", async () => {
        const res = await request(app).get("/api/books/abc");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});