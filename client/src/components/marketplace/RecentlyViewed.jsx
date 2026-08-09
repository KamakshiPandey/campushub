import React from 'react';
import { Link } from 'react-router-dom';
import { History, Eye } from 'lucide-react';
import { formatCurrency, getImageUrl } from '../../utils/helpers';

const RecentlyViewed = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
        <History className="h-5 w-5 text-indigo-400" />
        <h3 className="text-base font-semibold text-white">Recently Viewed Items</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/marketplace/${item.id}`}
            className="group glass-card p-2 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all"
          >
            <div className="h-28 w-full bg-slate-900 rounded-lg overflow-hidden mb-2">
              <img
                src={item.image ? getImageUrl(item.image) : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-indigo-300">{item.title}</p>
            <p className="text-xs font-bold text-indigo-400 mt-0.5">{formatCurrency(item.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
