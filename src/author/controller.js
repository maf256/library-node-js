const client = require("../../db");
const queryes = require("./queries");

const getAuthors = async (req, res) => {
  try {
    client.query(queryes.getAuthors, (err, result) => {
      if (err) throw err;
      res.status(200).json(result.rows);
    });
  } catch (err) {
    console.log(err);
  }
};


module.exports = {
  getAuthors,
  };
  