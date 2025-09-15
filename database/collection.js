let books = [];

module.exports = {
    getAll: () => books,
    add: (book) => {
        books.push(book);
        return book;
    },
    remove: (id) => {
        const index = books.findIndex(b => b.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            return true;
        }
        return false;
    },
    reset: () => { books = []; }
};