import React from 'react';
import SkeletonCard from './SkeletonCard';

const PageSkeleton = () => {
  return (
    <div className="w-full py-6">
      {/* Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;