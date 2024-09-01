const { Router } = require('express');
const controller = require('./controller');

const router = Router(); 

router.get('/', controller.getGenres);
router.post('/', controller.addGenre);
router.get('/:id', controller.getGenreById);
router.delete('/:id', controller.deleteGenre);
module.exports = router;