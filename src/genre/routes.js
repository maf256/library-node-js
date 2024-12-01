const { Router } = require('express');
const { getGenreById,
    getGenres,
    addGenre,
    deleteGenre,
    updateGenre} = require('./controller');
const { validateGenre, genreSchema } = require('./validation');

const router = Router(); 

router.get('/', getGenres);
router.post('/', validateGenre(genreSchema), addGenre);
router.get('/:id', getGenreById);
router.put('/:id', validateGenre(genreSchema), updateGenre);
router.delete('/:id', deleteGenre);
module.exports = router;