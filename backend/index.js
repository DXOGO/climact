const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
  
// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Import Thredds route
const threddsRoute = require('./routes/thredds');

// Routes
app.use('/api', threddsRoute);


// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the ClimACT backend service!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});