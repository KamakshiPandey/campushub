import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ListingCard from '../components/marketplace/ListingCard';
import ListingFilter from '../components/marketplace/ListingFilter';
import RecentlyViewed from '../components/marketplace/RecentlyViewed';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { getRecentlyViewed } from '../utils/helpers';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    condition: '',
    listingType: '',
    sortBy: 'newest',
    page: 1,
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.listingType) params.append('listingType', filters.listingType);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      params.append('page', filters.page || 1);
      params.append('limit', 12);

      const res = await API.get(`/listings?${params.toString()}`);
      setListings(res.data.listings || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed());
  }, []);

  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      condition: '',
      listingType: '',
      sortBy: 'newest',
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-indigo-500" />
            <span>Campus Marketplace</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse items posted for sale or rent by students across campus
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <ListingFilter filters={filters} setFilters={setFilters} onReset={handleReset} />

      {/* Main Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={8} />
      ) : listings.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <p className="text-base font-semibold text-slate-300">No marketplace listings found.</p>
          <p className="text-xs text-slate-500">Try broadening your search term or resetting filters.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} />
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

      {/* Recently Viewed Carousel/List */}
      <RecentlyViewed items={recentlyViewed} />
    </div>
  );
};

export default Marketplace;
