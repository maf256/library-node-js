const { Router } = require("express");
const { authenticate } = require('../middleware');

const {
  getAllBooks,
  addBookWithAuthorsAndGenres,
  getBookById,
  updateBookWithAuthorsAndGenres,
  deleteBook,
} = require("./controller");
const router = Router();
const { validateBook, bookSchema } = require("./validation");

router.get("/", getAllBooks);
router.post("/",authenticate, validateBook(bookSchema), addBookWithAuthorsAndGenres);
router.put("/:id",authenticate, validateBook(bookSchema), updateBookWithAuthorsAndGenres);
router.get("/:id",authenticate, getBookById);
router.delete("/:id",authenticate, deleteBook);

module.exports = router;
