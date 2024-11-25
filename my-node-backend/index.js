const express = require('express');
const cors = require('cors');
const routes = require('./routes/approutes');  // Import the routes file

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS setup
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://tunimarket.vercel.app' // Production
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  //credentials: true, // If using cookies or auth headers
  optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json()); // Middleware to parse JSON request bodies

// Use the routes defined in approutes.js
app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
