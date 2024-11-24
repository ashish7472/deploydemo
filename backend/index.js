const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Adjust according to your frontend's URL


// Connect to the database
require('./config/db');

// User registration route
app.post('/signup', async (req, res) => {
  const { name, email, password, rollNo, department, graduationYear, interests } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
      graduationYear,
      interests: interests.split(',').map((interest) => interest.trim()),
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// User login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and user._id in the response
    res.json({ msg: 'Login successful', token, email, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get users with similar interests route
app.get('/getUsersWithSimilarInterests', async (req, res) => {
  const { email } = req.query;  // Change from userId to email

  try {
    // Find the current user by email
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find users with at least one matching interest
    const similarUsers = await User.find({
      _id: { $ne: currentUser._id }, // Exclude the current user
      interests: { $in: currentUser.interests }, // Match any shared interests
    }).select('-password'); // Exclude the password from the response

    if (similarUsers.length === 0) {
      return res.status(404).json({ msg: 'No users found with similar interests' });
    }

    res.json(similarUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});