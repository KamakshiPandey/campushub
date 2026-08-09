import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import RoommateCard from '../components/roommate/RoommateCard';
import RoommateFilter from '../components/roommate/RoommateFilter';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Users, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const RoommateFinder = () => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    genderPreference: 'any',
    maxBudget: '',
    location: '',
    page: 1,
  });

  const fetchRoommates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.genderPreference) params.append('genderPreference', filters.genderPreference);
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
      if (filters.location) params.append('location', filters.location);
      params.append('page', filters.page || 1);
      params.append('limit', 12);

      const res = await API.get(`/roommates?${params.toString()}`);
      setRoommates(res.data.roommates || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error('Error fetching roommate posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, [filters]);

  const handleReset = () => {
    setFilters({
      search: '',
      genderPreference: 'any',
      maxBudget: '',
      location: '',
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <Users className="h-8 w-8 text-indigo-500" />
            <span>Campus Roommate Finder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover compatible roommates, filter preferences, and chat directly
          </p>
        </div>

        <Link
          to="/create-roommate"
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 w-fit"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Roommate Request</span>
        </Link>
      </div>

      {/* Filters */}
      <RoommateFilter filters={filters} setFilters={setFilters} onReset={handleReset} />

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : roommates.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <p className="text-base font-semibold text-slate-300">No roommate posts found.</p>
          <p className="text-xs text-slate-500">Try adjusting your budget or gender preference filters.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roommates.map((post) => (
              <RoommateCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-3 pt-8">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="text-xs font-semibold text-slate-300">
                Page {filters.page} of {totalPages}
              </span>

              <button
                disabled={filters.page >= totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoommateFinder;
