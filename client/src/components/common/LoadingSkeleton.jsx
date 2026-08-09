import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 4 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((_, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-4 animate-pulse border border-slate-800/60">
            <div className="bg-slate-800/80 h-48 rounded-xl w-full mb-4"></div>
            <div className="h-4 bg-slate-800/80 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-800/60 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="h-5 bg-slate-800/80 rounded w-1/3"></div>
              <div className="h-8 bg-slate-800/80 rounded-lg w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {items.map((_, idx) => (
          <div key={idx} className="glass-card rounded-xl p-4 flex items-center space-x-4 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-slate-800"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              <div className="h-3 bg-slate-800/60 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
      <div className="h-6 bg-slate-800 rounded w-1/3"></div>
      <div className="h-4 bg-slate-800/60 rounded w-full"></div>
      <div className="h-4 bg-slate-800/60 rounded w-5/6"></div>
    </div>
  );
};

export default LoadingSkeleton;
