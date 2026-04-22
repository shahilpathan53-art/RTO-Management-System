import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [viewProfile, setViewProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', aadhaarNumber: '', phone: '', address: '' });

  const fetchOfficers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setOfficers(data.filter(u => u.role === 'officer'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchOfficers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/officer', form);
      toast.success('Officer account created successfully!');
      setForm({ name: '', email: '', password: '', aadhaarNumber: '', phone: '', address: '' });
      fetchOfficers();
    } catch (err) { toast.error(err.response?.data?.message || 'Creation failed'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete officer "${name}"? This cannot be undone.`)) return;
    try {
      const { data } = await api.delete(`/admin/user/${id}`);
      toast.success(data.message); // "officer a/c deleted"
      fetchOfficers();
    } catch (err) { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-2 card h-fit">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 font-primary">Onboard RTO Officer</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email (Official)', key: 'email', type: 'email' },
              { label: 'Password', key: 'password', type: 'password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type={f.type} required className="input-field" value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar</label>
                <input type="text" required maxLength={12} className="input-field" value={form.aadhaarNumber}
                  onChange={e => setForm({ ...form, aadhaarNumber: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" required maxLength={10} className="input-field" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
              <textarea rows={2} required className="input-field resize-none" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <button type="submit" disabled={creating} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {creating ? <Spinner size="sm" /> : null}
              {creating ? 'Processing...' : 'Register Officer'}
            </button>
          </form>
        </div>

        {/* Officer List */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Active RTO Officers</h2>
          {loading ? <Spinner text="Syncing..." /> : (
            <div className="space-y-4">
              {officers.map((o) => (
                <div key={o._id} className="card p-5 flex items-center gap-4 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-teal text-white rounded-full flex items-center justify-center font-black text-lg shrink-0">
                    {o.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-800">{o.name}</p>
                    <p className="text-xs text-gray-400">{o.email} | 📞 {o.phone}</p>
                    <p className="text-xs text-gray-400">Aadhaar: {o.aadhaarNumber}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setViewProfile(viewProfile?._id === o._id ? null : o)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all">
                      👁️ Profile
                    </button>
                    <button onClick={() => handleDelete(o._id, o.name)}
                      className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold transition-all">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {officers.length === 0 && <p className="text-center py-10 text-gray-400 italic">No officers registered yet.</p>}
            </div>
          )}

          {/* Profile Panel */}
          {viewProfile && (
            <div className="card border-2 border-teal/30 p-6 animate-fade bg-teal-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-teal-800">Officer Profile</h3>
                <button onClick={() => setViewProfile(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Name', val: viewProfile.name },
                  { label: 'Email', val: viewProfile.email },
                  { label: 'Phone', val: viewProfile.phone },
                  { label: 'Aadhaar', val: viewProfile.aadhaarNumber },
                  { label: 'Address', val: viewProfile.address },
                  { label: 'Joined', val: new Date(viewProfile.createdAt).toLocaleDateString('en-IN') },
                ].map((item, i) => (
                  <div key={i} className={item.label === 'Address' ? 'col-span-2' : ''}>
                    <p className="text-[10px] font-black text-teal-600 uppercase">{item.label}</p>
                    <p className="font-bold text-teal-900">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOfficers;
