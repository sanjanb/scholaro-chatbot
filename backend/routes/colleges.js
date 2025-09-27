const express = require('express');
const router = express.Router();
const College = require('../models/College');

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, state, stream, type } = req.query;
    const query = {};

    if (state) query['location.state'] = new RegExp(state, 'i');
    if (stream) query['courses.stream'] = stream;
    if (type) query.type = type;

    const colleges = await College.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'ranking.nirf': 1 });

    const total = await College.countDocuments(query);

    res.json({
      success: true,
      data: colleges,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not fetch colleges'
    });
  }
});

// Get college by ID
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({
        error: 'College not found',
        message: 'The requested college does not exist'
      });
    }

    res.json({
      success: true,
      data: college
    });
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not fetch college details'
    });
  }
});

// Search colleges by eligibility
router.post('/search', async (req, res) => {
  try {
    const { percentage, stream, category = 'General', state } = req.body;

    if (!percentage) {
      return res.status(400).json({
        error: 'Percentage is required',
        message: 'Please provide academic percentage'
      });
    }

    const query = {};
    const categoryField = `eligibilityCriteria.minimumPercentage.${category.toLowerCase()}`;
    query[categoryField] = { $lte: percentage };

    if (stream) query['courses.stream'] = stream;
    if (state) query['location.state'] = new RegExp(state, 'i');

    const colleges = await College.find(query)
      .select('name location type courses eligibilityCriteria contactInfo ranking')
      .limit(50)
      .sort({ 'ranking.nirf': 1 });

    res.json({
      success: true,
      data: colleges,
      total: colleges.length
    });
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Could not search colleges'
    });
  }
});

module.exports = router;