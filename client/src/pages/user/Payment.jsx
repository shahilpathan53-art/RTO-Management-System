import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { serviceType, applicationId } = location.state || {};
  const amounts = { 'LL': 500, 'DL': 1000, 'Vehicle': 3500 };
  const currentAmount = amounts[serviceType] || 250;

  const handlePayment = async () => {
    setLoading(true);
    // Simulate gateway latency
    setTimeout(async () => {
      try {
        await api.post('/payment/create', { applicationId, serviceType, amount: currentAmount });
        toast.success('Payment Secured! Redirecting to next step...');
        
        if (serviceType === 'LL') navigate('/user/ll-test', { state: { llId: applicationId } });
        else navigate('/user/dashboard');
      } catch (err) {
        toast.error('Transaction Failed');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  if (!applicationId) return <div className="py-24 text-center"><h3 className="font-black">Invalid Transaction Request</h3></div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-24 animate-fade">
      <div className="card p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-teal to-accent" />
        <div className="text-center mb-10">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Checkout Security</p>
           <h2 className="text-3xl font-black text-gray-800">Secure Payment Gateway</h2>
        </div>

        <div className="space-y-6 mb-10 bg-gray-50 rounded-3xl p-8 border border-gray-100">
           <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-500">Service Category</span><span className="font-black text-gray-800">{serviceType} Fee</span></div>
           <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-500">Application ID</span><span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border overflow-hidden truncate max-w-[150px]">{applicationId}</span></div>
           <div className="pt-6 border-t border-gray-200 flex justify-between items-center"><span className="text-lg font-black text-gray-800">Final Amount</span><span className="text-3xl font-black text-primary">₹{currentAmount}</span></div>
        </div>

        <div className="space-y-4">
           <button onClick={handlePayment} disabled={loading} className="btn-primary w-full py-5 text-xl tracking-tight shadow-xl flex items-center justify-center gap-3">
              {loading ? <Spinner size="sm" text="" /> : 'Simulate Pay via UPI/Card'}
           </button>
           <p className="text-center text-[10px] font-bold text-gray-400 uppercase">128-bit Encryption Enabled • Trusted by GOI</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
