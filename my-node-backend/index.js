const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const routes = require('./routes/approutes');  // Make sure this path is correct

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://peaceful-torrone-3e65dc.netlify.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(routes);  // Use the routes you defined in approutes.js

// Export as a serverless function for Vercel
module.exports = serverless(app);
