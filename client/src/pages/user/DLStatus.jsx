import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/constants';
import { Link } from 'react-router-dom';

const DL_STAGES = [
  { key: 'applied',    label: 'Application Submitted', icon: '📝' },
  { key: 'scheduled',  label: 'Exam Date Scheduled',   icon: '📅' },
  { key: 'exam',       label: 'Field Test Conducted',  icon: '🚗' },
  { key: 'issued',     label: 'DL Issued',             icon: '🏆' },
];

const DLStatus = () => {
  const [dlList, setDLList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dl/my').then(res => setDLList(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Checking license status..." /></div>;

  if (dlList.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-9xl mb-8">🚗</div>
      <h2 className="text-3xl font-black text-gray-800">No active DL found.</h2>
      <p className="text-gray-500 mt-2 font-medium">Apply for a permanent license after your LL approval.</p>
      <Link to="/user/apply-dl" className="btn-primary inline-block mt-6 py-3 px-8">Apply for DL</Link>
    </div>
  );

  const getStageIndex = (dl) => {
    if (dl.status === 'Issued') return 3;
    if (dl.testResult !== 'Pending') return 2;
    if (dl.scheduledDate) return 1;
    return 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-800">DL Tracking Progress</h1>
        <p className="text-gray-500 font-medium">Track the status of all your Driving License applications.</p>
      </div>

      <div className="space-y-10">
        {dlList.map((dl, idx) => {
          const stageIdx = getStageIndex(dl);

          return (
            <div key={dl._id} className="card p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-800">{dl.vehicleType}</h2>
                  <p className="text-gray-400 text-sm">Applied: {formatDate(dl.createdAt)}</p>
                </div>
                <StatusBadge status={dl.status} />
              </div>

              {/* Progress Tracker */}
              <div className="relative mb-8">
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 z-0">
                  <div className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${(stageIdx / (DL_STAGES.length - 1)) * 100}%` }} />
                </div>
                <div className="relative z-10 flex justify-between">
                  {DL_STAGES.map((stage, i) => (
                    <div key={stage.key} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 transition-all ${i <= stageIdx ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-gray-200 text-gray-300'}`}>
                        {stage.icon}
                      </div>
                      <p className={`text-[10px] font-black uppercase mt-3 text-center max-w-[80px] ${i <= stageIdx ? 'text-primary' : 'text-gray-400'}`}>
                        {stage.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Test Date (Requested)</p><p className="font-bold">{formatDate(dl.testDate)}</p></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Exam Scheduled</p>
                  <p className={`font-bold ${dl.scheduledDate ? 'text-teal' : 'text-orange-400'}`}>
                    {dl.scheduledDate ? formatDate(dl.scheduledDate) : 'Awaiting Officer'}
                  </p>
                </div>
                <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">Test Result</p><p className="font-bold">{dl.testResult}</p></div>
                <div><p className="text-[10px] text-gray-400 font-black uppercase mb-1">DL Number</p><p className="font-black text-teal">{dl.dlNumber || '—'}</p></div>
              </div>

              {/* Scheduled Date Alert */}
              {dl.dlScheduleMsg && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex gap-3 items-start">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-black text-blue-800 text-sm">Exam Date Notification</p>
                    <p className="text-sm text-blue-700 mt-1">{dl.dlScheduleMsg}</p>
                  </div>
                </div>
              )}

              {/* DL Card */}
              {dl.status === 'Issued' && (
                <div className="mt-6 p-6 bg-primary rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full" />
                  <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-3">Republic of India • Driving License</p>
                  <div className="grid grid-cols-3 gap-4 relative z-10">
                    <div><p className="text-[8px] text-blue-300 font-black uppercase">License No.</p><p className="text-lg font-black">{dl.dlNumber}</p></div>
                    <div><p className="text-[8px] text-blue-300 font-black uppercase">Name</p><p className="font-bold uppercase">{dl.fullName}</p></div>
                    <div><p className="text-[8px] text-blue-300 font-black uppercase">Category</p><p className="font-bold">{dl.vehicleType}</p></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <p className="text-xs text-blue-200">Issued: {formatDate(dl.createdAt)}</p>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black transition-all">
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              )}

              {dl.officerNotes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 font-black uppercase mb-1">Officer Remarks</p>
                  <p className="text-sm text-gray-600 italic">"{dl.officerNotes}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DLStatus;
