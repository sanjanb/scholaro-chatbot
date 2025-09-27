const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');

// Get all scholarships
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, provider, type, category, stream } = req.query;
    const query = { isActive: true };

    if (provider) query.provider = provider;
    if (type) query.type = type;
    if (category) query['eligibilityCriteria.category'] = { $in: [category, 'All'] };
    if (stream) query['eligibilityCriteria.stream'] = { $in: [stream, 'All'] };

    const scholarships = await Scholarship.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'amount.value': -1 });

    const total = await Scholarship.countDocuments(query);

    res.json({
      success: true,
      data: scholarships,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not fetch scholarships'
    });
  }
});

// Get scholarship by ID
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    
    if (!scholarship) {
      return res.status(404).json({
        error: 'Scholarship not found',
        message: 'The requested scholarship does not exist'
      });
    }

    res.json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    console.error('Error fetching scholarship:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not fetch scholarship details'
    });
  }
});

// Search scholarships by eligibility
router.post('/search', async (req, res) => {
  try {
    const { 
      percentage, 
      stream, 
      category = 'General', 
      educationLevel = '12th',
      familyIncome,
      age,
      gender = 'All',
      state
    } = req.body;

    if (!percentage) {
      return res.status(400).json({
        error: 'Percentage is required',
        message: 'Please provide academic percentage'
      });
    }

    const query = {
      isActive: true,
      'eligibilityCriteria.academicPercentage.minimum': { $lte: percentage }
    };

    // Category filter
    if (category !== 'General') {
      query['eligibilityCriteria.category'] = { $in: [category, 'All'] };
    }

    // Stream filter
    if (stream) {
      query['eligibilityCriteria.stream'] = { $in: [stream, 'All'] };
    }

    // Education level filter
    query['eligibilityCriteria.educationLevel'] = { $in: [educationLevel, 'All'] };

    // Family income filter
    if (familyIncome) {
      query.$or = [
        { 'eligibilityCriteria.familyIncome.maximum': { $gte: familyIncome } },
        { 'eligibilityCriteria.familyIncome.maximum': { $exists: false } }
      ];
    }

    // Age filter
    if (age) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { 'eligibilityCriteria.age.minimum': { $lte: age } },
          { 'eligibilityCriteria.age.minimum': { $exists: false } }
        ]
      });
      query.$and.push({
        $or: [
          { 'eligibilityCriteria.age.maximum': { $gte: age } },
          { 'eligibilityCriteria.age.maximum': { $exists: false } }
        ]
      });
    }

    // Gender filter
    query['eligibilityCriteria.gender'] = { $in: [gender, 'All'] };

    // State filter
    if (state) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'eligibilityCriteria.state': { $in: [state] } },
        { 'eligibilityCriteria.state': { $size: 0 } }
      );
    }

    const scholarships = await Scholarship.find(query)
      .select('name provider type amount eligibilityCriteria applicationDetails benefits')
      .limit(30)
      .sort({ 'amount.value': -1 });

    res.json({
      success: true,
      data: scholarships,
      total: scholarships.length
    });
  } catch (error) {
    console.error('Error searching scholarships:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not search scholarships'
    });
  }
});

module.exports = router;