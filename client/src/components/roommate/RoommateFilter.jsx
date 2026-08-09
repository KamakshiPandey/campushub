import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';

const RoommateFilter = ({ filters, setFilters, onReset }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, setFilters]);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4 mb-8">
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search location, budget, room preferences..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Gender Preference */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Gender Preference</label>
          <select
            value={filters.genderPreference || 'any'}
            onChange={(e) => setFilters((prev) => ({ ...prev, genderPreference: e.target.value, page: 1 }))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="any">Any Preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Max Budget */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Max Budget ($/mo)</label>
          <input
            type="number"
            placeholder="e.g. 800"
            value={filters.maxBudget || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxBudget: e.target.value, page: 1 }))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Reset */}
        <div className="flex items-end">
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

export default RoommateFilter;
