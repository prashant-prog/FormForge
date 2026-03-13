require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const formRoutes = require('./routes/formRoutes');
const responseRoutes = require('./routes/responseRoutes');

const app = express();

const Form = require('./models/Form');

// Connect Database
connectDB().then(async () => {
  try {
    const count = await Form.countDocuments();
    if (count === 0) {
      console.log('Database empty. Seeding initial form...');
      const sampleForm = new Form({
        formTitle: 'Internship Application Form',
        fields: [
          { id: 'field-1', type: 'text', label: 'Full Name', placeholder: 'John Doe', required: true, options: [] },
          { id: 'field-2', type: 'email', label: 'Email Address', placeholder: 'john@example.com', required: true, options: [] },
          { id: 'field-3', type: 'dropdown', label: 'Role Applying For', required: true, options: ['Frontend Engineer', 'Backend Engineer', 'Full Stack MERN Engineer', 'UI/UX Designer'] },
          { id: 'field-4', type: 'radio', label: 'Years of Experience', required: false, options: ['0-1 years', '1-3 years', '3+ years'] },
          { id: 'field-5', type: 'checkbox', label: 'Skills', required: false, options: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'] },
          { id: 'field-6', type: 'textarea', label: 'Why do you want to join us?', placeholder: 'Tell us about your passion...', required: true, options: [] }
        ]
      });
      await sampleForm.save();
      console.log('Sample form seeded successfully! 🎉');
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err.message);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
