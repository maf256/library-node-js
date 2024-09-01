const express = require("express");
const Genre = require("./src/genre/routes");
const Book = require("./src/book/routes");
const Authors = require("./src/author/routes");

const app = express();
const port = 3000;
require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Hello World!22222222222",
  });
});
//_________________Genre_____________________________

app.use("/genre", Genre);

//_________________Book_________________
app.use("/book", Book);

//_________________Author_________________
app.use("/author", Authors);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
