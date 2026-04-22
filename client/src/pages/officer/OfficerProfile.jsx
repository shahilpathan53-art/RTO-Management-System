import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const OfficerProfile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-fade">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Officer Profile</h1>
        <p className="text-gray-500">View and manage your account.</p>
      </div>

      {/* Profile Card */}
      <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-teal/5 to-blue-50">
        <div className="w-24 h-24 bg-teal text-white rounded-full flex items-center justify-center text-4xl font-black shrink-0">
          {user?.name?.[0]}
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">{user?.name}</h2>
          <p className="text-teal font-black uppercase tracking-widest text-sm">RTO Officer</p>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['profile', 'password'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${tab === t ? 'bg-teal text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t === 'profile' ? '👤 Profile' : '🔐 Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-8">
          <h3 className="text-xl font-black text-gray-800 mb-6">Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', val: user?.name },
              { label: 'Email', val: user?.email },
              { label: 'Role', val: 'RTO Officer' },
              { label: 'Username', val: user?.email?.split('@')[0] },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-bold text-gray-800 text-lg">{item.val || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'password' && (
        <div className="card p-8">
          <h3 className="text-xl font-black text-gray-800 mb-2">Change Password</h3>
          <p className="text-gray-400 text-sm mb-6">Use a strong, unique password to protect your account.</p>
          <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
            {[
              { label: 'Current Password', key: 'currentPassword', placeholder: 'Enter current password' },
              { label: 'New Password', key: 'newPassword', placeholder: 'Min 6 characters' },
              { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{f.label}</label>
                <input type="password" required className="input-field" placeholder={f.placeholder}
                  value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })} />
              </div>
            ))}
        <button
          type="submit"
          disabled={pwLoading}
          className="w-full py-3 rounded-xl font-bold text-black bg-teal-600 hover:bg-teal-700 shadow-md transition-all flex items-center justify-center gap-2"
        >
          🔐 {pwLoading ? 'Updating...' : 'Update Password'}
        </button>

          </form>
        </div>
      )}
    </div>
  );
};

export default OfficerProfile;
