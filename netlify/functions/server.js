const express = require('express');
const serverless = require('serverless-http');
const app = express();

// Your routes here
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the serverless function!' });
});

// Export the app as a serverless function
module.exports.handler = serverless(app);
