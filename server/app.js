const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Required for handling static files

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://giftykerenhappuchcug22it:7DbjIs9c0WCoqGt8@lab.a5ahi.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Serve static HTML files from the "client" folder
app.use(express.static(path.join(__dirname, '../client')));

// Route for user registration
app.post('/register', async (req, res) => {
  try {
    const { name, roll, email, phone } = req.body;
    // Store this data to MongoDB or any data processing
    console.log(name, roll, email, phone);
    res.status(200).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

// Route for lab selection
app.post('/select-lab', async (req, res) => {
  try {
    const { lab, department } = req.body;
    // Mock example of response
    const remainingSeats = 4; // Example: subtract from MongoDB or any data source
    res.status(200).json({ remainingSeats, message: `You successfully selected ${lab} lab under ${department} department!` });
  } catch (err) {
    console.error('Lab selection error:', err);
    res.status(500).json({ message: 'An error occurred while selecting lab.' });
  }
});

// Default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
