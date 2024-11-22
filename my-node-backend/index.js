const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
const routes = require('./routes/approutes'); // Import your routes

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
app.use(routes);

// Export as serverless function
module.exports = serverless(app);
