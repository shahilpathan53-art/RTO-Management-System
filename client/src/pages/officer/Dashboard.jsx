import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const OfficerDashboard = () => {
  const [stats, setStats] = useState({
    pendingLL: 0, acceptedLL: 0, rejectedLL: 0,
    pendingDL: 0, acceptedDL: 0, rejectedDL: 0,
    pendingVehicle: 0, totalVehicle: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [llRes, dlRes, vRes] = await Promise.all([
          api.get('/ll/all'),
          api.get('/dl/all'),
          api.get('/vehicle/all'),
        ]);
        const ll = llRes.data;
        const dl = dlRes.data;
        const v  = vRes.data;
        setStats({
          pendingLL:  ll.filter(a => a.status === 'Pending').length,
          acceptedLL: ll.filter(a => a.status === 'Approved').length,
          rejectedLL: ll.filter(a => a.status === 'Rejected').length,
          pendingDL:  dl.filter(a => a.status === 'Pending').length,
          acceptedDL: dl.filter(a => a.status === 'Issued').length,
          rejectedDL: dl.filter(a => a.status === 'Rejected').length,
          pendingVehicle: v.filter(a => a.registrationStatus === 'Pending').length,
          totalVehicle:   v.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading Verification Desk..." /></div>;

  const cards = [
    { title: 'Pending New LL',        value: stats.pendingLL,      link: '/officer/ll-applications', color: 'border-t-orange-400',  icon: '⏳', bg: 'bg-orange-50' },
    { title: 'Total Accepted LL',     value: stats.acceptedLL,     link: '/officer/ll-applications', color: 'border-t-green-500',   icon: '✅', bg: 'bg-green-50' },
    { title: 'Total Rejected LL',     value: stats.rejectedLL,     link: '/officer/ll-applications', color: 'border-t-red-400',     icon: '❌', bg: 'bg-red-50' },
    { title: 'Pending New DL',        value: stats.pendingDL,      link: '/officer/dl-applications', color: 'border-t-blue-400',    icon: '⏳', bg: 'bg-blue-50' },
    { title: 'Total Accepted DL',     value: stats.acceptedDL,     link: '/officer/dl-applications', color: 'border-t-teal',        icon: '✅', bg: 'bg-teal-50' },
    { title: 'Total Rejected DL',     value: stats.rejectedDL,     link: '/officer/dl-applications', color: 'border-t-red-500',     icon: '❌', bg: 'bg-red-50' },
    { title: 'Pending Vehicle Reg.',  value: stats.pendingVehicle, link: '/officer/vehicle-applications', color: 'border-t-warning', icon: '🚗', bg: 'bg-yellow-50' },
    { title: 'Total Vehicle Reg.',    value: stats.totalVehicle,   link: '/officer/vehicle-applications', color: 'border-t-purple-500', icon: '🏍️', bg: 'bg-purple-50' },
    { title: 'Reports',               value: '→',                  link: '/officer/reports',          color: 'border-t-primary',    icon: '📊', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Officer Desk</h1>
        <p className="text-gray-500 font-medium">Manage and verify pending citizen applications.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {cards.map((item, i) => (
          <Link key={i} to={item.link}
            className={`card border-t-4 ${item.color} ${item.bg} flex justify-between items-center p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.title}</p>
              <h3 className="text-4xl font-black text-gray-800">{item.value}</h3>
            </div>
            <div className="text-3xl opacity-50">{item.icon}</div>
          </Link>
        ))}
      </div>

      <div className="card p-8 bg-gray-50 border-gray-100">
        <h3 className="text-xl font-black text-gray-800 mb-6">Verification Guidelines</h3>
        <ul className="space-y-3 text-gray-500 text-sm font-medium">
          <li className="flex gap-3 items-start"><span className="text-primary font-black">•</span> Ensure Aadhaar numbers match with uploaded visual documents.</li>
          <li className="flex gap-3 items-start"><span className="text-primary font-black">•</span> For DL approval, use the Driving Test Result recording tool.</li>
          <li className="flex gap-3 items-start"><span className="text-primary font-black">•</span> Rejection must include a detailed officer remark for citizen transparency.</li>
          <li className="flex gap-3 items-start"><span className="text-primary font-black">•</span> Vehicle approval automatically assigns the Gujarat city registration code (GJ XX YY NNNN).</li>
        </ul>
      </div>
    </div>
  );
};

export default OfficerDashboard;
