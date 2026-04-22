import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const OfficerSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ officerId: '', officerName: '', month: '', amount: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const [salRes, usrRes] = await Promise.all([api.get('/admin/salaries'), api.get('/admin/users')]);
      setSalaries(salRes.data);
      setOfficers(usrRes.data.filter(u => u.role === 'officer'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleOfficerSelect = (e) => {
    const officer = officers.find(o => o._id === e.target.value);
    setForm(prev => ({ ...prev, officerId: officer?._id || '', officerName: officer?.name || '' }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/salary', form);
      toast.success('Salary record created!');
      setForm({ officerId: '', officerName: '', month: '', amount: '', notes: '' });
      fetchAll();
    } catch (err) { toast.error('Failed to create record'); }
    finally { setSubmitting(false); }
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.put(`/admin/salary/${id}`, { status: 'Paid' });
      toast.success('Salary marked as Paid!');
      fetchAll();
    } catch (err) { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this salary record?')) return;
    try {
      await api.delete(`/admin/salary/${id}`);
      toast.success('Record deleted');
      fetchAll();
    } catch (err) { toast.error('Delete failed'); }
  };

  const totalPaid = salaries.filter(s => s.status === 'Paid').reduce((a, s) => a + s.amount, 0);
  const totalPending = salaries.filter(s => s.status === 'Pending').reduce((a, s) => a + s.amount, 0);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading salary records..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Officer Salary Management</h1>
        <p className="text-gray-500">Track and process monthly salary payments for all RTO officers.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Records', val: salaries.length, color: 'border-l-primary', icon: '📊' },
          { label: 'Total Paid (₹)', val: `₹${totalPaid.toLocaleString()}`, color: 'border-l-green-500', icon: '✅' },
          { label: 'Total Pending (₹)', val: `₹${totalPending.toLocaleString()}`, color: 'border-l-orange-400', icon: '⏳' },
        ].map((c, i) => (
          <div key={i} className={`card border-l-4 ${c.color} flex justify-between items-center`}>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
              <p className="text-2xl font-black text-gray-800">{c.val}</p>
            </div>
            <div className="text-2xl opacity-40">{c.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-2 card h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Add Salary Record</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Officer</label>
              <select required className="input-field" value={form.officerId} onChange={handleOfficerSelect}>
                <option value="">-- Choose Officer --</option>
                {officers.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select required className="input-field" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })}>
                <option value="">-- Select Month --</option>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                  <option key={m} value={`${m} ${new Date().getFullYear()}`}>{m} {new Date().getFullYear()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Amount (₹)</label>
              <input required type="number" min="1000" className="input-field" placeholder="e.g. 45000"
                value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <input type="text" className="input-field" placeholder="Any remarks..." value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? 'Saving...' : '+ Create Record'}
            </button>
          </form>
        </div>

        {/* Salary Table */}
        <div className="lg:col-span-3 card overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 mb-4 p-6 pb-0">Salary Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Officer</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Month</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {salaries.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{s.officerName}</td>
                    <td className="p-4 text-gray-600">{s.month}</td>
                    <td className="p-4 font-black text-gray-800">₹{s.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${s.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {s.status === 'Pending' && (
                          <button onClick={() => handleMarkPaid(s._id)}
                            className="px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-bold">
                            ✅ Mark Paid
                          </button>
                        )}
                        <button onClick={() => handleDelete(s._id)}
                          className="px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded text-xs font-bold">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {salaries.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-400 italic">No salary records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerSalary;
