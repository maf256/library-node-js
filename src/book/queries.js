const getBooks = `
    SELECT 
        book.id,
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

const bookAuthorsInsertQuery = `
    INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2);
`;
const bookGenresInsertQuery = `
INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2);
`;
const checkBookExists = "SELECT s FROM book s WHERE s.title = $1";
const deleteBook = "DELETE FROM book WHERE id = $1";
const updateBook = "UPDATE book SET title = $1, author_id = $2, genre_id = $3, publication_year = $4, copies_available = $5, total_copies = $6 WHERE id = $7 RETURNING *";

module.exports = {
    getBooks,
    getBookById,
    addBook,
    checkBookExists,
    deleteBook,
    updateBook,
    bookAuthorsInsertQuery,
    bookGenresInsertQuery
    
}



// SELECT 
//     b.id AS book_id,
//     b.title AS book_title,
//     b.publication_year,
//     b.copies_available,
//     b.total_copies,
//     STRING_AGG(DISTINCT a.name, ', ') AS authors,
//     STRING_AGG(DISTINCT g.name, ', ') AS genres
// FROM 
//     book b
// LEFT JOIN 
//     book_authors ba ON b.id = ba.book_id
// LEFT JOIN 
//     author a ON ba.author_id = a.id
// LEFT JOIN 
//     book_genres bg ON b.id = bg.book_id
// LEFT JOIN 
//     genre g ON bg.genre_id = g.id
// GROUP BY 
//     b.id, b.title, b.publication_year, b.copies_available, b.total_copies
// ORDER BY 
//     b.title;






  