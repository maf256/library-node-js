const client = require("../../db");
const queryes = require("./queries");

const getBooks = async (req, res) => {
  try {
    client.query(queryes.getBooks, (err, result) => {
      if (err) throw err;
      res.status(200).json(result.rows);
    });
  } catch (err) {
    console.log(err);
  }
};


module.exports = {
   getBooks,
};
  