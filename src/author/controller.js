const client = require("../../db");
const queryes = require("./queries");

const getAuthors = async (req, res) => {
  try {
    const result = await client.query(queryes.getAuthors);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching authors:", err.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching authors" });
  }
};

const getAuthorById = async (req, res) => {
  try {
    // Execute the query using await
    const result = await client.query(queryes.getAuthorById, [req.params.id]);

    // Check if the author exists
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Respond with the author details
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching author:", err);

    // Respond with a generic error message
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the author" });
  }
};

const addAuthor = async (req, res) => {
  const { name, biography, birthday } = req.body;

  if (!name || !biography || !birthday) {
    return res
      .status(400)
      .json({ error: "All fields (name, biography, birthday) are required" });
  }

  try {
    const authorExistsResult = await client.query(queryes.checkAuthorExists, [
      name,
    ]);
    if (authorExistsResult.rowCount > 0) {
      return res.status(409).json({ error: "Author already exists" });
    }

    const addAuthorResult = await client.query(queryes.addAuthor, [
      name,
      biography,
      birthday,
    ]);
    return res
      .status(201)
      .json({
        message: "Author added successfully",
        author: addAuthorResult.rows[0],
      });
  } catch (err) {
    console.error("Error adding author:", err.message);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Duplicate author detected" });
    }
    return res
      .status(500)
      .json({ error: "An error occurred while adding the author" });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    // Check if the author exists
    const authorResult = await client.query(queryes.getAuthorById, [
      req.params.id,
    ]);

    if (authorResult.rowCount === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Delete the author
    await client.query(queryes.deleteAuthor, [req.params.id]);

    // Respond with success
    return res.status(200).json({ message: "Author deleted successfully" });
  } catch (err) {
    console.error(
      `Error deleting author with id ${req.params.id}:`,
      err.message
    );

    // Handle specific errors if necessary, otherwise send a generic error response
    return res
      .status(500)
      .json({
        error: "An error occurred while deleting the author",
        message: err.message,
      });
  }
};

const updateAuthor = async (req, res) => {
  const { name, biography, birthday } = req.body;

  try {
    // Check if the author exists
    const authorResult = await client.query(queryes.getAuthorById, [
      req.params.id,
    ]);
    if (authorResult.rowCount === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Update the author
    await client.query(queryes.updateAuthor, [
      name,
      biography,
      birthday,
      req.params.id,
    ]);

    // Respond with success message
    return res.status(200).json({ message: "Author updated successfully" });
  } catch (err) {
    console.error("Error updating author:", err);

    // Handle specific errors if necessary, otherwise send a generic error response
    return res
      .status(500)
      .json({
        error: "An error occurred while updating the author",
        message: err.message,
      });
  }
};
module.exports = {
  getAuthors,
  getAuthorById,
  addAuthor,
  deleteAuthor,
  updateAuthor,
};
