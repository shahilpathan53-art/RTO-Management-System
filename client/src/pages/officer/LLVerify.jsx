import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const LLVerify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const { data } = await api.get('/ll/all');
        const found = data.find(a => a._id === id);
        setApp(found);
      } catch (err) {
        toast.error('Application not found');
        navigate('/officer/ll-applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id, navigate]);

  const handleAction = async (status) => {
    try {
      await api.put(`/ll/approve/${id}`, { status });
      toast.success(`Application ${status} successfully`);
      navigate('/officer/ll-applications');
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner text="Loading digital records..." /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 animate-fade">
      <div className="flex items-center gap-4 mb-10">
         <button onClick={() => navigate(-1)} className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all font-black text-sm">← Back</button>
         <h1 className="text-3xl font-black text-gray-800">Verification Desk</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="card p-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Applicant Details</h3>
               <div className="space-y-4">
                  <div className="flex justify-between font-bold"><span>Full Name</span><span className="text-gray-800">{app.fullName}</span></div>
                  <div className="flex justify-between font-bold"><span>Aadhaar</span><span className="text-primary">{app.aadhaarNumber}</span></div>
                  <div className="flex justify-between font-bold"><span>Phone</span><span className="text-gray-800">{app.phone || 'N/A'}</span></div>
                  <div className="flex justify-between font-bold"><span>Vehicle Type</span><span className="text-primary">{app.vehicleType}</span></div>
               </div>
            </div>
            
            <div className="card p-8 bg-blue-50/50">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Aadhaar Mock Preview</h3>
               <div className="h-40 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-bold">
                  Document View restricted (Demo)
               </div>
            </div>
         </div>

         <div className="card p-10 flex flex-col justify-between">
            <div>
               <h3 className="text-xl font-black text-gray-800 mb-6">Decision Authority</h3>
               <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8">Please confirm that you have manually verified the physical documents with the data provided on screen.</p>
               
               <div className="p-6 bg-teal-50 rounded-3xl mb-8">
                  <p className="text-xs font-black text-teal-800 uppercase mb-1">Status</p>
                  <p className="text-lg font-black text-teal-900">Passed Online MCQ Test ({app.testScore}/15)</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => handleAction('Rejected')} className="btn-danger py-4 rounded-2xl shadow-lg shadow-red-100">Reject Application</button>
               <button onClick={() => handleAction('Approved')} className="btn-primary py-4 rounded-2xl shadow-lg shadow-blue-100">Approve & Issue</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LLVerify;
