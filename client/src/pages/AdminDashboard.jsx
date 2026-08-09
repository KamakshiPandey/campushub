import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { getImageUrl } from '../utils/helpers';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { ShieldCheck, Users, ShoppingBag, Home as HomeIcon, MessageSquare, Ban, CheckCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
      ]);
      setStats(statsRes.data.stats);
      setUsersList(usersRes.data.users || []);
    } catch (error) {
      toast.error('Failed to load admin panel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBan = async (targetUser) => {
    try {
      const res = await API.put(`/admin/users/${targetUser.id}/ban`);
      toast.success(res.data.message);
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-emerald-400" />
          <span>Admin Moderation Panel</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Platform overview, user management, and moderation controls</p>
      </div>

      {/* Platform Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Total Users</span>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Marketplace Listings</span>
            <div className="text-2xl font-bold text-indigo-400">{stats.totalListings}</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Roommate Listings</span>
            <div className="text-2xl font-bold text-violet-400">{stats.totalRoommates}</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Total Peer Reviews</span>
            <div className="text-2xl font-bold text-amber-400">{stats.totalReviews}</div>
          </div>
        </div>
      )}

      {/* Users Table & Ban Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Registered Users Moderation</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">College</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="p-3 flex items-center space-x-2.5">
                    <img
                      src={getImageUrl(u.avatar)}
                      alt={u.name}
                      className="h-8 w-8 rounded-full object-cover border border-slate-700"
                    />
                    <span className="font-semibold text-slate-200">{u.name}</span>
                  </td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3 text-slate-400">{u.college || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      u.role === 'admin' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      u.isBanned ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {u.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleBan(u)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold ${
                          u.isBanned
                            ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                            : 'bg-rose-600/20 text-rose-400 hover:bg-rose-600/30'
                        }`}
                      >
                        {u.isBanned ? 'Unban User' : 'Ban User'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
