import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import LocationPickerModal from '../components/common/LocationPickerModal';
import { Users, MapPin, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const availableAmenities = ['WiFi', 'Air Conditioning', 'In-Unit Laundry', 'Private Bathroom', 'Furnished', 'Parking Space', 'Gym Access', 'Pet Friendly'];

const CreateRoommate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    genderPreference: 'any',
    moveInDate: '',
    lat: '',
    lng: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleLocationSelected = (loc) => {
    setFormData({
      ...formData,
      lat: loc.lat,
      lng: loc.lng,
    });
    toast.success('Location pin set on map');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        amenities: selectedAmenities,
      };

      const res = await API.post('/roommates', payload);
      toast.success('Roommate post published!');
      navigate(`/roommates/${res.data.roommate.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="glass-panel border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="h-7 w-7 text-indigo-500" />
            <span>Post a Roommate Listing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Specify your budget, ideal location, and room preferences to find compatible campus roommates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Post Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Looking for 1 Roommate for 2B2B Apartment near Campus"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Max Budget ($/mo) *</label>
              <input
                type="number"
                name="budget"
                required
                placeholder="750"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Gender Preference</label>
              <select
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="any">Any Preference</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Move-In Date *</label>
              <input
                type="date"
                name="moveInDate"
                required
                value={formData.moveInDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Location / Neighborhood *</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. University Heights / College Ave"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Map Pin Selector Button */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-indigo-400" />
              <div>
                <h4 className="text-xs font-semibold text-white">Apartment/Housing Map Pin</h4>
                <p className="text-[10px] text-slate-400">
                  {formData.lat ? `Pin set: ${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}` : 'No map pin selected'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMapModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-medium"
            >
              {formData.lat ? 'Change Pin' : 'Pick on Map'}
            </button>
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Amenities & Perks</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableAmenities.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Description & Lifestyle *</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe yourself, study habits, quiet hours, lease duration, or lease transfer details..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all mt-6"
          >
            <Check className="h-4 w-4" />
            <span>{submitting ? 'Publishing...' : 'Publish Roommate Post'}</span>
          </button>
        </form>
      </div>

      <LocationPickerModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        onSelectLocation={handleLocationSelected}
      />
    </div>
  );
};

export default CreateRoommate;
