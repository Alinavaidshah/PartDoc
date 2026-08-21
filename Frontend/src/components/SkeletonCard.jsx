import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-slate-200 h-[380px] animate-pulse">
      <div className="h-44 bg-slate-200 rounded-xl mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-slate-200 w-1/3 rounded-md" />
        <div className="h-5 bg-slate-200 w-full rounded-md" />
        <div className="h-4 bg-slate-200 w-1/2 rounded-md" />
      </div>
      <div className="mt-auto flex gap-2 pt-4 border-t border-slate-100">
        <div className="h-9 bg-slate-200 rounded-xl w-1/2" />
        <div className="h-9 bg-slate-200 rounded-xl w-1/2" />
      </div>
    </div>
  );
};

export default SkeletonCard;