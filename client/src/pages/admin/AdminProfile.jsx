import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profile'); // 'profile' | 'password'
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/profile').then(res => setProfile(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPwLoading(true);
    try {
      await api.put('/admin/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading profile..." /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
        <p className="text-gray-500">View and manage your account settings.</p>
      </div>

      {/* Profile Card */}
      <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-black shrink-0">
          {profile?.name?.[0] || 'A'}
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">{profile?.name}</h2>
          <p className="text-primary font-black uppercase tracking-widest text-sm">{profile?.role}</p>
          <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
          <div className="flex gap-4 mt-3 text-sm text-gray-600">
            <span>📞 {profile?.phone}</span>
            <span>🪪 {profile?.aadhaarNumber}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['profile', 'password'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${tab === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t === 'profile' ? '👤 Profile Info' : '🔐 Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && profile && (
        <div className="card p-8">
          <h3 className="text-xl font-black text-gray-800 mb-6">Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', val: profile.name },
              { label: 'Email', val: profile.email },
              { label: 'Phone', val: profile.phone },
              { label: 'Aadhaar Number', val: profile.aadhaarNumber },
              { label: 'Role', val: profile.role?.toUpperCase() },
              { label: 'Account Created', val: new Date(profile.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
            ].map((item, i) => (
              <div key={i} className={`${item.label === 'Address' ? 'sm:col-span-2' : ''}`}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-bold text-gray-800 text-lg">{item.val || 'N/A'}</p>
              </div>
            ))}
          </div>
          {profile.address && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</p>
              <p className="font-bold text-gray-800">RTO Headquarters, Valsad</p>
            </div>
          )}
        </div>
      )}

      {tab === 'password' && (
        <div className="card p-8">
          <h3 className="text-xl font-black text-gray-800 mb-2">Change Password</h3>
          <p className="text-gray-400 text-sm mb-6">Choose a strong password to keep your account secure.</p>
          <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Current Password</label>
              <input type="password" required className="input-field" placeholder="Enter current password"
                value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">New Password</label>
              <input type="password" required minLength={6} className="input-field" placeholder="Min 6 characters"
                value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Confirm New Password</label>
              <input type="password" required className="input-field" placeholder="Repeat new password"
                value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
            </div>
            <button type="submit" disabled={pwLoading} className="btn-primary w-full py-3">
              {pwLoading ? 'Updating...' : '🔐 Update Password'}
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AdminProfile;
