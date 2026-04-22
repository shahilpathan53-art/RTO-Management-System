import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const UserProfile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false); // ✅ NEW

  // 🔐 Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPwLoading(true);

    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });

      toast.success('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  // 📧 🔥 NEW: Forgot Password Email
  const handleForgotPassword = async () => {
    if (!user?.email) {
      toast.error('User email not found');
      return;
    }

    setEmailLoading(true);

    try {
      await api.post('/auth/forgot-password', {
        email: user.email,
      });

      toast.success('📩 Recovery email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-fade">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
        <p className="text-gray-500">View your profile and manage account settings.</p>
      </div>

      {/* Profile Banner */}
      <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-black shrink-0">
          {user?.name?.[0]}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-black text-gray-800">{user?.name}</h2>
          <p className="text-primary font-black uppercase tracking-widest text-sm">Citizen</p>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'profile', label: '👤 My Profile' },
          { key: 'password', label: '🔐 Change Password' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
              tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-8">
          <h3 className="text-xl font-black text-gray-800 mb-6">Profile Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', val: user?.name },
              { label: 'Email Address', val: user?.email },
              { label: 'Role', val: 'Citizen / User' },
              { label: 'Account ID', val: user?._id?.slice(-8)?.toUpperCase() || 'N/A' },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-bold text-gray-800 text-lg">{item.val || 'N/A'}</p>
              </div>
            ))}
          </div>

          {/* 🔥 Forgot Password Section */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-black text-gray-700 mb-2">Forgot Password?</h4>
            <p className="text-sm text-gray-500 mb-3">
              We'll send a recovery link to your registered email address.
            </p>

            <button
              onClick={handleForgotPassword}
              disabled={emailLoading}
              className="btn-secondary py-2 px-6 text-sm"
            >
              {emailLoading ? 'Sending...' : '📧 Send Recovery Email'}
            </button>
          </div>
        </div>
      )}

      {tab === 'password' && (
        <div className="card p-8">
          <h3 className="text-xl font-black text-gray-800 mb-2">Change Password</h3>
          <p className="text-gray-400 text-sm mb-6">
            Protect your account with a strong, unique password.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
            {[
              { label: 'Current Password', key: 'currentPassword', placeholder: 'Enter current password' },
              { label: 'New Password', key: 'newPassword', placeholder: 'Minimum 6 characters' },
              { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">
                  {f.label}
                </label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder={f.placeholder}
                  value={pwForm[f.key]}
                  onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                />
              </div>
            ))}

            <button type="submit" disabled={pwLoading} className="btn-primary w-full py-3">
              {pwLoading ? 'Updating...' : '🔐 Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;