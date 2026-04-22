import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, TIME_SLOTS, SERVICE_TYPES } from '../../utils/constants';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: 'LL Related',
    preferredDate: '',
    timeSlot: '10:00 AM',
    notes: '',
  });

  const fetchApts = async () => {
    try {
      const { data } = await api.get('/my')
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/book', formData);
      toast.success('Appointment booked successfully!');
      setFormData({ serviceType: 'LL Related', preferredDate: '', timeSlot: '10:00 AM', notes: '' });
      fetchApts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3">
           <div className="card p-8 sticky top-28">
              <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Book Visit Slot</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Category</label>
                    <select className="input-field" value={formData.serviceType} onChange={e => setFormData({ ...formData, serviceType: e.target.value })}>
                       {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Preferred Date</label>
                       <input type="date" required className="input-field" min={new Date().toISOString().split('T')[0]} value={formData.preferredDate} onChange={e => setFormData({ ...formData, preferredDate: e.target.value })} />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Time Slot</label>
                       <select className="input-field" value={formData.timeSlot} onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}>
                          {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Optional Notes</label>
                    <textarea rows={2} className="input-field resize-none" placeholder="e.g. Document clarification" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                 </div>
                 <button type="submit" disabled={submitting} className="btn-primary w-full py-4 rounded-2xl shadow-xl">
                   {submitting ? <Spinner size="sm" text="" /> : 'Confirm Booking'}
                 </button>
              </form>
           </div>
        </div>

        <div className="lg:w-2/3">
           <h3 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Your Appointment Logs</h3>
           {loading ? <Spinner text="Syncing logs..." /> : (
             <div className="space-y-6">
                {appointments.map((apt) => (
                  <div key={apt._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:translate-x-2 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-blue-100">
                          <p className="text-[10px] font-black text-primary uppercase leading-tight">{new Date(apt.preferredDate).toLocaleString('default', { month: 'short' })}</p>
                          <p className="text-2xl font-black text-gray-800 leading-tight">{new Date(apt.preferredDate).getDate()}</p>
                       </div>
                       <div>
                          <h4 className="font-black text-gray-800">{apt.serviceType}</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{apt.timeSlot} • {apt.appointmentId}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <StatusBadge status={apt.status} />
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && <p className="text-center py-20 text-gray-400 italic">No scheduled visits found.</p>}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
