const getBooks = `
    SELECT 
        book.title, 
        book.publication_year, 
        book.copies_available, 
        book.total_copies,
        book.id,
        book.author_id,
        book.genre_id, 
        author.name AS author_name, 
        genre.name AS genre_name
    FROM 
        book
    JOIN 
        author ON book.author_id = author.id
    JOIN 
        genre ON book.genre_id = genre.id`;
const getBookById = "SELECT * FROM book WHERE id = $1";
const addBook = `INSERT INTO book 
    (title, author_id, genre_id,publication_year,copies_available,total_copies) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;	
const checkBookExists = "SELECT s FROM book s WHERE s.title = $1";
const deleteBook = "DELETE FROM book WHERE id = $1";
const updateBook = "UPDATE book SET title = $1, author_id = $2, genre_id = $3, publication_year = $4, copies_available = $5, total_copies = $6 WHERE id = $7 RETURNING *";

module.exports = {
    getBooks,
    getBookById,
    addBook,
    checkBookExists,
    deleteBook,
    updateBook
}