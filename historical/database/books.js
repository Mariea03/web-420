let books = [
    {id: 1, title: "Book One", author: "Author One" },
    {id: 2, title: "Book Two", author: "Author Two" },
];

// Get all books
function getAllBooks() {
    return books;
}

// Add a new book
function addBook(book) {
    const id = books.length ? books[books.length - 1].id + 1:1;
    const newBook = { id, ...book };
    books.push(newBook);
    return newBook;
}

// Update an existing book
function updateBook(id, updatedBook) {
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
         return false; 
    }

    books[index] = { id, ...updatedbook};
    return true;  
}

module.exports = { getAllBooks, addBook, updateBook, books};