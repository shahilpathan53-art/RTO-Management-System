import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import { BLOOD_GROUPS, VEHICLE_TYPES } from '../../utils/constants';

const ApplyLL = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.name,
    aadhaarNumber: user.aadhaarNumber,
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'B+',
    address: user.address,
    vehicleType: 'Two Wheeler',
    terms: false
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔥 AGE VALIDATION (18+)
  const today = new Date();
  const dob = new Date(formData.dateOfBirth);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    return toast.error('You must be at least 18 years old to apply');
  }

  // 🔥 TERMS CHECK
  if (!formData.terms) {
    return toast.error('Please accept the declaration');
  }

  setLoading(true);

  try {
    const { data } = await api.post('/ll', formData);

    toast.success('Application submitted! Please pay the fee to continue.');

    navigate('/user/payment', {
      state: { serviceType: 'LL', applicationId: data._id }
    });

  } catch (err) {
    toast.error(err.response?.data?.message || 'Application failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-800">Learning License Application</h1>
        <p className="text-gray-500 mt-2">Fill in the details precisely as per your government records.</p>
      </div>

      <div className="card shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xs font-black text-primary uppercase tracking-widest border-b pb-2">Personal Records</h2>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                <input type="text" readOnly className="input-field bg-gray-100 font-bold" value={formData.fullName} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Aadhaar Number</label>
                <input type="text" readOnly className="input-field bg-gray-100 font-bold" value={formData.aadhaarNumber} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date of Birth</label>
                  <input type="date" required className="input-field" max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Blood Group</label>
                  <select className="input-field" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs font-black text-teal uppercase tracking-widest border-b pb-2">License Information</h2>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Choose Vehicle Category</label>
                <select className="input-field border-teal/20 focus:border-teal" value={formData.vehicleType} onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}>
                  {VEHICLE_TYPES.map(vt => <option key={vt} value={vt}>{vt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gender</label>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button type="button" key={g} onClick={() => setFormData({ ...formData, gender: g })} className={`flex-1 py-3 text-xs font-bold rounded-xl border-2 transition-all ${formData.gender === g ? 'bg-teal border-teal text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500 hover:border-teal/30'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Communication Address</label>
                <textarea rows={2} required className="input-field resize-none" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
            <input type="checkbox" id="terms" required checked={formData.terms} onChange={e => setFormData({ ...formData, terms: e.target.checked })} className="mt-1 w-5 h-5 rounded accent-primary" />
            <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed font-medium">
              I hereby declare that I am physically fit to drive the category of vehicle mentioned above. All information provided is true to the best of my knowledge and I understand that any false declaration will lead to immediate cancellation of my license.
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-xl tracking-tight">
            {loading ? <Spinner size="sm" text="" /> : 'Confirm & Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLL;
