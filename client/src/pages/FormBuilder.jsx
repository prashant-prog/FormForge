import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api';
import { 
  Type, AlignLeft, List, CheckSquare, Settings, 
  Trash2, Plus, Save, GripVertical, ChevronDown, ChevronUp 
} from 'lucide-react';

const FIELD_TYPES = [
  { id: 'text', label: 'Short Text', icon: <Type className="w-4 h-4" /> },
  { id: 'textarea', label: 'Long Text', icon: <AlignLeft className="w-4 h-4" /> },
  { id: 'email', label: 'Email', icon: <Type className="w-4 h-4" /> },
  { id: 'number', label: 'Number', icon: <Settings className="w-4 h-4" /> }, // Hash icon alternative
  { id: 'dropdown', label: 'Dropdown', icon: <List className="w-4 h-4" /> },
  { id: 'checkbox', label: 'Checkboxes', icon: <CheckSquare className="w-4 h-4" /> },
  { id: 'radio', label: 'Radio Buttons', icon: <List className="w-4 h-4" /> } // Circle alternate
];

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [fields, setFields] = useState([]);
  const [activeFieldId, setActiveFieldId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchForm();
    } else {
      // Add one default field if new
      addField('text');
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/forms/${id}`);
      setFormTitle(res.data.formTitle);
      setFields(res.data.fields);
    } catch (err) {
      console.error('Error fetching form:', err);
    } finally {
      setLoading(false);
    }
  };

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: 'New Question',
      placeholder: '',
      required: false,
      options: ['Option 1'] // Default option for types that need it
    };
    setFields([...fields, newField]);
    setActiveFieldId(newField.id);
  };

  const updateField = (fieldId, updates) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  const removeField = (fieldId) => {
    setFields(fields.filter(f => f.id !== fieldId));
    if (activeFieldId === fieldId) setActiveFieldId(null);
  };

  const moveField = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === fields.length - 1)) return;
    const newFields = [...fields];
    const temp = newFields[index];
    newFields[index] = newFields[index + direction];
    newFields[index + direction] = temp;
    setFields(newFields);
  };

  const addOption = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    updateField(fieldId, { options: [...field.options, `Option ${field.options.length + 1}`] });
  };

  const updateOption = (fieldId, index, value) => {
    const field = fields.find(f => f.id === fieldId);
    const newOptions = [...field.options];
    newOptions[index] = value;
    updateField(fieldId, { options: newOptions });
  };

  const removeOption = (fieldId, index) => {
    const field = fields.find(f => f.id === fieldId);
    const newOptions = field.options.filter((_, i) => i !== index);
    updateField(fieldId, { options: newOptions });
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      alert('Please enter a form title');
      return;
    }
    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    try {
      setLoading(true);
      const payload = { formTitle, fields };
      if (id) {
        await api.put(`/forms/${id}`, payload);
      } else {
        await api.post('/forms', payload);
      }
      navigate('/');
    } catch (err) {
      console.error('Error saving form:', err);
      alert('Failed to save form');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !fields.length) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto pb-20">
      
      {/* Editor Area */}
      <div className="flex-1 space-y-6">
        <div className="glass-card p-6 border-t-8 border-primary-500">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-slate-200 focus:border-primary-500 focus:outline-none w-full transition-colors pb-2"
            placeholder="Form Title"
          />
          <p className="text-sm text-slate-500 mt-2">Any changes you make are autosaved locally until you submit.</p>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className={`glass-card p-6 transition-all duration-200 relative ${activeFieldId === field.id ? 'ring-2 ring-primary-500 shadow-md' : 'hover:shadow-md border border-slate-200'}`}
              onClick={() => setActiveFieldId(field.id)}
            >
              {/* Drag Handle & Controls */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-slate-50 rounded-l-xl cursor-move group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); moveField(index, -1); }} className="p-1 text-slate-400 hover:text-slate-800"><ChevronUp className="w-4 h-4" /></button>
                <GripVertical className="w-4 h-4 text-slate-400 my-1" />
                <button onClick={(e) => { e.stopPropagation(); moveField(index, 1); }} className="p-1 text-slate-400 hover:text-slate-800"><ChevronDown className="w-4 h-4" /></button>
              </div>

              <div className="pl-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="text-lg font-medium bg-transparent border-b border-slate-200 focus:border-primary-500 focus:outline-none w-full pb-1"
                      placeholder="Question Title"
                    />
                  </div>
                  <div className="w-48">
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      {FIELD_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field Specific Options */}
                <div className="mt-4">
                  {['text', 'textarea', 'email', 'number'].includes(field.type) && (
                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      className="input-field text-sm bg-slate-50"
                      placeholder="Placeholder text (optional)"
                    />
                  )}

                  {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
                    <div className="space-y-2 mt-4">
                      {field.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          {field.type === 'radio' && <div className="w-4 h-4 rounded-full border border-slate-300"></div>}
                          {field.type === 'checkbox' && <div className="w-4 h-4 rounded border border-slate-300"></div>}
                          {field.type === 'dropdown' && <span className="text-slate-400 text-sm">{optIndex + 1}.</span>}
                          
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(field.id, optIndex, e.target.value)}
                            className="flex-1 bg-transparent border-b border-slate-200 focus:border-primary-500 focus:outline-none text-sm py-1"
                          />
                          <button
                            onClick={() => removeOption(field.id, optIndex)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(field.id)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mt-2"
                      >
                        <Plus className="w-4 h-4" /> Add Option
                      </button>
                    </div>
                  )}
                </div>

                {/* Field Footer & Actions */}
                {activeFieldId === field.id && (
                  <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      Required
                    </label>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      title="Delete Question"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {fields.length === 0 && (
          <div className="text-center p-12 glass-card border-dashed border-2 border-slate-200">
            <p className="text-slate-500">Your form has no fields yet.</p>
            <p className="text-sm text-slate-400 mt-1">Use the sidebar to add some questions.</p>
          </div>
        )}
      </div>

      {/* Floating Toolbar / Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Add Fields</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {FIELD_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => addField(type.id)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors border border-transparent hover:border-primary-100"
                >
                  <span className="text-slate-400">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md transition-colors font-medium disabled:opacity-50"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save className="w-5 h-5" />}
            Save Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
