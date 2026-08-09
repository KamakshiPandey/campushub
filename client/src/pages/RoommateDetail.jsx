import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';
import MapView from '../components/maps/MapView';
import ReviewList from '../components/reviews/ReviewList';
import ReviewModal from '../components/reviews/ReviewModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { MapPin, Calendar, DollarSign, UserCheck, MessageSquare, Star, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const RoommateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [roommate, setRoommate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownerReviews, setOwnerReviews] = useState([]);
  const [ownerAvgRating, setOwnerAvgRating] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchRoommate = async () => {
    try {
      const res = await API.get(`/roommates/${id}`);
      const post = res.data.roommate;
      setRoommate(post);

      if (post && post.owner) {
        fetchOwnerReviews(post.owner.id);
      }
    } catch (error) {
      toast.error('Roommate post not found');
      navigate('/roommates');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerReviews = async (ownerId) => {
    try {
      const res = await API.get(`/reviews/user/${ownerId}`);
      const revs = res.data.reviews || [];
      setOwnerReviews(revs);
      if (revs.length > 0) {
        const avg = (revs.reduce((sum, r) => sum + r.rating, 0) / revs.length).toFixed(1);
        setOwnerAvgRating(Number(avg));
      }
    } catch (error) {
      console.error('Error fetching owner reviews:', error);
    }
  };

  useEffect(() => {
    fetchRoommate();
  }, [id]);

  const handleStartChat = async () => {
    if (!currentUser) {
      toast.error('Please login to message the owner');
      navigate('/login');
      return;
    }

    if (currentUser.id === roommate.owner.id) {
      toast.error('This is your own post!');
      return;
    }

    try {
      const res = await API.post('/chats', { targetUserId: roommate.owner.id });
      navigate('/chats', { state: { chat: res.data.chat } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not start chat');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton type="details" />
      </div>
    );
  }

  if (!roommate) return null;

  const owner = roommate.owner || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/roommates"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Roommate Finder</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h1 className="text-2xl font-bold text-white">{roommate.title}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Budget</span>
                <span className="text-base font-bold text-emerald-400">{formatCurrency(roommate.budget)}/mo</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Location</span>
                <span className="text-xs font-semibold text-slate-200 truncate block">{roommate.location}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Preference</span>
                <span className="text-xs font-semibold text-slate-200 capitalize">{roommate.genderPreference}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Move-In</span>
                <span className="text-xs font-semibold text-slate-200">{formatDate(roommate.moveInDate)}</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-400 mb-1">About the Living Arrangement</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {roommate.description}
              </p>
            </div>

            {/* Amenities list */}
            {roommate.amenities && roommate.amenities.length > 0 && (
              <div className="pt-3">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Included Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {roommate.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/40 text-indigo-300 text-xs font-medium flex items-center space-x-1.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map Location */}
          {roommate.lat && roommate.lng && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Preferred Location Area</span>
              </h3>
              <MapView lat={roommate.lat} lng={roommate.lng} title={roommate.title} />
            </div>
          )}
        </div>

        {/* Right Column: Owner Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img
                  src={getImageUrl(owner.avatar)}
                  alt={owner.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-indigo-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{owner.name}</h4>
                  <p className="text-xs text-slate-400">{owner.college || 'Campus Student'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{ownerAvgRating}</span>
              </div>
            </div>

            {owner.bio && (
              <p className="text-xs text-slate-300 italic bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                "{owner.bio}"
              </p>
            )}

            {currentUser && currentUser.id !== owner.id && (
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleStartChat}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat with Poster</span>
                </button>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1"
                  title="Leave Review"
                >
                  <Star className="h-4 w-4 text-amber-400" />
                </button>
              </div>
            )}
          </div>

          {/* Owner Reviews */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <ReviewList reviews={ownerReviews} avgRating={ownerAvgRating} />
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        targetUserId={owner.id}
        targetUserName={owner.name}
        onReviewSubmitted={() => fetchOwnerReviews(owner.id)}
      />
    </div>
  );
};

export default RoommateDetail;
