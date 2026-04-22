import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';

const OfficerSalaryPage = () => {
  const { user } = useAuth(); // logged-in officer
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalary = async () => {
    try {
      // backend should filter by officerId
      const res = await api.get(`/salary/officer/${user._id}`)
      setSalaries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchSalary();
  }, [user]);

  // Summary
  const totalPaid = salaries
    .filter(s => s.status === 'Paid')
    .reduce((a, s) => a + s.amount, 0);

  const totalPending = salaries
    .filter(s => s.status === 'Pending')
    .reduce((a, s) => a + s.amount, 0);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner text="Loading your salary..." />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Salary</h1>
        <p className="text-gray-500">
          View your monthly salary records and payment status.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Records', val: salaries.length, color: 'border-l-primary', icon: '📊' },
          { label: 'Total Paid (₹)', val: `₹${totalPaid.toLocaleString()}`, color: 'border-l-green-500', icon: '✅' },
          { label: 'Total Pending (₹)', val: `₹${totalPending.toLocaleString()}`, color: 'border-l-orange-400', icon: '⏳' },
        ].map((c, i) => (
          <div key={i} className={`card border-l-4 ${c.color} flex justify-between items-center`}>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {c.label}
              </p>
              <p className="text-2xl font-black text-gray-800">{c.val}</p>
            </div>
            <div className="text-2xl opacity-40">{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Salary Table */}
      <div className="card overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 mb-4 p-6 pb-0">
          Salary Records
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Month</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {salaries.map(s => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{s.month}</td>

                  <td className="p-4 font-black text-gray-800">
                    ₹{s.amount.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        s.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {s.notes || '-'}
                  </td>
                </tr>
              ))}

              {salaries.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400 italic">
                    No salary records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerSalaryPage;