const client = require("../../db");
const queryes = require("./queries");

const getBooks = async (req, res) => {
  try {
    const result = await client.query(queryes.getBooks);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.log('Error fetching Books:',err);
    return res.status(500).json({ error: "An error occurred while fetching Books" });
  }
};

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
      author_id, 
      genre_id, 
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
    author_id, 
    genre_id, 
    publication_year, 
    copies_available, 
    total_copies,
    authorIds,
    genreIds 
  } = req.body;
  console.log(req.body);
  
  // const client = await pool.connect();

  try {
    // await client.query('BEGIN');


    // Check if the Book already exists
    const BookExistsResult = await client.query(queryes.checkBookExists, [title]);

    if (BookExistsResult.rowCount > 0) {
      return res.status(400).json({ error: "Book already exists" });
    }
    // Step 1: Insert the book
    // const bookInsertQuery = `
    //   INSERT INTO book (title, publication_year, copies_available, total_copies) 
    //   VALUES ($1, $2, $3, $4)
    //   RETURNING id;
    // `;
    // const bookValues = [
    //   bookDetails.title,
    //   bookDetails.publication_year,
    //   bookDetails.copies_available,
    //   bookDetails.total_copies
    // ];
    const addBookResult = await client.query(queryes.addBook, [
      title, 
      author_id, 
      genre_id, 
      publication_year, 
      copies_available, 
      total_copies]);
    
    // const bookResult = await client.query(bookInsertQuery, bookValues);
    const newBookId = addBookResult.rows[0].id;

    // Step 2: Link authors to the book in `book_authors`
    // const bookAuthorsInsertQuery = `
    //   INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2);
    // `;

    for (const authorId of authorIds) {
      console.log("newBookId, authorId",newBookId, authorId);
      
      await client.query(queryes.bookAuthorsInsertQuery, [newBookId, authorId]);
    }

    // Step 3: Link genres to the book in `book_genres`
    // const bookGenresInsertQuery = `
    //   INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2);
    // `;

    for (const genreId of genreIds) {
      console.log("newBookId, genreId",newBookId, genreId);
      
      await client.query(queryes.bookGenresInsertQuery, [newBookId, genreId]);
    }

    // await client.query('COMMIT');
    console.log('Book added successfully with authors and genres.');

    return res.status(201).json({ message: "Book added successfully", Book: addBookResult.rows[0] });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding book:', error);
  } finally {
    // client.release();
  }
}

const deleteBook = async (req, res) => {
  try {
    // Check if the Book exists
    const BookResult = await client.query(queryes.getBookById, [req.params.id]);

    if (BookResult.rowCount === 0) {
      return res.status(404).json({ error: "Book not found"});
    }

    // Delete the Book
    await client.query(queryes.deleteBook, [req.params.id]);

    // Respond with success
    return res.status(200).json({ message: "Book deleted successfully" });

  } catch (err) {
    console.error('Error deleting Book:', err);

    // Handle specific errors if necessary, otherwise send a generic error response
    return res.status(500).json({ error: "An error occurred while deleting the Book", message: err.message });
  }
};

const updateBook = async (req, res) => {
  const { title, author_id, genre_id, publication_year, copies_available, total_copies } = req.body;
  try {
    // Check if the Book exists
    const BookResult = await client.query(queryes.getBookById, [req.params.id]);
    if (BookResult.rowCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    // Update the Genre
    await client.query(queryes.updateBook, [title, author_id, genre_id, publication_year, copies_available, total_copies, req.params.id]);
    // Respond with success message
    return res.status(200).json({ message: "Book updated successfully" });
  } catch (err) {
    console.error('Error updating Book:', err);
    // Handle specific errors if necessary, otherwise send a generic error response
    return res.status(500).json({ error: "An error occurred while updating the Book", message: err.message });
  }
}

// ______________________________



module.exports = {
   getBooks,
   getBookById,
   addBook,
   deleteBook,
   updateBook,
   addBookWithAuthorsAndGenres
};
  