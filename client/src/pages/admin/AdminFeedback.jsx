import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/admin/feedback');
      setFeedbacks(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/admin/feedback/${id}/read`);
      fetchAll();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/admin/feedback/${id}`);
      toast.success('Feedback deleted');
      fetchAll();
    } catch (err) { toast.error('Delete failed'); }
  };

  const filtered = filter === 'All' ? feedbacks : feedbacks.filter(f => f.type === filter);
  const unread = feedbacks.filter(f => !f.isRead).length;
  const stars = n => '⭐'.repeat(n);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Loading feedback..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Feedback</h1>
          <p className="text-gray-500">Feedback and contact messages submitted by citizens.</p>
        </div>
        {unread > 0 && (
          <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-sm">
            🔔 {unread} Unread
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['All', 'contact', 'feedback'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {f === 'All' ? `All (${feedbacks.length})` : f === 'contact' ? `📩 Contact (${feedbacks.filter(fb => fb.type === 'contact').length})` : `💬 Feedback (${feedbacks.filter(fb => fb.type === 'feedback').length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(fb => (
          <div key={fb._id} className={`card p-6 transition-all hover:shadow-lg ${!fb.isRead ? 'border-l-4 border-l-primary' : ''}`}>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${fb.type === 'contact' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {fb.type}
                  </span>
                  {!fb.isRead && <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded-full">UNREAD</span>}
                  {fb.rating && <span className="text-sm">{stars(fb.rating)}</span>}
                  <span className="text-[10px] text-gray-400">{new Date(fb.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <h3 className="font-black text-gray-800 text-lg mb-1">{fb.subject}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{fb.message}</p>
                <div className="text-xs text-gray-400 space-x-4">
                  <span>👤 {fb.name}</span>
                  <span>📧 {fb.email}</span>
                  {fb.phone && <span>📞 {fb.phone}</span>}
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                {!fb.isRead && (
                  <button onClick={() => markRead(fb._id)}
                    className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold">
                    ✓ Mark Read
                  </button>
                )}
                <button onClick={() => handleDelete(fb._id)}
                  className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-20 text-gray-400 italic">No feedback messages yet.</p>}
      </div>
    </div>
  );
};

export default AdminFeedback;
