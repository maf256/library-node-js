const { Router } = require('express');
const {getAuthorById,
    getAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor} = require('./controller');
const { validateAuthor, authorSchema } = require('./validation');


const router = Router(); 

router.get('/', getAuthors);
router.post('/', validateAuthor(authorSchema), addAuthor);
router.put('/:id', validateAuthor(authorSchema), updateAuthor);
router.get('/:id', getAuthorById);
router.delete('/:id', deleteAuthor);

module.exports = router;
