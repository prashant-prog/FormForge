import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Users, Edit3, Trash2, ExternalLink, Copy, Plus } from 'lucide-react';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms');
      setForms(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await api.delete(`/forms/${id}`);
        fetchForms();
      } catch (err) {
        console.error('Error deleting form:', err);
      }
    }
  };

  const handleDuplicate = async (form) => {
    try {
      const { formTitle, fields } = form;
      await api.post('/forms', {
        formTitle: `${formTitle} (Copy)`,
        fields
      });
      fetchForms();
    } catch (err) {
      console.error('Error duplicating form:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Your Forms</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track all your form submissions</p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No forms created yet</h3>
          <p className="text-slate-500 mb-6">Create your first form to start collecting responses.</p>
          <Link
            to="/builder"
            className="inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg shadow-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Create New Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map(form => (
            <div key={form._id} className="glass-card p-5 flex flex-col hover:shadow-float transition-all duration-300 border border-slate-100 hover:border-primary-100 group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{form.formTitle}</h3>
                <div className="relative">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-slate-500 mb-4 gap-4">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  {form.fields.length} fields
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <Link to={`/responses/${form._id}`} className="hover:text-primary-600 hover:underline">
                    Responses
                  </Link>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex space-x-1">
                  <button
                    onClick={() => navigate(`/builder/${form._id}`)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors tooltip-trigger"
                    title="Edit form"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(form)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Duplicate form"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete form"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Link
                  to={`/form/${form._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                  target="_blank"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Form
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
