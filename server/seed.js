const mongoose = require('mongoose');
require('dotenv').config();
const Form = require('./models/Form');

const seedForm = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing
    await Form.deleteMany({});
    
    // Create example form
    const sampleForm = new Form({
      formTitle: 'Internship Application Form',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Full Name',
          placeholder: 'John Doe',
          required: true,
          options: []
        },
        {
          id: 'field-2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'john@example.com',
          required: true,
          options: []
        },
        {
          id: 'field-3',
          type: 'dropdown',
          label: 'Role Applying For',
          required: true,
          options: ['Frontend Engineer', 'Backend Engineer', 'Full Stack MERN Engineer', 'UI/UX Designer']
        },
        {
          id: 'field-4',
          type: 'radio',
          label: 'Years of Experience',
          required: false,
          options: ['0-1 years', '1-3 years', '3+ years']
        },
        {
          id: 'field-5',
          type: 'checkbox',
          label: 'Skills',
          required: false,
          options: ['React', 'Node.js', 'MongoDB', 'TailwindCSS']
        },
        {
          id: 'field-6',
          type: 'textarea',
          label: 'Why do you want to join us?',
          placeholder: 'Tell us about your passion...',
          required: true,
          options: []
        }
      ]
    });

    await sampleForm.save();
    console.log('Sample form seeded successfully! 🎉');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedForm();
