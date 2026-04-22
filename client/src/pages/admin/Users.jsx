import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('users'); // 'users' | 'officers'

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.filter(u => u.role === 'user'));
      setOfficers(data.filter(u => u.role === 'officer'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id, name, role) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const { data } = await api.delete(`/admin/user/${id}`);
      toast.success(data.message); // "officer a/c deleted" or "user a/c deleted"
      fetchAll();
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  const handleViewProfile = async (id) => {
    try {
      const { data } = await api.get(`/admin/user/${id}`);
      toast.success(`${data.name} — ${data.email} | ${data.aadhaarNumber} | ${data.phone}`);
    } catch (err) {
      toast.error('Could not load profile');
    }
  };

  const list = tab === 'users' ? users : officers;
  const filtered = list.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.aadhaarNumber || '').includes(search)
  );

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading user database..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User & Officer Management</h1>
          <p className="text-gray-500">Manage citizen and officer accounts.</p>
        </div>
        <input type="text" placeholder="Search by name, email or Aadhaar..." className="input-field max-w-sm shadow-sm"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['users', 'officers'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${tab === t ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t === 'users' ? `👥 Users (${users.length})` : `👮 Officers (${officers.length})`}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Profile</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Contact</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Role</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${u.role === 'officer' ? 'bg-teal' : 'bg-primary'}`}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{u.name}</p>
                        <p className="text-[10px] text-gray-400">Aadhaar: {u.aadhaarNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700">{u.email}</p>
                    <p className="text-[10px] text-gray-400">{u.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'officer' ? 'bg-teal/10 text-teal' : 'bg-primary/10 text-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleViewProfile(u._id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all">
                        👁️ View
                      </button>
                      <button onClick={() => handleDelete(u._id, u.name, u.role)}
                        className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold transition-all">
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-20 text-gray-500">No matching accounts found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
