const { Router } = require("express");
const {

    getUserByEmail,
//   getGenres,
    addUser,
//   deleteGenre,
//   updateGenre,
} = require("./controller");
const { validateGenre, genreSchema } = require("./validation");

const router = Router();

// router.get("/", getGenres);
router.post("/", addUser);
router.get("/", getUserByEmail);
// router.put("/:id", validateGenre(genreSchema), updateGenre);
// router.delete("/:id", deleteGenre);
module.exports = router;
