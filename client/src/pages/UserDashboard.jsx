import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getImageUrl } from '../utils/helpers';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import {
  LayoutDashboard,
  ShoppingBag,
  Eye,
  CheckCircle,
  PlusCircle,
  Trash2,
  Edit,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalListings: 0, totalViews: 0, totalSoldRented: 0 });
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyData = async () => {
    try {
      const res = await API.get('/listings/my-listings');
      setStats(res.data.stats || { totalListings: 0, totalViews: 0, totalSoldRented: 0 });
      setMyListings(res.data.listings || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/listings/${listingId}`);
      toast.success('Listing deleted');
      fetchMyData();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const handleToggleStatus = async (listing, newStatus) => {
    try {
      await API.put(`/listings/${listing.id}`, { status: newStatus });
      toast.success(`Listing status set to ${newStatus}`);
      fetchMyData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
            <LayoutDashboard className="h-8 w-8 text-indigo-500" />
            <span>Seller Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track your item views, sales, and listing performance</p>
        </div>

        <div className="flex space-x-3">
          <Link
            to="/profile"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5"
          >
            <User className="h-4 w-4" />
            <span>Edit Profile</span>
          </Link>

          <Link
            to="/create-listing"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Listing</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Listings</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalListings}</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Views</span>
            <div className="h-8 w-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalViews}</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Items Sold / Rented</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalSoldRented}</div>
        </div>
      </div>

      {/* Per-Listing Performance Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <h3 className="text-base font-bold text-white">Per-Listing Performance</h3>

        {myListings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            You have not posted any listings yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40">
                    <td className="p-3 flex items-center space-x-3">
                      <img
                        src={item.images && item.images.length > 0 ? getImageUrl(item.images[0]) : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="h-10 w-10 rounded-lg object-cover border border-slate-800"
                      />
                      <span className="font-semibold text-slate-200 truncate max-w-[200px]">{item.title}</span>
                    </td>
                    <td className="p-3 font-bold text-indigo-400">{formatCurrency(item.price)}</td>
                    <td className="p-3 text-slate-400">{item.category}</td>
                    <td className="p-3 font-semibold text-slate-200">{item.viewsCount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          item.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {item.status === 'active' ? (
                        <button
                          onClick={() => handleToggleStatus(item, 'sold')}
                          className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-md text-[10px] font-semibold"
                        >
                          Mark Sold
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(item, 'active')}
                          className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-md text-[10px] font-semibold"
                        >
                          Reactivate
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="p-1.5 rounded-md text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
