import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/constants';
import { Link } from 'react-router-dom';

const VehicleStatus = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicle/my').then(res => setVehicles(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Aggregating vehicle data..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">My Registered Fleet</h1>
          <p className="text-gray-500 font-medium">View and manage all your registered vehicles.</p>
        </div>
        <Link to="/user/register-vehicle" className="btn-primary py-2.5 px-6">+ Register Vehicle</Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="card py-32 text-center">
          <div className="text-8xl mb-8 grayscale opacity-20">🏍️</div>
          <h3 className="text-2xl font-black text-gray-300">No vehicles registered yet.</h3>
          <Link to="/user/register-vehicle" className="btn-primary inline-block mt-6 py-3 px-8">Register Your Vehicle</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <div key={v._id} className="card relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-6 right-6">
                <StatusBadge status={v.registrationStatus} />
              </div>
              <div className="mb-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{v.vehicleType}</p>
                <h3 className="text-2xl font-black text-gray-800 uppercase">{v.brand} {v.model}</h3>
                <p className="text-sm text-gray-400 mt-1">{v.year} · {v.color} · {v.fuelType}</p>
              </div>

              {/* GJ Code Banner */}
              {v.gjCode && (
                <div className="mb-5 p-4 bg-primary/5 border-2 border-primary/20 rounded-2xl">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Gujarat Registration Code</p>
                  <p className="text-2xl font-black text-primary tracking-widest">{v.gjCode}</p>
                  {v.city && <p className="text-xs text-gray-400 mt-1">📍 {v.city}</p>}
                </div>
              )}

              <div className="space-y-3 pt-5 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase">RC / GJ Code</span>
                  <span className="text-sm font-black text-primary font-mono">{v.gjCode || v.rcNumber || 'PENDING...'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase">Engine No.</span>
                  <span className="text-xs font-mono text-gray-600">{v.engineNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase">Insurance Exp.</span>
                  <span className="text-sm font-bold text-orange-600">{formatDate(v.insuranceExpiry)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase">Registered On</span>
                  <span className="text-sm font-bold text-gray-600">{formatDate(v.createdAt)}</span>
                </div>
              </div>

              {v.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 italic">"{v.notes}"</p>
                </div>
              )}

              <button
                disabled={!v.gjCode && !v.rcNumber}
                onClick={() => window.print()}
                className="w-full mt-6 py-3 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20"
              >
                ⬇️ Download Digital RC
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleStatus;
