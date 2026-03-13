const Response = require('../models/Response');
const Form = require('../models/Form');

// @route   POST /api/responses
// @desc    Submit a form response
exports.submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;
    
    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const newResponse = new Response({ formId, answers });
    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   GET /api/responses/:formId
// @desc    Get all responses for a specific form
exports.getResponses = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId }).sort({ createdAt: -1 });
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
