import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/constants';

const DLApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Pending');
  const [scheduling, setScheduling] = useState(null);
  const [schedDate, setSchedDate] = useState('');

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const { data } = await api.get('/dl/all');
      setApps(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSchedule = async (id) => {
    if (!schedDate) { toast.error('Please select a date'); return; }
    try {
      await api.put(`/dl/schedule/${id}`, { scheduledDate: schedDate });
      toast.success('DL exam date scheduled! User will be notified.');
      setScheduling(null);
      setSchedDate('');
      fetchApps();
    } catch (err) { toast.error('Scheduling failed'); }
  };

  const filtered = apps
    .filter(a => tab === 'Pending' ? a.status === 'Pending' : tab === 'Issued' ? a.status === 'Issued' : a.status === 'Rejected')
    .filter(a =>
      a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a._id?.includes(search)
    );

  const counts = { Pending: apps.filter(a => a.status === 'Pending').length, Issued: apps.filter(a => a.status === 'Issued').length, Rejected: apps.filter(a => a.status === 'Rejected').length };

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading DL applications..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">DL Applications</h1>
          <p className="text-gray-500 font-medium">Process and schedule Driving License exams.</p>
        </div>
        <input type="text" placeholder="Search by name or ID..." className="input-field max-w-sm shadow-sm"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="flex gap-2 mb-6">
        {['Pending', 'Issued', 'Rejected'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${tab === t ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(app => (
          <div key={app._id} className="card p-6 hover:shadow-lg transition-all">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <StatusBadge status={app.status} />
                  <p className="text-[10px] font-black text-gray-400 uppercase">Applied: {formatDate(app.createdAt)}</p>
                </div>
                <h3 className="text-xl font-black text-gray-800">{app.fullName}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">Vehicle Type</p><p className="font-bold">{app.vehicleType}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">Test Result</p><p className="font-bold">{app.testResult}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">Requested Date</p><p className="font-bold">{formatDate(app.testDate)}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase">Scheduled Date</p>
                    <p className={`font-bold ${app.scheduledDate ? 'text-teal' : 'text-gray-400'}`}>
                      {app.scheduledDate ? formatDate(app.scheduledDate) : 'Not Set'}
                    </p>
                  </div>
                </div>
                {app.dlNumber && <p className="text-sm font-black text-teal mt-2">DL Number: {app.dlNumber}</p>}
              </div>

              {tab === 'Pending' && (
                <div className="flex lg:flex-col gap-2 shrink-0 justify-center">
                  <button onClick={() => setScheduling(scheduling === app._id ? null : app._id)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-black transition-all">
                    📅 Schedule Date
                  </button>
                  <a href={`/officer/dl-result/${app._id}`}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-black transition-all text-center">
                    📝 Record Result
                  </a>
                </div>
              )}
            </div>

            {/* Schedule Panel */}
            {scheduling === app._id && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Select Exam Date</label>
                  <input type="date" className="input-field"
                    min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    value={schedDate} onChange={e => setSchedDate(e.target.value)} />
                </div>
                <button onClick={() => handleSchedule(app._id)}
                  className="btn-primary py-2.5 px-6 mt-4 text-sm">
                  ✅ Confirm Schedule
                </button>
                <button onClick={() => { setScheduling(null); setSchedDate(''); }}
                  className="btn-secondary py-2.5 px-6 mt-4 text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-20 text-gray-400 italic">No {tab.toLowerCase()} applications found.</p>}
      </div>
    </div>
  );
};

export default DLApplications;
