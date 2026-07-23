import React from 'react';
import SkeletonCard from './SkeletonCard';

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      {/* Topbar/Header Placeholder */}
      <div className="h-20 w-full bg-white/5 rounded-[32px] mb-10 animate-pulse flex items-center px-8">
        <div className="w-1/4 h-6 bg-white/10 rounded-lg"></div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;