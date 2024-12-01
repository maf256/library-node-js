const fs = require("fs");
const pg = require("pg");
const url = require("url");

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.API_USER,
  host: process.env.API_HOST,
  database: "defaultdb",
  password: process.env.API_PASSWORD,
  port: 542802432,
});

module.exports = pool;


require("dotenv").config();
  const config = {
    user: process.env.API_USER,
    password: process.env.API_PASSWORD,
    host: process.env.API_HOST,
    port: 28024,
    database: "defaultdb",
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.API_SERTIFICATE,
    },
};

const client = new pg.Client(config);

client.connect(function (err) {
  try {
    client.query("SELECT VERSION()", [], function (err, result) {
    });
      
  }
  catch (err) {
    console.log(result.rows[0].version);

  }
});

module.exports = client;