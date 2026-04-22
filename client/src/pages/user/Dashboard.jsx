import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { FaIdCard, FaCar, FaClock, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
import { formatDate } from '../../utils/constants';

const Dashboard = () => {
  const [stats, setStats] = useState({ ll: [], dl: [], vehicles: [], appointments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [llRes, dlRes, vehicleRes, aptRes] = await Promise.all([
          api.get('/ll/my'),
          api.get('/dl/my'),
          api.get('/vehicle/my'),
          // api.get('/appointment/my'),
          api.get('/my')
        ]);
        setStats({ ll: llRes.data, dl: dlRes.data, vehicles: vehicleRes.data, appointments: aptRes.data });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading your profile..." /></div>;

  // Find pending DL schedule notifications
  const pendingDLSchedule = stats.dl.filter(d => d.scheduledDate && d.status === 'Pending');

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Here's an overview of your RTO activities and status.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/user/appointments" className="btn-primary py-3 px-6 flex items-center gap-2">
            <FaCalendarAlt /> Book Appointment
          </Link>
          <Link to="/user/profile" className="btn-secondary py-3 px-6 flex items-center gap-2">
            <FaUserCircle /> My Profile
          </Link>
        </div>
      </div>

      {/* DL Schedule Notification */}
      {pendingDLSchedule.map(dl => (
        <div key={dl._id} className="mb-6 p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl flex gap-4 items-center animate-fade">
          <span className="text-3xl">📅</span>
          <div className="flex-1">
            <p className="font-black text-blue-800">DL Exam Date Scheduled!</p>
            <p className="text-sm text-blue-700">{dl.dlScheduleMsg}</p>
          </div>
          <Link to="/user/dl-status" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black">View Details</Link>
        </div>
      ))}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card border-l-8 border-primary">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Active LL</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-black text-gray-800">{stats.ll.filter(l => l.status === 'Approved').length}</h3>
            <Link to="/user/ll-status" className="text-xs font-bold text-primary hover:underline">Track Delivery</Link>
          </div>
        </div>
        <div className="card border-l-8 border-teal">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Active DL</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-black text-gray-800">{stats.dl.filter(l => l.status === 'Issued').length}</h3>
            <Link to="/user/dl-status" className="text-xs font-bold text-teal hover:underline">Track Progress</Link>
          </div>
        </div>
        <div className="card border-l-8 border-warning">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Registered Vehicles</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-black text-gray-800">{stats.vehicles.length}</h3>
            <Link to="/user/vehicle-status" className="text-xs font-bold text-warning hover:underline">Manage Fleet</Link>
          </div>
        </div>
        <div className="card border-l-8 border-danger">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Appointments</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-black text-gray-800">{stats.appointments.length}</h3>
            <Link to="/user/appointments" className="text-xs font-bold text-danger hover:underline">View History</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <FaClock className="text-primary text-lg" /> Recent Updates
            </h2>
            <div className="space-y-4">
              {[...stats.ll, ...stats.dl, ...stats.vehicles]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {item.vehicleType ? 'Vehicle' : item.dlNumber !== undefined ? 'DL' : 'LL'}
                      </p>
                      <p className="font-bold text-gray-800">{item.fullName || item.brand || 'Application Update'}</p>
                      {/* Show DL schedule message in recent updates */}
                      {item.dlScheduleMsg && (
                        <p className="text-xs text-blue-600 mt-1">📅 {item.dlScheduleMsg}</p>
                      )}
                      {/* Show GJ code for vehicles */}
                      {item.gjCode && (
                        <p className="text-xs text-teal font-black mt-1">🚗 {item.gjCode}</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-0.5">Updated: {formatDate(item.updatedAt)}</p>
                    </div>
                    <StatusBadge status={item.status || item.registrationStatus} />
                  </div>
                ))}
              {stats.ll.length === 0 && stats.dl.length === 0 && stats.vehicles.length === 0 && (
                <p className="text-center py-10 text-gray-400 italic">No recent activity found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-primary text-white overflow-hidden relative">
            <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl transform -rotate-12"><FaIdCard /></div>
            <h3 className="text-2xl font-black mb-4">Quick Actions</h3>
            <div className="space-y-3 relative z-10">
              <Link to="/user/apply-ll" className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">📋 Apply New LL</Link>
              <Link to="/user/apply-dl" className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">🚗 Apply Permanent DL</Link>
              <Link to="/user/register-vehicle" className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">🏍️ Register Vehicle</Link>
              <Link to="/user/appointments" className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">📅 Book Appointment</Link>
            </div>
          </div>

          <div className="card bg-teal-50 border-teal-100">
            <h4 className="font-black text-teal-800 mb-2">Did you know?</h4>
            <p className="text-sm text-teal-700 leading-relaxed font-medium">You can track your DL exam schedule and get notifications directly on your dashboard!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
