const Form = require('../models/Form');

// @route   POST /api/forms
// @desc    Create a new form
exports.createForm = async (req, res) => {
  try {
    const { formTitle, fields } = req.body;
    const newForm = new Form({ formTitle, fields });
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   GET /api/forms
// @desc    Get all forms
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   GET /api/forms/:id
// @desc    Get single form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   PUT /api/forms/:id
// @desc    Update form
exports.updateForm = async (req, res) => {
  try {
    const { formTitle, fields } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { formTitle, fields },
      { new: true, runValidators: true }
    );
    if (!updatedForm) return res.status(404).json({ error: 'Form not found' });
    res.status(200).json(updatedForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   DELETE /api/forms/:id
// @desc    Delete form
exports.deleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ error: 'Form not found' });
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
