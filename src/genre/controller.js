const client = require("../../db");
const getGenre = async (req, res) => {
  try {
    client.query("SELECT * FROM genre", [], function (err, result) {
      if (err) throw err;
      res.send(result.rows);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getGenre,
};
