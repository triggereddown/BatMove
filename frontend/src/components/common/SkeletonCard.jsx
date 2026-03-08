import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-bgCard border border-borderLayer min-w-[180px]">
      <div className="relative aspect-[2/3] skeleton-shimmer w-full"></div>
      <div className="p-3">
        <div className="h-3.5 rounded bg-bgSecondary mb-2 w-4/5 skeleton-shimmer"></div>
        <div className="h-2.5 rounded bg-bgSecondary w-1/2 skeleton-shimmer"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
