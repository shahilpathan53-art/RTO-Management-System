import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-orange-100 text-orange-600 border-orange-200',
    'Approved': 'bg-teal-100 text-teal-600 border-teal-200',
    'Rejected': 'bg-red-100 text-red-600 border-red-200',
    'Success': 'bg-teal-100 text-teal-600 border-teal-200',
    'Issued': 'bg-blue-100 text-blue-600 border-blue-200',
    'Pass': 'bg-teal-100 text-teal-600 border-teal-200',
    'Fail': 'bg-red-100 text-red-600 border-red-200',
    'Delivered': 'bg-teal-100 text-teal-600 border-teal-200',
  };

  const currentStyle = styles[status] || 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${currentStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
