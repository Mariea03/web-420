const collection = require('./collection');

module.exports = {
    addBook: (book) => collection.add(book),
    deleteBook: (id) => collection.remove(id),
    getBooks: () => collection.getAll(),
    resetBooks: () => collection.reset()
};