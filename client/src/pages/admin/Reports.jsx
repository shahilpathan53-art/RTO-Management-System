import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, GUJARAT_CITIES } from '../../utils/constants';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [cityFilter, setCityFilter] = useState('All');
  const [cityVehicles, setCityVehicles] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/reports').then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== 'vehicles') return;
    setCityLoading(true);
    const city = cityFilter === 'All' ? '' : cityFilter;
    api.get(`/admin/vehicles/city?city=${city}`)
      .then(res => setCityVehicles(res.data))
      .catch(console.error)
      .finally(() => setCityLoading(false));
  }, [tab, cityFilter]);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Generating reports..." /></div>;

  const tabs = [
    { key: 'users', label: '👥 User Reports' },
    { key: 'officers', label: '👮 Officer Reports' },
    { key: 'vehicles', label: '🚗 Vehicle Reports' },
    { key: 'revenue', label: '💰 Revenue' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500">Comprehensive system-wide data and statistics.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Users', val: data.users.length, icon: '👥', color: 'border-l-primary' },
          { label: 'Total Officers', val: data.officers.length, icon: '👮', color: 'border-l-teal' },
          { label: 'LL Applications', val: data.llList.length, icon: '📋', color: 'border-l-blue-500' },
          { label: 'DL Applications', val: data.dlList.length, icon: '🚗', color: 'border-l-purple-500' },
        ].map((c, i) => (
          <div key={i} className={`card border-l-4 ${c.color} flex justify-between items-center`}>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">{c.label}</p>
              <p className="text-3xl font-black text-gray-800">{c.val}</p>
            </div>
            <div className="text-2xl opacity-40">{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* USER REPORTS */}
      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['#', 'Name', 'Email', 'Phone', 'Aadhaar', 'Joined'].map(h => (
                  <th key={h} className="p-4 text-xs font-bold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.users.map((u, i) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{i + 1}</td>
                  <td className="p-4 font-bold text-gray-800">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 text-gray-600">{u.phone}</td>
                  <td className="p-4 font-mono text-xs text-gray-500">{u.aadhaarNumber}</td>
                  <td className="p-4 text-gray-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* OFFICER REPORTS */}
      {tab === 'officers' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['#', 'Name', 'Email', 'Phone', 'Aadhaar', 'Joined'].map(h => (
                  <th key={h} className="p-4 text-xs font-bold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.officers.map((o, i) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{i + 1}</td>
                  <td className="p-4 font-bold text-gray-800">{o.name}</td>
                  <td className="p-4 text-gray-600">{o.email}</td>
                  <td className="p-4 text-gray-600">{o.phone}</td>
                  <td className="p-4 font-mono text-xs text-gray-500">{o.aadhaarNumber}</td>
                  <td className="p-4 text-gray-500">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VEHICLE REPORTS with City Filter */}
      {tab === 'vehicles' && (
        <div>
          <div className="flex gap-2 mb-5 flex-wrap">
            {['All', ...GUJARAT_CITIES.map(c => c.name)].map(city => (
              <button key={city} onClick={() => setCityFilter(city)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${cityFilter === city ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {city}
              </button>
            ))}
          </div>
          {cityLoading ? <Spinner text="Loading..." /> : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Owner', 'Brand/Model', 'City', 'GJ Code', 'Type', 'Status', 'Date'].map(h => (
                      <th key={h} className="p-4 text-xs font-bold text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cityVehicles.map(v => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-gray-800">{v.ownerName}</td>
                      <td className="p-4 text-gray-600">{v.brand} {v.model}</td>
                      <td className="p-4 text-gray-600">{v.city || '—'}</td>
                      <td className="p-4 font-black text-primary font-mono">{v.gjCode || v.rcNumber || '—'}</td>
                      <td className="p-4 text-gray-600">{v.vehicleType}</td>
                      <td className="p-4"><StatusBadge status={v.registrationStatus} /></td>
                      <td className="p-4 text-gray-500">{formatDate(v.createdAt)}</td>
                    </tr>
                  ))}
                  {cityVehicles.length === 0 && <tr><td colSpan={7} className="text-center py-16 text-gray-400 italic">No vehicles found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* REVENUE */}
      {tab === 'revenue' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-8">
            <h3 className="font-black text-gray-800 text-xl mb-6">Revenue Summary</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Revenue', val: data.payments.reduce((a, p) => a + p.amount, 0), color: 'text-green-600' },
                { label: 'LL Fee Revenue', val: data.payments.filter(p => p.serviceType === 'LL').reduce((a, p) => a + p.amount, 0), color: 'text-blue-600' },
                { label: 'DL Fee Revenue', val: data.payments.filter(p => p.serviceType === 'DL').reduce((a, p) => a + p.amount, 0), color: 'text-purple-600' },
                { label: 'Vehicle Fee Revenue', val: data.payments.filter(p => p.serviceType === 'Vehicle').reduce((a, p) => a + p.amount, 0), color: 'text-orange-600' },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center p-4 bg-gray-50 rounded-2xl ${i === 0 ? 'border-2 border-green-200' : ''}`}>
                  <p className="font-bold text-gray-700">{item.label}</p>
                  <p className={`text-2xl font-black ${item.color}`}>₹{item.val.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-8">
            <h3 className="font-black text-gray-800 text-xl mb-6">Transaction Count</h3>
            <div className="space-y-4">
              {['LL', 'DL', 'Vehicle'].map(type => {
                const count = data.payments.filter(p => p.serviceType === type).length;
                return (
                  <div key={type} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="font-black text-gray-800 w-20 uppercase">{type}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: `${data.payments.length ? (count / data.payments.length * 100) : 0}%` }} />
                    </div>
                    <div className="font-black text-gray-800">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
