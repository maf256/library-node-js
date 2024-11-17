const client = require("../../db");
const queryes = require("./queries");
// const { Pool } = require('pg');
// const Pool = require("../../db");
// const getBooks = async (req, res) => {
//   try {
//     const result = await client.query(queryes.getBooks);
//     return res.status(200).json(result.rows);
//   } catch (err) {
//     console.log('Error fetching Books:',err);
//     return res.status(500).json({ error: "An error occurred while fetching Books" });
//   }
// };
async function getAllBooks(req, res) {
  // const client = await pool.connect();

  try {
    // Query to fetch all books with their authors and genres
    // const booksQuery = `
    //   SELECT 
    //     b.id AS book_id,
    //     b.title,
    //     b.publication_year,
    //     b.copies_available,
    //     b.total_copies,
    //     json_agg(DISTINCT jsonb_build_object('id', a.id, 'name', a.name)) AS authors,
    //     json_agg(DISTINCT jsonb_build_object('id', g.id, 'name', g.name)) AS genres
    //   FROM 
    //     book b
    //   LEFT JOIN 
    //     book_authors ba ON b.id = ba.book_id
    //   LEFT JOIN 
    //     author a ON ba.author_id = a.id
    //   LEFT JOIN 
    //     book_genres bg ON b.id = bg.book_id
    //   LEFT JOIN 
    //     genre g ON bg.genre_id = g.id
    //   GROUP BY 
    //     b.id
    //   ORDER BY 
    //     b.title;
    // `;

    const result = await client.query(queryes.getBooks);

    // Return the list of books
    return res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ error: "Error fetching books" });
  } finally {
    // client.release();
  }
}


// _________________________________ 
const getBookById = async (req, res) => {
  try {
    // Execute the query using await
    const result = await client.query(queryes.getBookById, [req.params.id]);

    // Check if the Book exists
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Respond with the Book details
    return res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Error fetching Book:', err);

    // Respond with a generic error message
    return res.status(500).json({ error: "An error occurred while fetching the Book" });
  }
};


// Add Book With Authors And Genres
const addBook = async (req, res) => {
  const { 
    title, 
    author_id, 
    genre_id, 
    publication_year, 
    copies_available, 
    total_copies 
  } = req.body;

  try {
    // Check if the Book already exists
    const BookExistsResult = await client.query(queryes.checkBookExists, [title]);

    if (BookExistsResult.rowCount > 0) {
      return res.status(400).json({ error: "Book already exists" });
    }

    // Add the new Book
    const addBookResult = await client.query(queryes.addBook, [
      title,  
      publication_year, 
      copies_available, 
      total_copies]);

    // Respond with the newly added Book's details
    return res.status(201).json({ message: "Book added successfully", Book: addBookResult.rows[0] });

  } catch (err) {
    console.error('Error adding Book:', err);

    // Respond with a generic error message
    return res.status(500).json({ error: "An error occurred while adding the Book", message: err.message });
  }
};

// Add Book 
async function addBookWithAuthorsAndGenres(req, res) {
  const { 
    title, 
    publication_year, 
    copies_available, 
    total_copies,
    authorIds,
    genreIds 
  } = req.body;
  console.log(req.body);
  
  // const client = await Pool.connect();

  try {
    await client.query('BEGIN');


    // Check if the Book already exists
    const BookExistsResult = await client.query(queryes.checkBookExists, [title]);

    if (BookExistsResult.rowCount > 0) {
      return res.status(400).json({ error: "Book already exists" });
    }

    const addBookResult = await client.query(queryes.addBook, [
      title,  
      publication_year, 
      copies_available, 
      total_copies]);
    
    const newBookId = addBookResult.rows[0].id;

    // Step 2: Link authors to the book in `book_authors`
    for (const authorId of authorIds) {
      console.log("newBookId, authorId",newBookId, authorId);
      
      await client.query(queryes.bookAuthorsInsertQuery, [newBookId, authorId]);
    }

    // Step 3: Link genres to the book in `book_genres`

    for (const genreId of genreIds) {
      console.log("newBookId, genreId",newBookId, genreId);
      
      await client.query(queryes.bookGenresInsertQuery, [newBookId, genreId]);
    }

    await client.query('COMMIT');
    console.log('Book added successfully with authors and genres.');

    return res.status(201).json({ message: "Book added successfully", Book: addBookResult.rows[0] });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding book:', error);
  } finally {
    client.release();
  }
}

// const deleteBook = async (req, res) => {
//   try {
//     // Check if the Book exists
//     const BookResult = await client.query(queryes.getBookById, []);

//     if (BookResult.rowCount === 0) {
//       return res.status(404).json({ error: "Book not found"});
//     }

//     // Delete the Book
//     await client.query(queryes.deleteBook, [req.params.id]);

//     // Respond with success
//     return res.status(200).json({ message: "Book deleted successfully" });

//   } catch (err) {
//     console.error('Error deleting Book:', err);

//     // Handle specific errors if necessary, otherwise send a generic error response
//     return res.status(500).json({ error: "An error occurred while deleting the Book", message: err.message });
//   }
// };

async function deleteBook(req, res) {
  const bookId  = req.params.id; // Get the book ID from the request parameters
  // const client = await pool.connect();

  console.log("bookId", bookId);
  

  try {
    await client.query('BEGIN');

    // Step 1: Delete book-author associations
    await client.query('DELETE FROM book_authors WHERE book_id = $1', [bookId]);

    // Step 2: Delete book-genre associations
    await client.query('DELETE FROM book_genres WHERE book_id = $1', [bookId]);

    // Step 3: Delete the book itself
    const deleteBookQuery = 'DELETE FROM book WHERE id = $1 RETURNING *;';
    const deleteBookResult = await client.query(deleteBookQuery, [bookId]);

    if (deleteBookResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Book not found" });
    }

    await client.query('COMMIT');
    console.log('Book and all associated data deleted successfully.');

    return res.status(200).json({ message: "Book deleted successfully", deletedBook: deleteBookResult.rows[0] });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting book:', error);
    return res.status(500).json({ error: "Error deleting book" });
  } finally {

    // client.release();
  }
}


// const updateBook = async (req, res) => {
//   const { title, author_id, genre_id, publication_year, copies_available, total_copies } = req.body;
//   try {
//     // Check if the Book exists
//     const BookResult = await client.query(queryes.getBookById, [req.params.id]);
//     if (BookResult.rowCount === 0) {
//       return res.status(404).json({ error: "Book not found" });
//     }
//     // Update the Genre
//     await client.query(queryes.updateBook, [title, author_id, genre_id, publication_year, copies_available, total_copies, req.params.id]);
//     // Respond with success message
//     return res.status(200).json({ message: "Book updated successfully" });
//   } catch (err) {
//     console.error('Error updating Book:', err);
//     // Handle specific errors if necessary, otherwise send a generic error response
//     return res.status(500).json({ error: "An error occurred while updating the Book", message: err.message });
//   }
// }

async function updateBookWithAuthorsAndGenres(req, res) {
  const { 
    title, 
    publication_year, 
    copies_available, 
    total_copies, 
    authorIds,       // Array of author IDs to link with the book
    genreIds         // Array of genre IDs to link with the book
  } = req.body;
  const bookId = req.params.id; // The ID of the book to update
  // const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Update book details
    // const updateBookQuery = `
    //   UPDATE book 
    //   SET title = $1, publication_year = $2, copies_available = $3, total_copies = $4
    //   WHERE id = $5
    //   RETURNING *;
    // `;
    const updateBookValues = [title, publication_year, copies_available, total_copies, bookId];

    const updateBookResult = await client.query(queryes.updateBookQuery, updateBookValues);

    if (updateBookResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Book not found" });
    }

    // Step 2: Clear existing authors and genres
    await client.query('DELETE FROM book_authors WHERE book_id = $1', [bookId]);
    await client.query('DELETE FROM book_genres WHERE book_id = $1', [bookId]);

    // Step 3: Link new authors to the book in `book_authors`
    const bookAuthorsInsertQuery = `INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2);`;
    for (const authorId of authorIds) {
      await client.query(bookAuthorsInsertQuery, [bookId, authorId]);
    }

    // Step 4: Link new genres to the book in `book_genres`
    const bookGenresInsertQuery = `INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2);`;
    for (const genreId of genreIds) {
      await client.query(bookGenresInsertQuery, [bookId, genreId]);
    }

    await client.query('COMMIT');
    console.log('Book updated successfully with authors and genres.');

    return res.status(200).json({
      message: "Book updated successfully",
      book: updateBookResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating book:', error);
    return res.status(500).json({ error: "Error updating book" });
  } finally {
    // client.release();
  }
}

// ______________________________



module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  deleteBook,
  addBookWithAuthorsAndGenres,
  updateBookWithAuthorsAndGenres,

};
  