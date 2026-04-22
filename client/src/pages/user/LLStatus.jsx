import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, DELIVERY_STAGES } from '../../utils/constants';

const LLStatus = () => {
  const [ll, setLL] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLL = async () => {
      try {
        const { data } = await api.get('/ll/my');
        setLL(data[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLL();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner text="Fetching delivery status..." /></div>;

  if (!ll) return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="text-9xl mb-8">📭</div>
      <h2 className="text-3xl font-black text-gray-800">No active LL application found.</h2>
      <p className="text-gray-500 mt-2 font-medium">Apply for a Learning License to see it here.</p>
    </div>
  );

  const currentStageIdx = DELIVERY_STAGES.indexOf(ll.deliveryStatus || 'Processing');

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Application Tracker</h1>
          <p className="text-gray-500 font-medium">Real-time status of your Learning License delivery.</p>
        </div>
        <div className="text-right">
          <StatusBadge status={ll.status} />
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3 underline decoration-primary decoration-4 underline-offset-4">ID: {ll._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="card p-12">
            <h2 className="text-2xl font-black text-gray-800 mb-12">Delivery Progress</h2>
            <div className="relative pl-12 border-l-8 border-gray-100 space-y-20">
              {DELIVERY_STAGES.map((stage, i) => {
                const isCompleted = i < currentStageIdx;
                const isCurrent = i === currentStageIdx;
                const isPending = i > currentStageIdx;

                return (
                  <div key={stage} className="relative">
                    <div className={`absolute -left-[54px] top-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-8 border-white shadow-xl transition-all duration-700 ${isCompleted ? 'bg-teal text-white' : isCurrent ? 'bg-primary text-white scale-125' : 'bg-gray-100 text-gray-400'}`}>
                      {isCompleted ? '✓' : i + 1}
                    </div>
                    <div>
                      <h3 className={`text-xl font-black transition-all ${isPending ? 'text-gray-300' : 'text-gray-800'}`}>{stage}</h3>
                      <p className="text-sm text-gray-500 mt-1 font-medium">
                        {isCompleted ? 'This step was finalized.' : isCurrent ? 'Your application is currently at this stage.' : 'Waiting for previous steps to complete.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card bg-blue-50 border-blue-100 p-8">
             <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Estimated Delivery</h3>
             <p className="text-4xl font-black text-gray-800 leading-none">{formatDate(ll.expectedDeliveryDate)}</p>
             <div className="w-full h-1 bg-primary/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${((currentStageIdx + 1) / DELIVERY_STAGES.length) * 100}%` }} />
             </div>
          </div>

          <div className="card p-8 bg-gray-50 border-gray-100">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Summary</h3>
             <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex justify-between"><span className="text-sm text-gray-500 font-bold">Category</span><span className="text-sm font-black text-gray-800">{ll.vehicleType}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500 font-bold">Test Score</span><span className="text-sm font-black text-primary">{ll.testScore}/15</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500 font-bold">Attempt</span><span className="text-sm font-black text-gray-800">#{ll.attemptCount}</span></div>
             </div>
             <button className="w-full text-center mt-6 text-xs font-black text-primary hover:underline uppercase tracking-widest">Download Receipt (PDF)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLStatus;
