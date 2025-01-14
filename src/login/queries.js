// const getGenre = "SELECT * FROM genre";

// const getGenres = "SELECT * FROM genre";

const getUserByEmail = "SELECT * FROM users WHERE email = $1";
const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
const checkUserExists = "SELECT * FROM users s WHERE email = $1";
// const deleteGenre = "DELETE FROM genre WHERE id = $1";
// const updateGenre = "UPDATE genre SET name = $1 WHERE id = $2 RETURNING *";

module.exports = {
  getUserByEmail,
  checkUserExists,
  addUser
};
