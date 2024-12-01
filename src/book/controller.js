const client = require("../../db");
const queryes = require("./queries");

const handleError = (res, error, message, statusCode = 500) => {
  console.error(message, error);
  return res.status(statusCode).json({ error: message });
};

async function getAllBooks(req, res) {
  try {
    const result = await client.query(queryes.getBooks);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error details:", error.stack);
    handleError(res, error, "Error fetching books");
  } finally {
    if (client) {
      try {
        // client.release();
      } catch (releaseError) {
        console.error("Error releasing client:", releaseError);
      }
    }
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
  } catch (error) {
    console.error("Error details:", error.stack); // Log stack trace for debugging
    handleError(res, error, "Error fetching books");
  }
};

// Add Book With Authors And Genres
// const addBook = async (req, res) => {
//   const {
//     title,
//     publication_year,
//     copies_available,
//     total_copies
//   } = req.body;

//   try {
//     // Check if the Book already exists
//     const BookExistsResult = await client.query(queryes.checkBookExists, [title]);

//     if (BookExistsResult.rowCount > 0) {
//       return res.status(400).json({ error: "Book already exists" });
//     }

//     // Add the new Book
//     const addBookResult = await client.query(queryes.addBook, [
//       title,
//       publication_year,
//       copies_available,
//       total_copies]);

//     // Respond with the newly added Book's details
//     return res.status(201).json({ message: "Book added successfully", Book: addBookResult.rows[0] });

//   } catch (error) {
//     console.error("Error details:", error.stack); // Log stack trace for debugging
//     handleError(res, error, "Error fetching books");
//   }
// };

// Add Book
async function addBookWithAuthorsAndGenres(req, res) {
  const {
    title,
    publication_year,
    copies_available,
    total_copies,
    authorIds,
    genreIds,
  } = req.body;
  console.log(req.body);

  // const client = await Pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the Book already exists
    const BookExistsResult = await client.query(queryes.checkBookExists, [
      title,
    ]);

    if (BookExistsResult.rowCount > 0) {
      return res.status(400).json({ error: "Book already exists" });
    }

    const addBookResult = await client.query(queryes.addBook, [
      title,
      publication_year,
      copies_available,
      total_copies,
    ]);

    const newBookId = addBookResult.rows[0].id;

    // Step 2: Link authors to the book in `book_authors`
    for (const authorId of authorIds) {
      console.log("newBookId, authorId", newBookId, authorId);

      await client.query(queryes.bookAuthorsInsertQuery, [newBookId, authorId]);
    }

    // Step 3: Link genres to the book in `book_genres`

    for (const genreId of genreIds) {
      console.log("newBookId, genreId", newBookId, genreId);
      await client.query(queryes.bookGenresInsertQuery, [newBookId, genreId]);
    }

    await client.query("COMMIT");
    console.log("Book added successfully with authors and genres.");

    return res
      .status(201)
      .json({
        message: "Book added successfully",
        Book: addBookResult.rows[0],
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error details:", error.stack); // Log stack trace for debugging
    handleError(res, error, "Error fetching books");
  } finally {
    // client.release();
  }
}

async function deleteBook(req, res) {
  const bookId = req.params.id; // Get the book ID from the request parameters
  // const client = await pool.connect();

  console.log("bookId", bookId);

  try {
    await client.query("BEGIN");

    // Step 1: Delete book-author associations
    await client.query("DELETE FROM book_authors WHERE book_id = $1", [bookId]);

    // Step 2: Delete book-genre associations
    await client.query("DELETE FROM book_genres WHERE book_id = $1", [bookId]);

    // Step 3: Delete the book itself
    const deleteBookQuery = "DELETE FROM book WHERE id = $1 RETURNING *;";
    const deleteBookResult = await client.query(deleteBookQuery, [bookId]);

    if (deleteBookResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Book not found" });
    }

    await client.query("COMMIT");
    console.log("Book and all associated data deleted successfully.");
    return res
      .status(200)
      .json({
        message: "Book deleted successfully",
        deletedBook: deleteBookResult.rows[0],
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error details:", error.stack); // Log stack trace for debugging
    handleError(res, error, "Error fetching books");
  } finally {
    // client.release();
  }
}

async function updateBookWithAuthorsAndGenres(req, res) {
  const {
    title,
    publication_year,
    copies_available,
    total_copies,
    authorIds, // Array of author IDs to link with the book
    genreIds, // Array of genre IDs to link with the book
  } = req.body;
  const bookId = req.params.id; // The ID of the book to update
  // const client = await pool.connect();
  console.log(req.body);

  try {
    await client.query("BEGIN");

    const updateBookValues = [
      title,
      publication_year,
      copies_available,
      total_copies,
      bookId,
    ];

    const updateBookResult = await client.query(
      queryes.updateBookQuery,
      updateBookValues
    );

    if (updateBookResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Book not found" });
    }

    // Step 2: Clear existing authors and genres
    await client.query("DELETE FROM book_authors WHERE book_id = $1", [bookId]);
    await client.query("DELETE FROM book_genres WHERE book_id = $1", [bookId]);

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

    await client.query("COMMIT");
    console.log("Book updated successfully with authors and genres.");

    return res.status(200).json({
      message: "Book updated successfully",
      book: updateBookResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error details:", error.stack); // Log stack trace for debugging
    console.log("error=", error, "res=", res);

    handleError(res, error, "Error fetching books");
  } finally {
    // client.release();
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  deleteBook,
  addBookWithAuthorsAndGenres,
  updateBookWithAuthorsAndGenres,
};
