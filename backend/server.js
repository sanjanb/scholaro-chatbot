const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-eligibility-db';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const chatbotRoutes = require('./routes/chatbot');
const collegeRoutes = require('./routes/colleges');
const scholarshipRoutes = require('./routes/scholarships');

// Use routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/scholarships', scholarshipRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Eligibility Chatbot API',
    version: '1.0.0',
    endpoints: {
      chatbot: '/api/chatbot',
      colleges: '/api/colleges',
      scholarships: '/api/scholarships'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the API`);
});

module.exports = app;