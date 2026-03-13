const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // e.g. text, textarea, dropdown, checkbox, radio, email, number
  label: { type: String, required: true },
  placeholder: { type: String },
  options: [{ type: String }], // for dropdown, checkbox, radio
  required: { type: Boolean, default: false }
});

const formSchema = new mongoose.Schema({
  formTitle: {
    type: String,
    required: true,
  },
  fields: [fieldSchema],
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
