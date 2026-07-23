import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full bg-[#1a2d33] rounded-[32px] p-6 flex flex-col shadow-lg border border-white/5 h-[420px] animate-pulse">
      <div className="h-48 bg-white/5 rounded-2xl mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-white/10 w-2/3 rounded-full" />
        <div className="h-6 bg-white/10 w-full rounded-lg" />
        <div className="h-4 bg-white/10 w-1/2 rounded-full" />
      </div>
      <div className="mt-auto h-12 bg-white/10 rounded-full w-full" />
    </div>
  );
};

export default SkeletonCard;