import React, { useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatDate } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge';

const OfficerReports = () => {
  const [llApps, setLLApps] = useState([]);
  const [dlApps, setDLApps] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [tab, setTab] = useState('ll');

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      const [llRes, dlRes] = await Promise.all([
        api.get('/ll/all'),
        api.get('/dl/all'),
      ]);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59);

      setLLApps(llRes.data.filter(a => {
        const d = new Date(a.createdAt);
        return d >= from && d <= to;
      }));
      setDLApps(dlRes.data.filter(a => {
        const d = new Date(a.createdAt);
        return d >= from && d <= to;
      }));
      setFetched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Officer Reports</h1>
        <p className="text-gray-500 font-medium">Generate LL and DL reports between specific dates.</p>
      </div>

      {/* Date Filter */}
      <div className="card p-8 mb-8">
        <h2 className="text-xl font-black text-gray-800 mb-6">Select Date Range</h2>
        <form onSubmit={handleFetch} className="flex flex-wrap gap-6 items-end">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">From Date</label>
            <input type="date" required className="input-field" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">To Date</label>
            <input type="date" required className="input-field" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary py-2.5 px-8 flex items-center gap-2">
            {loading ? <Spinner size="sm" /> : '📊'} Generate Report
          </button>
        </form>
      </div>

      {fetched && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'LL Applications', val: llApps.length, icon: '📋', color: 'border-l-blue-400' },
              { label: 'LL Approved', val: llApps.filter(a => a.status === 'Approved').length, icon: '✅', color: 'border-l-green-500' },
              { label: 'DL Applications', val: dlApps.length, icon: '🚗', color: 'border-l-purple-500' },
              { label: 'DL Issued', val: dlApps.filter(a => a.status === 'Issued').length, icon: '✅', color: 'border-l-teal' },
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

          <div className="text-sm text-gray-500 mb-4 font-medium">
            Showing results from <span className="font-black text-gray-800">{formatDate(fromDate)}</span> to <span className="font-black text-gray-800">{formatDate(toDate)}</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setTab('ll')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase ${tab === 'll' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
              LL Report ({llApps.length})
            </button>
            <button onClick={() => setTab('dl')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase ${tab === 'dl' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
              DL Report ({dlApps.length})
            </button>
          </div>

          {tab === 'll' && (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['#', 'Name', 'Aadhaar', 'Vehicle Type', 'Status', 'Applied Date'].map(h => (
                      <th key={h} className="p-4 text-xs font-bold text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {llApps.map((a, i) => (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-400">{i + 1}</td>
                      <td className="p-4 font-bold text-gray-800">{a.fullName}</td>
                      <td className="p-4 font-mono text-xs text-gray-500">{a.aadhaarNumber}</td>
                      <td className="p-4 text-gray-600">{a.vehicleType}</td>
                      <td className="p-4"><StatusBadge status={a.status} /></td>
                      <td className="p-4 text-gray-500">{formatDate(a.createdAt)}</td>
                    </tr>
                  ))}
                  {llApps.length === 0 && <tr><td colSpan={6} className="text-center py-16 text-gray-400 italic">No LL applications in this date range.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'dl' && (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['#', 'Name', 'Vehicle Type', 'Test Result', 'Status', 'DL Number', 'Applied Date'].map(h => (
                      <th key={h} className="p-4 text-xs font-bold text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dlApps.map((a, i) => (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-400">{i + 1}</td>
                      <td className="p-4 font-bold text-gray-800">{a.fullName}</td>
                      <td className="p-4 text-gray-600">{a.vehicleType}</td>
                      <td className="p-4 text-gray-600">{a.testResult}</td>
                      <td className="p-4"><StatusBadge status={a.status} /></td>
                      <td className="p-4 font-mono text-xs font-black text-teal">{a.dlNumber || '—'}</td>
                      <td className="p-4 text-gray-500">{formatDate(a.createdAt)}</td>
                    </tr>
                  ))}
                  {dlApps.length === 0 && <tr><td colSpan={7} className="text-center py-16 text-gray-400 italic">No DL applications in this date range.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OfficerReports;
