const express = require("express");
const Genre = require("./src/genre/routes");
const Book = require("./src/book/routes");
const Authors = require("./src/author/routes");
const Login = require("./src/login/routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Route setup
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

//_________________Author_________________
app.use("/login", Login);

// Start server (Render handles HTTPS)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
