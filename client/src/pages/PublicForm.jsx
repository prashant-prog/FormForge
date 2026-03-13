import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2 } from 'lucide-react';

const PublicForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${id}`);
      setForm(res.data);
      // Initialize answers object
      const initialAnswers = {};
      res.data.fields.forEach(field => {
        if (field.type === 'checkbox') {
          initialAnswers[field.id] = [];
        } else {
          initialAnswers[field.id] = '';
        }
      });
      setAnswers(initialAnswers);
    } catch (err) {
      console.error('Error fetching form:', err);
      setError('Form not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setAnswers(prev => {
      const current = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...current, option] };
      } else {
        return { ...prev, [fieldId]: current.filter(item => item !== option) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    for (const field of form.fields) {
      if (field.required) {
        const val = answers[field.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          alert(`Please fill in required field: ${field.label}`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      await api.post('/responses', {
        formId: id,
        answers
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading form...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 glass-card text-center border-t-8 border-green-500">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h1>
        <p className="text-slate-600 mb-8">Your response has been successfully recorded.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setAnswers({}); // Reset, though usually you just leave them at the thank you page
          }}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="glass-card mb-6 p-8 border-t-8 border-primary-500 shadow-float">
        <h1 className="text-3xl font-bold text-slate-800">{form.formTitle}</h1>
        <p className="text-slate-500 mt-2">Please fill out the details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id} className="glass-card p-6 border border-slate-200">
            <label className="block text-base font-medium text-slate-800 mb-4">
              {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                value={answers[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="input-field"
                required={field.required}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={answers[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="input-field min-h-[100px]"
                required={field.required}
              />
            )}

            {field.type === 'email' && (
              <input
                type="email"
                value={answers[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="input-field"
                required={field.required}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={answers[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="input-field"
                required={field.required}
              />
            )}

            {field.type === 'dropdown' && (
              <select
                value={answers[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="input-field bg-white"
                required={field.required}
              >
                <option value="" disabled>Select an option</option>
                {field.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.type === 'radio' && (
              <div className="space-y-3 mt-2">
                {field.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name={`field_${field.id}`}
                      value={opt}
                      checked={answers[field.id] === opt}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-4 h-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                      required={field.required}
                    />
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === 'checkbox' && (
              <div className="space-y-3 mt-2">
                {field.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={(answers[field.id] || []).includes(opt)}
                      onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicForm;
