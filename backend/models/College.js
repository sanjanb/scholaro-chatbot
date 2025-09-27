const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: String
  },
  type: {
    type: String,
    enum: ['Government', 'Private', 'Deemed', 'Central'],
    required: true
  },
  courses: [{
    name: String,
    stream: {
      type: String,
      enum: ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Law', 'Management', 'Others']
    },
    eligibilityPercentage: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number
    },
    fees: {
      tuition: Number,
      hostel: Number,
      other: Number
    },
    duration: String,
    seats: Number
  }],
  eligibilityCriteria: {
    minimumPercentage: {
      general: {
        type: Number,
        default: 50
      },
      obc: {
        type: Number,
        default: 45
      },
      sc: {
        type: Number,
        default: 40
      },
      st: {
        type: Number,
        default: 40
      }
    },
    entranceExam: String,
    ageLimit: Number,
    stream: [String]
  },
  contactInfo: {
    website: String,
    phone: String,
    email: String,
    address: String
  },
  ranking: {
    nirf: Number,
    other: String
  },
  accreditation: String,
  established: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster searches
collegeSchema.index({ 'location.state': 1, 'location.city': 1 });
collegeSchema.index({ 'courses.stream': 1 });
collegeSchema.index({ type: 1 });

module.exports = mongoose.model('College', collegeSchema);