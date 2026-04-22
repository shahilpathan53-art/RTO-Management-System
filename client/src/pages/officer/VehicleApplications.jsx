import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/constants';
import toast from 'react-hot-toast';

const GUJARAT_CITY_CODES = {
  'Valsad':    'GJ 15',
  'Navsari':   'GJ 21',
  'Surat':     'GJ 05',
  'Vadodara':  'GJ 06',
  'Ahmedabad': 'GJ 01',
};

const VehicleApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Pending');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const { data } = await api.get('/vehicle/all');
      setApps(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id, status) => {
    const notes = prompt(`Enter officer notes for ${status}:`);
    if (notes === null) return;
    try {
      await api.put(`/vehicle/approve/${id}`, { registrationStatus: status, notes });
      toast.success(`Vehicle ${status}! GJ city code auto-assigned.`);
      fetchApps();
    } catch (err) { toast.error('Status update failed'); }
  };

  const filtered = apps
    .filter(a => a.registrationStatus === tab)
    .filter(a =>
      a.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      a.brand?.toLowerCase().includes(search.toLowerCase()) ||
      a.engineNumber?.includes(search) ||
      (a.gjCode || a.rcNumber || '').includes(search)
    );

  const counts = {
    Pending:  apps.filter(a => a.registrationStatus === 'Pending').length,
    Approved: apps.filter(a => a.registrationStatus === 'Approved').length,
    Rejected: apps.filter(a => a.registrationStatus === 'Rejected').length,
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Checking vehicle queue..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Vehicle Registration Desk</h1>
          <p className="text-gray-500 font-medium">Verify engine / chassis data and issue digital RC with Gujarat city code.</p>
        </div>
        <input type="text" placeholder="Search by owner, brand, engine no..." className="input-field max-w-sm shadow-sm"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="flex gap-2 mb-6">
        {['Pending', 'Approved', 'Rejected'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${tab === t ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filtered.map((app) => (
          <div key={app._id} className="card p-8 group hover:shadow-xl transition-all">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <StatusBadge status={app.registrationStatus} />
                  <p className="text-[10px] font-black text-gray-400 uppercase">Applied: {formatDate(app.createdAt)}</p>
                  {app.city && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase">
                      📍 {app.city} ({GUJARAT_CITY_CODES[app.city] || 'N/A'})
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-gray-800 uppercase">{app.brand} {app.model} ({app.year})</h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Owner</p><p className="font-bold text-gray-700">{app.ownerName}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Engine No.</p><p className="font-mono text-xs font-black text-primary">{app.engineNumber}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Chassis No.</p><p className="font-mono text-xs font-black text-primary">{app.chassisNumber}</p></div>
                  <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Fuel Type</p><p className="font-bold text-gray-700">{app.fuelType}</p></div>
                </div>
              </div>

              {app.registrationStatus === 'Pending' && (
                <div className="flex lg:flex-col gap-3 justify-center shrink-0 lg:border-l lg:border-gray-100 lg:pl-10">
                  <button onClick={() => handleApprove(app._id, 'Approved')}
                    className="btn-success py-3 px-8 text-xs rounded-xl whitespace-nowrap">
                    ✅ Verify & Issue RC
                  </button>
                  <button onClick={() => handleApprove(app._id, 'Rejected')}
                    className="btn-danger py-3 px-8 text-xs rounded-xl whitespace-nowrap">
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>

            {(app.gjCode || app.rcNumber) && (
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                    {app.gjCode ? 'Gujarat Registration Code' : 'RC Number'}
                  </p>
                  <p className="text-2xl font-black text-teal tracking-widest">{app.gjCode || app.rcNumber}</p>
                </div>
                {app.notes && <p className="text-xs text-gray-400 italic max-w-sm">"{app.notes}"</p>}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-20 text-gray-400 italic">No {tab.toLowerCase()} vehicle applications found.</p>}
      </div>
    </div>
  );
};

export default VehicleApplications;
