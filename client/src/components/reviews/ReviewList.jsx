import React from 'react';
import { Star } from 'lucide-react';
import { getImageUrl, formatDate } from '../../utils/helpers';

const ReviewList = ({ reviews = [], avgRating = 0 }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Peer Ratings & Reviews</h3>
          <p className="text-xs text-slate-400">Based on {reviews.length} peer feedback entries</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Star className="h-5 w-5 fill-amber-400" />
          <span className="text-lg font-extrabold">{avgRating}</span>
          <span className="text-xs text-amber-300">/ 5.0</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs glass-panel rounded-xl">
          No reviews yet for this user.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div key={rev.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={getImageUrl(rev.reviewer?.avatar)}
                    alt={rev.reviewer?.name || 'Reviewer'}
                    className="h-8 w-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">{rev.reviewer?.name || 'Student'}</h5>
                    <span className="text-[10px] text-slate-500">{formatDate(rev.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-1">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
