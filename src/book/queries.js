const getBooks = `
SELECT 
  b.id AS id,
  b.title,
  b.publication_year,
  b.copies_available,
  b.total_copies,
  json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name)) AS authors,
  json_agg(DISTINCT jsonb_build_object('id', g.id, 'name', g.name)) AS genres
FROM 
  book b
LEFT JOIN 
  book_authors ba ON b.id = ba.book_id
LEFT JOIN 
  author a ON ba.author_id = a.id
LEFT JOIN 
  book_genres bg ON b.id = bg.book_id
LEFT JOIN 
  genre g ON bg.genre_id = g.id
GROUP BY 
  b.id
ORDER BY 
  b.title;
`

const getBookById = `
SELECT 
  b.id AS book_id,
  b.title,
  b.publication_year,
  b.copies_available,
  b.total_copies,
  json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name)) AS authors,
  json_agg(DISTINCT jsonb_build_object('id', g.id, 'name', g.name)) AS genres
FROM 
  book b
LEFT JOIN 
  book_authors ba ON b.id = ba.book_id
LEFT JOIN 
  author a ON ba.author_id = a.id
LEFT JOIN 
  book_genres bg ON b.id = bg.book_id
LEFT JOIN 
  genre g ON bg.genre_id = g.id
WHERE 
  b.id = $1
GROUP BY 
  b.id;
`;

const addBook = `INSERT INTO book 
    (title, publication_year,copies_available,total_copies) 
    VALUES ($1, $2, $3, $4 ) RETURNING *`;	

const bookAuthorsInsertQuery = `
    INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2);
`;

const bookGenresInsertQuery = `
INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2);
`;
const checkBookExists = "SELECT s FROM book s WHERE s.title = $1";

const deleteBook = "DELETE FROM book WHERE id = $1";

const updateBookQuery = `
    UPDATE book 
    SET title = $1, publication_year = $2, copies_available = $3, total_copies = $4
    WHERE id = $5
    RETURNING *;
`;


module.exports = {
    getBooks,
    getBookById,
    addBook,
    checkBookExists,
    deleteBook,
    bookAuthorsInsertQuery,
    bookGenresInsertQuery,
    updateBookQuery
    
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






  