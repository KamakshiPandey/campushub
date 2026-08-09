import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  MessageSquare,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Laptop,
  Sofa,
  Bike,
} from 'lucide-react';
import API from '../services/api';
import ListingCard from '../components/marketplace/ListingCard';
import RoommateCard from '../components/roommate/RoommateCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [featuredRoommates, setFeaturedRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, roommatesRes] = await Promise.all([
          API.get('/listings?limit=4'),
          API.get('/roommates?limit=3'),
        ]);
        setFeaturedListings(listingsRes.data.listings || []);
        setFeaturedRoommates(roommatesRes.data.roommates || []);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>The #1 All-in-One College Student Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight"
          >
            Your Campus Marketplace & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-500 bg-clip-text text-transparent">
              Roommate Network
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Buy & sell dorm gear, textbooks, and electronics with verified peers. Find your ideal roommate with map-based locations and direct real-time chat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/marketplace"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Explore Marketplace</span>
            </Link>

            <Link
              to="/roommates"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-card border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold flex items-center justify-center space-x-2"
            >
              <Users className="h-5 w-5 text-indigo-400" />
              <span>Find a Roommate</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Campus Marketplace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Buy, sell, or rent textbooks, gadgets, and furniture cleanly with campus peers.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Roommate Finder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter by budget, move-in date, location, and lifestyle preferences.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Real-Time Messaging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Socket.io instant 1-on-1 chat with online status and email alerts.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Peer Ratings & Trust</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified campus profiles with rating history and moderation safeguards.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Marketplace Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Fresh Marketplace Listings</h2>
            <p className="text-xs text-slate-400">Latest items posted by students near you</p>
          </div>

          <Link
            to="/marketplace"
            className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </section>

      {/* Roommates Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Roommates Looking for Places</h2>
            <p className="text-xs text-slate-400">Connect with students seeking compatible roommates</p>
          </div>

          <Link
            to="/roommates"
            className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRoommates.map((post) => (
              <RoommateCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
