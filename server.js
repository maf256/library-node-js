const express = require("express");
const Genre = require("./src/genre/routes");
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

app.use("/genre", Genre);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
