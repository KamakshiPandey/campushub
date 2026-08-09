import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, UserCheck, Wifi } from 'lucide-react';
import { formatCurrency, formatDate, getImageUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';

const RoommateCard = ({ post }) => {
  const owner = post.owner || {};

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-lg hover:border-indigo-500/40 flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* User Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
          <img
            src={getImageUrl(owner.avatar)}
            alt={owner.name || 'User'}
            className="h-11 w-11 rounded-full object-cover border-2 border-indigo-500/40"
          />
          <div>
            <h4 className="text-sm font-bold text-white">{owner.name || 'Anonymous Student'}</h4>
            <p className="text-xs text-slate-400">{owner.college || 'Campus Student'}</p>
          </div>
        </div>

        {/* Title & Details */}
        <div>
          <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-indigo-300">
            {post.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Meta badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span><strong className="text-white">{formatCurrency(post.budget)}</strong>/mo</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <MapPin className="h-4 w-4 text-indigo-400" />
            <span className="truncate">{post.location}</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <UserCheck className="h-4 w-4 text-violet-400" />
            <span className="capitalize">{post.genderPreference} Preferred</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>{formatDate(post.moveInDate)}</span>
          </div>
        </div>

        {/* Amenities preview */}
        {post.amenities && post.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-[10px] font-medium text-indigo-300">
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">Posted by Student</span>
        <Link
          to={`/roommates/${post.id}`}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-600/20"
        >
          View Profile & Chat
        </Link>
      </div>
    </motion.div>
  );
};

export default RoommateCard;
