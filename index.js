const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Don't forget to import 'path' for handling static file directories.

// MongoDB URI (use environment variables for sensitive data)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://giftykerenhappuchcug22it:7DbjIs9c0WCoqGt8@lab.a5ahi.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

const app = express();

// Correct PORT definition
const PORT = process.env.PORT || 3000;

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from the "public" directory

// Use middleware to parse JSON and handle CORS
app.use(bodyParser.json());
app.use(cors());

// Define the registration schema and model
const registrationSchema = new mongoose.Schema({
  name: String,
  roll: String,
  email: String,
  phone: String,
});
const Registration = mongoose.model('Registration', registrationSchema);

// Define the lab selection schema and model
const labSelectionSchema = new mongoose.Schema({
  name: String,
  lab: String,
  department: String,
  success: Boolean,
});
const LabSelection = mongoose.model('LabSelection', labSelectionSchema);

// Initial lab seat counts
let seats = {
  'ideation-cse': 4,
  'ideation-aids': 4,
  'ideation-it': 4,
  'mobile-cse': 4,
  'mobile-aids': 4,
  'mobile-it': 4,
  'iot-cse': 4,
  'iot-aids': 4,
  'iot-it': 4,
};

// Endpoint to handle user registration
app.post('/register', async (req, res) => {
  const { name, roll, email, phone } = req.body;

  // Validate email
  if (!email.endsWith('@francisxavier.ac.in')) {
    return res.status(400).json({ message: 'Please use a valid francisxavier.ac.in email address.' });
  }

  try {
    const registration = new Registration({
      name,
      roll,
      email,
      phone,
    });

    await registration.save();
    return res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration.' });
  }
});

// Endpoint to handle lab seat selection
app.post('/select-lab', async (req, res) => {
  const { name, lab, department } = req.body;
  const key = `${lab}-${department}`;

  if (!seats[key]) {
    return res.status(404).json({ message: 'Lab or Department not found.' });
  }

  const labSelectionDetails = new LabSelection({
    name,
    lab,
    department,
    success: false,
  });

  if (seats[key] > 0) {
    seats[key]--;
    labSelectionDetails.success = true;

    try {
      await labSelectionDetails.save();
      return res.status(200).json({ message: `Successfully selected ${department.toUpperCase()} in ${lab.charAt(0).toUpperCase() + lab.slice(1)} Lab. Remaining seats: ${seats[key]}` });
    } catch (error) {
      console.error('Error saving lab selection:', error);
      return res.status(500).json({ message: 'Error saving lab selection.' });
    }
  } else {
    labSelectionDetails.success = false;
    await labSelectionDetails.save();
    return res.status(400).json({ message: `No seats available for ${department.toUpperCase()} in ${lab.charAt(0).toUpperCase() + lab.slice(1)} Lab.` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
