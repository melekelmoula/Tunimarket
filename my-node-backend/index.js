const express = require('express');
const cors = require('cors');
const routes = require('./routes/approutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS setup
const allowedOrigins = [
  'http://localhost:3000', 
  'https://tunimarket.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
