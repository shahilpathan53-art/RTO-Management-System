import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/activity'),
        ]);
        setStats(statsRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Aggregating system stats..." /></div>;

  const cards = [
    { title: 'Total Citizens', value: stats.totalUsers, color: 'border-l-primary', icon: '👥', link: '/admin/users' },
    { title: 'RTO Officers', value: stats.totalOfficers, color: 'border-l-teal', icon: '👮', link: '/admin/officers' },
    { title: 'LL Issued', value: stats.totalLL, color: 'border-l-blue-500', icon: '📋', link: '/admin/reports' },
    { title: 'DL Issued', value: stats.totalDL, color: 'border-l-purple-500', icon: '🚗', link: '/admin/reports' },
    { title: 'Vehicles', value: stats.totalVehicles, color: 'border-l-warning', icon: '🏍️', link: '/admin/reports' },
    { title: 'Revenue (₹)', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'border-l-green-600', icon: '💰', link: '/admin/reports' },
    { title: 'Pending LL', value: stats.pendingLL, color: 'border-l-orange-400', icon: '⏳', link: '/admin/reports' },
    { title: 'Pending DL', value: stats.pendingDL, color: 'border-l-red-400', icon: '🕒', link: '/admin/reports' },
  ];

  const logColors = { info: 'bg-blue-400', warn: 'bg-orange-400', success: 'bg-teal', danger: 'bg-red-400' };

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">System-wide overview and management for the RTO portal.</p>
        </div>
        <div className="flex gap-3">
          {/* <Link to="/admin/enquiry" className="btn-primary py-2 px-5 text-sm">📋 Enquiries</Link> */}
          <Link to="/admin/feedback" className="btn-secondary py-2 px-5 text-sm">💬 Feedback</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((c) => (
          <Link key={c.title} to={c.link} className={`card border-l-4 ${c.color} flex justify-between items-center hover:shadow-xl transition-all hover:-translate-y-0.5`}>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{c.title}</p>
              <p className="text-3xl font-black text-gray-800">{c.value}</p>
            </div>
            <div className="text-2xl opacity-40">{c.icon}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
        <div className="lg:col-span-2 card">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
            Recent System Activity
            <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded animate-pulse">🔴 LIVE</span>
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {logs.length === 0 && (
              <p className="text-center py-10 text-gray-400 italic">No activity logs yet.</p>
            )}
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all">
                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${logColors[log.type] || 'bg-gray-400'}`} />
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">{log.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-gray-400 uppercase">{timeAgo(log.createdAt)}</p>
                    {log.actor && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{log.actor}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card h-fit bg-primary text-white">
          <h3 className="font-bold mb-4">Admin Privileges</h3>
          <ul className="space-y-3 mb-8">
            {[
              { to: '/admin/users', label: 'Manage Users & Officers' },
              { to: '/admin/salary', label: 'Officer Salary Management' },
              { to: '/admin/enquiry', label: 'Appointment Enquiries' },
              { to: '/admin/feedback', label: 'User Feedback Review' },
              { to: '/admin/reports', label: 'Reports & Analytics' },
              { to: '/admin/profile', label: 'Admin Profile Settings' },
            ].map((item, i) => (
              <li key={i}>
                <Link to={item.to} className="flex gap-3 items-center hover:translate-x-1 transition-transform">
                  <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-xs">✓</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-blue-200 uppercase font-black text-center border-t border-white/10 pt-4">RTO Security Protocol Active</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
