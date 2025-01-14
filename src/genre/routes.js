const { Router } = require("express");
const { authenticate } = require('../middleware');

const {
  getGenreById,
  getGenres,
  addGenre,
  deleteGenre,
  updateGenre,
} = require("./controller");
const { validateGenre, genreSchema } = require("./validation");

const router = Router();

router.get("/",authenticate, getGenres);
router.post("/",authenticate, validateGenre(genreSchema), addGenre);
router.get("/:id",authenticate, getGenreById);
router.put("/:id",authenticate, validateGenre(genreSchema), updateGenre);
router.delete("/:id",authenticate, deleteGenre);
module.exports = router;
