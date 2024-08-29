const client = require("../../db");
const queryes = require("./queries");

const getGenre = async (req, res) => {
  try {
    client.query(queryes.getGenre, (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
    });
  } catch (err) {
    console.log(err);
  }
};
//   client.query(queryes.getGenre, (err, result) => {
//     if (err) throw err;
//     res.status(200).json(result.rows);
//   });
// }


// const addGenre = async (req, res) => {
//   const { name } = req.body;
//   try {
//     client.query(
//       "INSERT INTO genre (name) VALUES ($1)",
//       [name],
//       function (err, result) {
//         if (err) throw err;
//         res.send(result);
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }

module.exports = {
  getGenre,
};
