const getAuthors = "SELECT * FROM author";

const getAuthorById = "SELECT * FROM author WHERE id = $1";
const addAuthor = "INSERT INTO author (name, biography, birthday) VALUES ($1, $2, $3) RETURNING *";
const checkAuthorExists = "SELECT s FROM author s WHERE s.name = $1";
const deleteAuthor = "DELETE FROM author WHERE id = $1";
const updateAuthor = "UPDATE author SET name = $1, biography = $2, birthday = $3 WHERE id = $4 RETURNING *";

module.exports = {
    getAuthors,
    getAuthorById,
    addAuthor,
    checkAuthorExists,
    deleteAuthor,
    updateAuthor
}