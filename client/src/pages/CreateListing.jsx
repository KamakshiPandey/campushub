import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import LocationPickerModal from '../components/common/LocationPickerModal';
import { PlusCircle, Upload, MapPin, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair'];

const CreateListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    listingType: 'sell',
    category: 'Books',
    condition: 'Good',
    location: '',
    lat: '',
    lng: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
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
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      images.forEach((img) => {
        data.append('images', img);
      });

      const res = await API.post('/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Listing created successfully!');
      navigate(`/marketplace/${res.data.listing.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
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
            <PlusCircle className="h-7 w-7 text-indigo-500" />
            <span>Create New Marketplace Listing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the details to list your item for sale or rent on campus
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Item Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Organic Chemistry Textbook (9th Ed)"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                placeholder="45.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Listing Type</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="sell">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Campus Location Name</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Science Library / North Quad"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Map Location Pin Selector Button */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-indigo-400" />
              <div>
                <h4 className="text-xs font-semibold text-white">Campus Map Coordinates</h4>
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

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Provide item details, edition, inclusions, or pickup arrangements..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Upload Item Photos (Max 5)</label>
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-500/60 transition-colors">
              <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400 mb-2">Drag & drop photos or browse files</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer inline-block"
              >
                Select Photos
              </label>
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex space-x-3 mt-3 overflow-x-auto">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt="preview" className="h-16 w-16 rounded-xl object-cover border border-indigo-500/50" />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all mt-6"
          >
            <Check className="h-4 w-4" />
            <span>{submitting ? 'Publishing Listing...' : 'Publish Listing'}</span>
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

export default CreateListing;
