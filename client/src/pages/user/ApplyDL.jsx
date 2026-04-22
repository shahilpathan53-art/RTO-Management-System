import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const ApplyDL = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [approvedLL, setApprovedLL] = useState(null);
  const [ageError, setAgeError] = useState(false);
  const [formData, setFormData] = useState({ vehicleType: '', testDate: '', address: user.address });

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        // Age check (18+)
        const profileRes = await api.get('/auth/me');
        const dob = profileRes.data?.dob;
        if (dob) {
          const age = Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
          if (age < 18) {
            setAgeError(true);
            setLoading(false);
            return;
          }
        }

        // Check for approved LL
        const { data } = await api.get('/ll/my');
        const approved = data.find(l => l.status === 'Approved');
        if (!approved) {
          toast.error('Approved Learning License required.');
          navigate('/user/dashboard');
        } else {
          setApprovedLL(approved);
          setFormData(prev => ({ ...prev, vehicleType: approved.vehicleType }));
        }
      } catch (err) {
        // If /auth/me fails, just check LL
        try {
          const { data } = await api.get('/ll/my');
          const approved = data.find(l => l.status === 'Approved');
          if (!approved) { toast.error('Approved Learning License required.'); navigate('/user/dashboard'); }
          else { setApprovedLL(approved); setFormData(prev => ({ ...prev, vehicleType: approved.vehicleType })); }
        } catch { toast.error('Verification failed'); navigate('/user/dashboard'); }
      } finally {
        setLoading(false);
      }
    };
    checkEligibility();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/dl/apply', formData);
      toast.success('DL Application submitted! An officer will schedule your exam date.');
      navigate('/user/payment', { state: { serviceType: 'DL', applicationId: data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner text="Checking DL eligibility..." /></div>;

  if (ageError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fade">
        <div className="card p-12">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🚫</div>
          <h2 className="text-3xl font-black text-red-600 mb-3">Not Eligible for DL</h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            You must be <span className="font-black text-gray-800">18 years or older</span> to apply for a Permanent Driving License as per Indian Motor Vehicles Act.
          </p>
          <button onClick={() => navigate('/user/dashboard')} className="btn-primary w-full py-4">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 animate-fade">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Permanent Driving License</h1>
        <p className="text-gray-500 font-medium mt-2">Convert your Learning License to a permanent one.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="card bg-teal-50 border-teal-100 p-8">
          <div className="w-12 h-12 bg-teal rounded-2xl flex items-center justify-center text-white text-xl mb-4 shadow-lg shadow-teal/20">✓</div>
          <h3 className="text-lg font-black text-teal-900 mb-2">Eligibility Status</h3>
          <p className="text-sm text-teal-800 leading-relaxed">
            Your approved Learning License for <span className="font-black underline">{approvedLL?.vehicleType}</span> has been verified.
          </p>
          <div className="mt-4 pt-4 border-t border-teal-200 text-xs text-teal-700 font-bold">
            ✅ Age: 18+ Verified<br />
            ✅ Approved LL: Found<br />
            📅 Exam date will be assigned by officer
          </div>
        </div>

        <div className="lg:col-span-2 card p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">License Category</label>
              <input type="text" readOnly className="input-field bg-gray-50 border-gray-100 font-bold text-gray-500" value={formData.vehicleType} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Preferred Physical Test Date</label>
              <input type="date" required className="input-field"
                min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                value={formData.testDate} onChange={e => setFormData({ ...formData, testDate: e.target.value })} />
              <p className="text-[10px] text-gray-400 mt-2 font-bold italic">
                * Actual exam date will be scheduled by the RTO officer. You will receive a notification.
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Verification Address</label>
              <textarea rows={3} className="input-field" value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full py-5 text-xl tracking-tight shadow-2xl">
              Confirm & Pay DL Fee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyDL;
