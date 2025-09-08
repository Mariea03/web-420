const books = [
    {id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald"},
    {id: 2, title: "1984", author: "George Orwell"},
    {id: 3, title: "To Kill a Mockingbird", author: "Harper Lee"},
];

module.exports = {
    find:() => books,
    findOne: (id) => books.find(book => book.id === id)
};