import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel border border-slate-800 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
        <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
          <AlertCircle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-white">404</h1>
          <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The page or campus resource you were looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
