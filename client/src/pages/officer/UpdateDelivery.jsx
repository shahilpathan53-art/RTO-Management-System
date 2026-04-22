import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { DELIVERY_STAGES } from '../../utils/constants';

const UpdateDelivery = () => {
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

  const handleUpdate = async (stage) => {
    try {
      await api.put(`/ll/delivery/${id}`, { deliveryStatus: stage });
      toast.success(`Logistics stage updated to ${stage}`);
      setApp({ ...app, deliveryStatus: stage });
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner text="Loading logistics desk..." /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 animate-fade">
      <div className="card p-12 text-center">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Update Delivery Stage</h1>
        <p className="text-gray-500 font-medium mb-12">Current Status: <span className="text-primary font-black underline">{app.deliveryStatus}</span></p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
           {DELIVERY_STAGES.map((stage) => (
             <button
               key={stage}
               onClick={() => handleUpdate(stage)}
               disabled={app.deliveryStatus === stage}
               className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${app.deliveryStatus === stage ? 'bg-gray-100 text-gray-400 border-gray-100' : 'border-primary text-primary hover:bg-primary hover:text-white shadow-xl shadow-blue-50/50'}`}
             >
               Set as {stage}
             </button>
           ))}
        </div>

        <button onClick={() => navigate(-1)} className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">Done Updating Logistics</button>
      </div>
    </div>
  );
};

export default UpdateDelivery;
