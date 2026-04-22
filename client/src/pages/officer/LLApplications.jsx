import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/constants';

const LLApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Pending');

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const { data } = await api.get('/ll/all');
      setApps(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = apps
    .filter(a => a.status === tab)
    .filter(a =>
      a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.aadhaarNumber?.includes(search) ||
      a._id?.includes(search)
    );

  const counts = { Pending: apps.filter(a => a.status === 'Pending').length, Approved: apps.filter(a => a.status === 'Approved').length, Rejected: apps.filter(a => a.status === 'Rejected').length };

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading LL applications..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">LL Applications</h1>
          <p className="text-gray-500 font-medium">Verify and process Learning License applications.</p>
        </div>
        <input
          type="text"
          placeholder="Search by name, Aadhaar or ID..."
          className="input-field max-w-sm shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['Pending', 'Approved', 'Rejected'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${tab === t ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(app => (
          <div key={app._id} className="card p-6 hover:shadow-lg transition-all">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <StatusBadge status={app.status} />
                  <p className="text-[10px] font-black text-gray-400 uppercase">Applied: {formatDate(app.createdAt)}</p>
                </div>
                <h3 className="text-xl font-black text-gray-800">{app.fullName}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">Aadhaar</p><p className="font-bold font-mono text-primary">{app.aadhaarNumber}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">DOB</p><p className="font-bold">{formatDate(app.dob)}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">Vehicle Type</p><p className="font-bold">{app.vehicleType}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">Blood Group</p><p className="font-bold">{app.bloodGroup}</p></div>
                </div>
              </div>
              {tab === 'Pending' && (
                <div className="flex lg:flex-col gap-2 justify-center">
                  <a href={`/officer/ll-verify/${app._id}`}
                    className="px-5 py-2 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-black transition-all text-center">
                    🔍 Verify
                  </a>
                </div>
              )}
              {app.officerRemarks && (
                <p className="text-xs text-gray-400 italic mt-2">Remarks: "{app.officerRemarks}"</p>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-20 text-gray-400 italic">No {tab.toLowerCase()} applications found.</p>}
      </div>
    </div>
  );
};

export default LLApplications;
