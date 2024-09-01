const client = require("../../db");
const queryes = require("./queries");

const getGenres = async (req, res) => {
  try {
    const result = await client.query(queryes.getGenres);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.log('Error fetching Genres:',err);
    return res.status(500).json({ error: "An error occurred while fetching Genres" });
  }
};


const getGenreById = async (req, res) => {
  try {
    // Execute the query using await
    const result = await client.query(queryes.getGenreById, [req.params.id]);

    // Check if the Genre exists
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Genre not found" });
    }

    // Respond with the Genre details
    return res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Error fetching Genre:', err);

    // Respond with a generic error message
    return res.status(500).json({ error: "An error occurred while fetching the Genre" });
  }
};



const addGenre = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the Genre already exists
    const GenreExistsResult = await client.query(queryes.checkGenreExists, [name]);

    if (GenreExistsResult.rowCount > 0) {
      return res.status(400).json({ error: "Genre already exists" });
    }

    // Add the new Genre
    const addGenreResult = await client.query(queryes.addGenre, [name]);

    // Respond with the newly added Genre's details
    return res.status(201).json({ message: "Genre added successfully", Genre: addGenreResult.rows[0] });

  } catch (err) {
    console.error('Error adding Genre:', err);

    // Respond with a generic error message
    return res.status(500).json({ error: "An error occurred while adding the Genre" });
  }
};


const deleteGenre = async (req, res) => {
  try {
    // Check if the Genre exists
    const GenreResult = await client.query(queryes.getGenreById, [req.params.id]);

    if (GenreResult.rowCount === 0) {
      return res.status(404).json({ error: "Genre not found"});
    }

    // Delete the Genre
    await client.query(queryes.deleteGenre, [req.params.id]);

    // Respond with success
    return res.status(200).json({ message: "Genre deleted successfully" });

  } catch (err) {
    console.error('Error deleting Genre:', err);

    // Handle specific errors if necessary, otherwise send a generic error response
    return res.status(500).json({ error: "An error occurred while deleting the Genre", message: err.message });
  }
};

const updateGenre = async (req, res) => {
  const { name } = req.body;
  try {
    // Check if the Genre exists
    const GenreResult = await client.query(queryes.getGenreById, [req.params.id]);
    if (GenreResult.rowCount === 0) {
      return res.status(404).json({ error: "Genre not found" });
    }
    // Update the Genre
    await client.query(queryes.updateGenre, [name, req.params.id]);
    // Respond with success message
    return res.status(200).json({ message: "Genre updated successfully" });
  } catch (err) {
    console.error('Error updating Genre:', err);
    // Handle specific errors if necessary, otherwise send a generic error response
    return res.status(500).json({ error: "An error occurred while updating the Genre", message: err.message });
  }
}
module.exports = {
  getGenres,
  getGenreById,
  addGenre,
  deleteGenre,
  updateGenre
};
  