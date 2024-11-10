const { Router } = require('express');
const controller = require('./controller');

const router = Router(); 

router.get('/', controller.getAllBooks);
router.post('/', controller.addBookWithAuthorsAndGenres);
router.get('/:id', controller.getBookById);
router.put('/:id', controller.updateBookWithAuthorsAndGenres);
router.delete('/:id', controller.deleteBook);
module.exports = router;