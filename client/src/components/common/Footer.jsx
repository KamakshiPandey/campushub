import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Campus<span className="text-indigo-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The all-in-one student network to buy, sell, rent, find roommates, and build campus trust effortlessly.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/marketplace?category=Books" className="hover:text-indigo-400 transition-colors">Textbooks & Notes</Link></li>
              <li><Link to="/marketplace?category=Electronics" className="hover:text-indigo-400 transition-colors">Electronics & Gadgets</Link></li>
              <li><Link to="/marketplace?category=Furniture" className="hover:text-indigo-400 transition-colors">Dorm Furniture</Link></li>
              <li><Link to="/marketplace?listingType=rent" className="hover:text-indigo-400 transition-colors">Rentals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Roommate Finder</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/roommates" className="hover:text-indigo-400 transition-colors">Browse Listings</Link></li>
              <li><Link to="/create-roommate" className="hover:text-indigo-400 transition-colors">Post Roommate Needed</Link></li>
              <li><Link to="/roommates?genderPreference=female" className="hover:text-indigo-400 transition-colors">Female Preference</Link></li>
              <li><Link to="/roommates?genderPreference=male" className="hover:text-indigo-400 transition-colors">Male Preference</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Trust & Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5"><Shield className="h-3.5 w-3.5 text-indigo-400" /> <span>Verified Student Accounts</span></li>
              <li className="flex items-center space-x-1.5"><Sparkles className="h-3.5 w-3.5 text-indigo-400" /> <span>Peer Ratings & Reviews</span></li>
              <li className="flex items-center space-x-1.5"><Heart className="h-3.5 w-3.5 text-rose-400" /> <span>Built for College Students</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusHub. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for College Campuses worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
