import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Tag, MapPin } from 'lucide-react';
import { formatCurrency, getImageUrl } from '../../utils/helpers';
import { motion } from 'framer-motion';

const ListingCard = ({ listing }) => {
  const firstImage = listing.images && listing.images.length > 0
    ? getImageUrl(listing.images[0])
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 shadow-lg hover:shadow-indigo-500/10 hover:border-slate-700 flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
        <div className="relative h-48 w-full bg-slate-900 overflow-hidden group">
          <img
            src={firstImage}
            alt={listing.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge */}
          <div className="absolute top-3 left-3 flex space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                listing.listingType === 'rent'
                  ? 'bg-amber-500/90 text-slate-950 backdrop-blur-md'
                  : 'bg-emerald-500/90 text-slate-950 backdrop-blur-md'
              }`}
            >
              {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-950/70 text-slate-200 backdrop-blur-md border border-slate-700/50">
              {listing.condition}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-xs text-slate-300 backdrop-blur-md">
            <Eye className="h-3.5 w-3.5 text-indigo-400" />
            <span>{listing.viewsCount || 0}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-400 flex items-center space-x-1">
              <Tag className="h-3 w-3" />
              <span>{listing.category}</span>
            </span>
            {listing.location && (
              <span className="text-xs text-slate-400 flex items-center space-x-1 max-w-[120px] truncate">
                <MapPin className="h-3 w-3 text-slate-500" />
                <span>{listing.location}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {listing.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block">Price</span>
          <span className="text-lg font-bold text-indigo-400">{formatCurrency(listing.price)}</span>
        </div>

        <Link
          to={`/marketplace/${listing.id}`}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-600/20"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default ListingCard;
