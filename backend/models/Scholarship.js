const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    required: true,
    enum: ['Government', 'Private', 'NGO', 'Corporate', 'Educational Institution', 'International']
  },
  type: {
    type: String,
    required: true,
    enum: ['Merit-based', 'Need-based', 'Category-based', 'Sports', 'Arts', 'Research', 'Others']
  },
  amount: {
    value: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    type: {
      type: String,
      enum: ['One-time', 'Annual', 'Monthly', 'Full-tuition', 'Partial-tuition'],
      default: 'Annual'
    }
  },
  eligibilityCriteria: {
    academicPercentage: {
      minimum: {
        type: Number,
        required: true
      },
      maximum: {
        type: Number,
        default: 100
      }
    },
    category: [{
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'Disabled', 'Girl Child', 'All']
    }],
    familyIncome: {
      maximum: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    stream: [{
      type: String,
      enum: ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Law', 'Management', 'Others', 'All']
    }],
    educationLevel: [{
      type: String,
      enum: ['10th', '12th', 'Undergraduate', 'Postgraduate', 'Doctorate', 'Diploma', 'All']
    }],
    state: [String], // Empty array means all states
    age: {
      minimum: Number,
      maximum: Number
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'All'],
      default: 'All'
    }
  },
  applicationDetails: {
    startDate: Date,
    endDate: Date,
    applicationMode: {
      type: String,
      enum: ['Online', 'Offline', 'Both'],
      default: 'Online'
    },
    website: String,
    documentsRequired: [String],
    selectionProcess: String
  },
  benefits: {
    description: String,
    additionalBenefits: [String] // Like hostel, books, laptop, etc.
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster searches
scholarshipSchema.index({ 'eligibilityCriteria.academicPercentage.minimum': 1 });
scholarshipSchema.index({ 'eligibilityCriteria.category': 1 });
scholarshipSchema.index({ 'eligibilityCriteria.stream': 1 });
scholarshipSchema.index({ provider: 1 });
scholarshipSchema.index({ type: 1 });
scholarshipSchema.index({ isActive: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);