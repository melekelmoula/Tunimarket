// my-node-backend/index.js

const express = require('express');
const cors = require('cors');
const routes = require('./routes/approutes');  // Import the routes file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'https://peaceful-torrone-3e65dc.netlify.app/', optionsSuccessStatus: 200 })); // CORS setup to allow cross-origin requests from the frontend
app.use(express.json()); // Middleware to parse JSON request bodies

// Use the routes defined in approutes.js
app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on https://tunimarket.onrender.com`);
});
