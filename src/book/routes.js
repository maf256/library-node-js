const { Router } = require('express');
const {getAllBooks,
    addBookWithAuthorsAndGenres,
    getBookById,
    updateBookWithAuthorsAndGenres,
    deleteBook} = require('./controller');
const router = Router(); 
const { validateBook, bookSchema } = require('./validation');

router.get('/', getAllBooks);
router.post('/', validateBook(bookSchema), addBookWithAuthorsAndGenres);
router.put('/:id', validateBook(bookSchema), updateBookWithAuthorsAndGenres);
router.get('/:id', getBookById);
router.delete('/:id', deleteBook);

module.exports = router;