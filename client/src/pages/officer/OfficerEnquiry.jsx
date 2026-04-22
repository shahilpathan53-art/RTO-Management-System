import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatDate } from '../../utils/constants';

const OfficerEnquiry = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/officer/appointments');
      setAppointments(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

const handleUpdate = async (id, status) => {
  let notes = prompt(`Enter notes for ${status}:`);

  if (notes === null) return;

  if (!notes.trim()) {
    notes = `${status} by admin`;
  }

  try {
    await api.put(`/officer/appointment/${id}`, {
      status: status, // ✅ FIXED (no lowercase)
      notes,
    });

    toast.success(`Appointment ${status}`);
    fetchAll();
  } catch (err) {
    console.error("Update Error:", err.response?.data || err.message);

    toast.error(
      err.response?.data?.message || "Update failed"
    );
  }
};

  const filtered =
    filter === 'All'
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const statusColors = {
    Booked: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
    Approved: 'bg-teal-100 text-teal-700',
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner text="Loading appointments..." />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Enquiry Management
        </h1>
        <p className="text-gray-500">
          View and manage citizen appointment requests.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Booked', 'Approved', 'Completed', 'Cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f}{' '}
            {f !== 'All' &&
              `(${appointments.filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((apt) => (
          <div
            key={apt._id}
            className="card p-6 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      statusColors[apt.status] ||
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    ID: {apt.appointmentId}
                  </span>
                </div>

                <h3 className="text-lg font-black text-gray-800 mb-1">
                  {apt.serviceType}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase">
                      Citizen
                    </p>
                    <p className="font-bold text-gray-700">
                      {apt.userId?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {apt.userId?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase">
                      Phone
                    </p>
                    <p className="font-bold text-gray-700">
                      {apt.userId?.phone || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase">
                      Preferred Date
                    </p>
                    <p className="font-bold text-gray-700">
                      {formatDate(apt.preferredDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase">
                      Time Slot
                    </p>
                    <p className="font-bold text-gray-700">
                      {apt.timeSlot}
                    </p>
                  </div>
                </div>

                {apt.notes && (
                  <p className="mt-3 text-sm text-gray-500 italic">
                    Notes: "{apt.notes}"
                  </p>
                )}
              </div>

              {apt.status === 'Booked' && (
                <div className="flex lg:flex-col gap-3 shrink-0 justify-center">
                  <button
                    onClick={() => handleUpdate(apt._id, 'Approved')}
                    className="px-5 py-2.5 bg-teal text-white hover:bg-teal/90 rounded-xl text-xs font-black"
                  >
                    ✅ Approve
                  </button>

                  <button
                    onClick={() => handleUpdate(apt._id, 'Cancelled')}
                    className="px-5 py-2.5 bg-red-500 text-white hover:bg-red-600 rounded-xl text-xs font-black"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center py-20 text-gray-400 italic">
            No appointments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default OfficerEnquiry;