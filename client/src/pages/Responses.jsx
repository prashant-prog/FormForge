import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Download, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Responses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        api.get(`/forms/${id}`),
        api.get(`/responses/${id}`)
      ]);
      setForm(formRes.data);
      setResponses(responsesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!form || responses.length === 0) return;

    // Headers
    const headers = ['Submission Date', ...form.fields.map(f => f.label)];
    
    // Rows
    const rows = responses.map(response => {
      const date = format(new Date(response.createdAt), 'yyyy-MM-dd HH:mm:ss');
      const row = [date];
      
      form.fields.forEach(field => {
        let answer = response.answers[field.id] || '';
        if (Array.isArray(answer)) {
          answer = answer.join(', ');
        }
        // Escape quotes and commas for CSV
        if (typeof answer === 'string' && (answer.includes(',') || answer.includes('"'))) {
          answer = `"${answer.replace(/"/g, '""')}"`;
        }
        row.push(answer);
      });
      
      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${form.formTitle.replace(/\s+/g, '_')}_Responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center mt-20">Loading responses...</div>;
  if (!form) return <div className="text-center mt-20">Form not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
        <Link to="/" className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{form.formTitle} Responses</h1>
          <p className="text-slate-500 mt-1">{responses.length} total submissions</p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={responses.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          No responses yet. Share your form link to start collecting data!
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm whitespace-nowrap hidden md:table-cell w-48">
                    Date Submitted
                  </th>
                  {form.fields.map(field => (
                    <th key={field.id} className="p-4 font-semibold text-slate-600 text-sm whitespace-nowrap min-w-[150px]">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {responses.map(response => (
                  <tr key={response._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-slate-500 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(response.createdAt), 'MMM d, yyyy HH:mm')}
                      </div>
                    </td>
                    {form.fields.map(field => {
                      let ans = response.answers[field.id];
                      if (Array.isArray(ans)) ans = ans.join(', ');
                      return (
                        <td key={field.id} className="p-4 text-sm text-slate-700 truncate max-w-[200px]" title={ans}>
                          {ans || '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Responses;
