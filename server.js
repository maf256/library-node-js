const express = require("express");
const https = require("https");
const fs = require("fs");
const Genre = require("./src/genre/routes");
const Book = require("./src/book/routes");
const Authors = require("./src/author/routes");
const cors = require("cors");

const app = express();
const port = 443;  // HTTPS typically uses port 443
require("dotenv").config();

// SSL options - replace with the paths to your actual SSL key and certificate
const options = {
  key: fs.readFileSync("/path/to/private-key.pem"),
  cert: fs.readFileSync("/path/to/certificate.pem")
};

// Middleware
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

// Start HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`Example app listening on https://localhost:${port}`);
});
