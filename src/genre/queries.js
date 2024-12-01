const getGenre = "SELECT * FROM genre";

const getGenres = "SELECT * FROM genre";

const getGenreById = "SELECT * FROM genre WHERE id = $1";
const addGenre = "INSERT INTO genre (name) VALUES ($1) RETURNING *";
const checkGenreExists = "SELECT s FROM genre s WHERE s.name = $1";
const deleteGenre = "DELETE FROM genre WHERE id = $1";
const updateGenre = "UPDATE genre SET name = $1 WHERE id = $2 RETURNING *";

module.exports = {
  getGenres,
  getGenreById,
  getGenre,
  addGenre,
  checkGenreExists,
  deleteGenre,
  updateGenre,
};
