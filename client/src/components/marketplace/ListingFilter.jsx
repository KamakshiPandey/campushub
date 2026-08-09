import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const categories = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Other'];
const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];

const ListingFilter = ({ filters, setFilters, onReset }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, setFilters]);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4 mb-8">
      {/* Top Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search textbooks, laptops, dorm items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value === 'All' ? '' : e.target.value, page: 1 }))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Condition</label>
          <select
            value={filters.condition || 'All'}
            onChange={(e) => setFilters((prev) => ({ ...prev, condition: e.target.value === 'All' ? '' : e.target.value, page: 1 }))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            {conditions.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
          <select
            value={filters.listingType || 'All'}
            onChange={(e) => setFilters((prev) => ({ ...prev, listingType: e.target.value === 'All' ? '' : e.target.value, page: 1 }))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Types</option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Sort By</label>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end col-span-2 sm:col-span-1">
          <button
            onClick={() => {
              setSearchTerm('');
              onReset();
            }}
            className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingFilter;
