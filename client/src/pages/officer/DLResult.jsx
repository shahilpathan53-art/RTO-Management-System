import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const DLResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ testResult: 'Pass', notes: '' });

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const { data } = await api.get('/dl/all');
        const found = data.find(a => a._id === id);
        setApp(found);
      } catch (err) {
        toast.error('Application not found');
        navigate('/officer/dl-applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/dl/result/${id}`, formData);
      toast.success('Test result recorded. Process complete.');
      navigate('/officer/dl-applications');
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner text="Loading test file..." /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 animate-fade">
      <div className="card p-12">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Record Test Findings</h1>
        <p className="text-gray-500 font-medium mb-12">Applicant: <span className="text-primary font-black uppercase underline">{app.fullName}</span></p>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Driving Ability Assessment</label>
              <div className="grid grid-cols-2 gap-4">
                 {['Pass', 'Fail'].map((r) => (
                   <button 
                     type="button" 
                     key={r} 
                     onClick={() => setFormData({ ...formData, testResult: r })} 
                     className={`py-5 rounded-2xl font-black text-lg border-4 transition-all ${formData.testResult === r ? 'bg-primary text-white border-primary shadow-2xl' : 'bg-white text-gray-400 border-gray-50 hover:border-gray-100'}`}
                   >
                     {r === 'Pass' ? '✅ Pass' : '❌ Fail'}
                   </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Field Officer's Detailed Notes</label>
              <textarea 
                rows={4} 
                required 
                placeholder="Describe driving proficiency, road sign awareness, etc." 
                className="input-field resize-none" 
                value={formData.notes} 
                onChange={e => setFormData({ ...formData, notes: e.target.value })} 
              />
           </div>

           <button type="submit" className="btn-primary w-full py-5 text-xl tracking-tight shadow-xl shadow-blue-100">Finalize & Record Result</button>
        </form>
      </div>
    </div>
  );
};

export default DLResult;
