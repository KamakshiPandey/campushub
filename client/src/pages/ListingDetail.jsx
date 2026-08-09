import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getImageUrl, addRecentlyViewed } from '../utils/helpers';
import MapView from '../components/maps/MapView';
import ReviewList from '../components/reviews/ReviewList';
import ReviewModal from '../components/reviews/ReviewModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Eye, Tag, MapPin, Calendar, MessageSquare, Star, ArrowLeft, Phone, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [sellerAvgRating, setSellerAvgRating] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Reservation countdown time in seconds
  const [paying, setPaying] = useState(false);

  const fetchListing = async () => {
    try {
      const res = await API.get(`/listings/${id}`);
      const item = res.data.listing;
      setListing(item);

      // Store in recently viewed
      if (item) {
        addRecentlyViewed({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.images && item.images.length > 0 ? item.images[0] : null,
        });

        if (item.seller) {
          fetchSellerReviews(item.seller.id);
        }
      }
    } catch (error) {
      toast.error('Listing not found');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerReviews = async (sellerId) => {
    try {
      const res = await API.get(`/reviews/user/${sellerId}`);
      const revs = res.data.reviews || [];
      setSellerReviews(revs);
      if (revs.length > 0) {
        const avg = (revs.reduce((sum, r) => sum + r.rating, 0) / revs.length).toFixed(1);
        setSellerAvgRating(Number(avg));
      }
    } catch (error) {
      console.error('Error fetching seller reviews:', error);
    }
  };

  // Dynamically load Razorpay standard checkout overlay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    fetchListing();

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  // Handle countdown timer for listing reservations
  useEffect(() => {
    if (!listing || listing.status !== 'reserved' || !listing.reservedAt) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const reservationDuration = 15 * 60 * 1000; // 15 mins
      const elapsed = new Date() - new Date(listing.reservedAt);
      const remaining = Math.max(0, Math.floor((reservationDuration - elapsed) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        fetchListing(); // Re-fetch to clear reservation UI
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [listing]);

  const handleStartChat = async () => {
    if (!currentUser) {
      toast.error('Please login to message the seller');
      navigate('/login');
      return;
    }

    if (currentUser.id === listing.seller.id) {
      toast.error('This is your own listing!');
      return;
    }

    try {
      const res = await API.post('/chats', { targetUserId: listing.seller.id, listingId: listing.id });
      navigate('/chats', { state: { chat: res.data.chat } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not start chat');
    }
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      toast.error('Please login to buy items');
      navigate('/login');
      return;
    }

    setPaying(true);
    try {
      // 1. Reserve Listing
      await API.post(`/payments/listings/${listing.id}/reserve`);
      
      // 2. Create Payment Order
      const orderRes = await API.post('/payments/create-order', { listingId: listing.id });
      const { order, payment } = orderRes.data;

      // 3. Launch Razorpay Options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'CampusHub',
        description: `Purchase of ${listing.title}`,
        order_id: order.id,
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: '#6366f1',
        },
        handler: async (response) => {
          try {
            await API.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Purchase complete! Thank you.');
            fetchListing();
          } catch (err) {
            toast.error('Payment verification failed.');
            fetchListing();
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Checkout dismissed.');
            setPaying(false);
            fetchListing();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order creation failed');
      setPaying(false);
      fetchListing();
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton type="details" />
      </div>
    );
  }

  if (!listing) return null;

  const seller = listing.seller || {};
  const images = listing.images || [];

  const isReservedByMe = listing.status === 'reserved' && listing.reservedBy === currentUser?.id;
  const isReservedByOther = listing.status === 'reserved' && listing.reservedBy !== currentUser?.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Link */}
      <Link
        to="/marketplace"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Gallery & Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 h-96 w-full relative bg-slate-900">
            <img
              src={images.length > 0 ? getImageUrl(images[selectedImage]) : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
              alt={listing.title}
              className="h-full w-full object-contain"
            />
            <div className="absolute top-4 left-4 flex space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md ${
                listing.status === 'sold' ? 'bg-rose-500 text-white' : listing.status === 'reserved' ? 'bg-amber-400' : 'bg-emerald-500'
              }`}>
                {listing.status}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? 'border-indigo-500 scale-95' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Map Location Component */}
          {listing.lat && listing.lng && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Campus Location Map</span>
              </h3>
              <MapView lat={listing.lat} lng={listing.lng} title={listing.title} />
            </div>
          )}
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                <Tag className="h-3.5 w-3.5" />
                <span>{listing.category}</span>
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Eye className="h-3.5 w-3.5 text-indigo-400" />
                <span>{listing.viewsCount} Views</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
            <div className="text-3xl font-extrabold text-indigo-400">{formatCurrency(listing.price)}</div>

            {/* Lock Reservation Countdown Timer */}
            {listing.status === 'reserved' && timeLeft > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex justify-between items-center">
                <span>⚠️ Listing locked for purchase</span>
                <span className="font-mono font-bold">{formatTimer(timeLeft)} remaining</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block">Condition</span>
                <span className="font-semibold text-slate-200">{listing.condition}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block">Location</span>
                <span className="font-semibold text-slate-200">{listing.location || 'On Campus'}</span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-400 mb-1">Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={getImageUrl(seller.avatar)}
                    alt={seller.name}
                    className="h-10 w-10 rounded-full object-cover border border-indigo-500/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{seller.name}</h4>
                    <p className="text-[10px] text-slate-400">{seller.college || 'Campus Student'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{sellerAvgRating}</span>
                </div>
              </div>

              {currentUser && currentUser.id !== seller.id && (
                <div className="flex flex-col space-y-2 pt-2">
                  <div className="flex space-x-2">
                    {/* Messaging restricted on sold listings unless buyer/seller */}
                    {listing.status !== 'sold' || listing.buyerId === currentUser.id ? (
                      <button
                        onClick={handleStartChat}
                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with Seller</span>
                      </button>
                    ) : (
                      <div className="flex-1 py-3 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
                        Item no longer available
                      </div>
                    )}

                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1"
                      title="Leave Review"
                    >
                      <Star className="h-4 w-4 text-amber-400" />
                    </button>
                  </div>

                  {/* Buy Flow Button Controls */}
                  {listing.status === 'available' && (
                    <button
                      onClick={handleBuyNow}
                      disabled={paying}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1"
                    >
                      <span>Buy Now</span>
                    </button>
                  )}

                  {isReservedByMe && (
                    <button
                      onClick={handleBuyNow}
                      disabled={paying}
                      className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Complete Checkout ({formatTimer(timeLeft)})</span>
                    </button>
                  )}

                  {isReservedByOther && (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold border border-slate-700 cursor-not-allowed"
                    >
                      Reserved by another buyer
                    </button>
                  )}

                  {listing.status === 'sold' && (
                    <div className="w-full py-3 text-center bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold">
                      Sold out
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Seller Reviews */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <ReviewList reviews={sellerReviews} avgRating={sellerAvgRating} />
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        targetUserId={seller.id}
        targetUserName={seller.name}
        onReviewSubmitted={() => fetchSellerReviews(seller.id)}
      />
    </div>
  );
};

export default ListingDetail;
