import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Category, ShowcaseFilter } from '../types';
import { X, UploadCloud, Image as ImageIcon, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESET_IMAGES = [
  { label: 'Architectural Shadow', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Brutalist Monolith', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Atmospheric Seascape', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Minimalist Ceramic', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Desert Horizon', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Botanical Silhouette', url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85' }
];

export const UploadArtworkModal: React.FC = () => {
  const { isUploadModalOpen, closeUploadModal, uploadArtwork } = useApp();
  const { user, setUserRole } = useAuth();


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Painting');
  const [showcaseCategory, setShowcaseCategory] = useState<ShowcaseFilter>('Painting');
  const [listingType, setListingType] = useState<'both' | 'sell' | 'showcase'>('both');
  const [price, setPrice] = useState('750');
  const [dimensions, setDimensions] = useState('30" × 40"');
  const [medium, setMedium] = useState('Original Acrylic & Mixed Pigments');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [customUrl, setCustomUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  if (!isUploadModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide an artwork title.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description or curatorial statement.');
      return;
    }
    if (listingType !== 'showcase' && (!price || Number(price) <= 0)) {
      setError('Please specify a valid price for marketplace listing.');
      return;
    }

    const finalImage = customUrl.trim() || imageUrl;

    setIsUploading(true);
    try {
      if (user && user.role !== 'seller' && !user.isAdmin) {
        await setUserRole('seller');
      }

      await uploadArtwork({
        title: title.trim(),
        description: description.trim(),
        category,
        showcaseCategory,
        listingType,
        isNFS: listingType === 'showcase',
        price: listingType === 'showcase' ? 0 : Number(price),
        dimensions: dimensions.trim() || '24" × 36"',
        medium: medium.trim() || 'Mixed Media',
        image: finalImage
      });

      // Reset
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to upload artwork. Please retry.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="upload-artwork-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200"
        >
          {/* Header */}
          <div className="p-6 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-black">Upload Artwork</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Publish to Home marketplace and the curated Showcase gallery.
              </p>
            </div>
            <button
              onClick={closeUploadModal}
              className="p-2 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Image Selector & Preview */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Artwork Visual
              </label>
              
              <div className="flex gap-4 items-start mb-3">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                  <img
                    src={customUrl.trim() || imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-zinc-700 mb-1.5">Select high-res preset image:</p>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => { setImageUrl(img.url); setCustomUrl(''); }}
                        className={`text-[10px] p-1.5 rounded-lg border text-left truncate transition-colors cursor-pointer ${
                          imageUrl === img.url && !customUrl
                            ? 'border-black bg-black text-white font-bold'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Or paste any custom image URL..."
                    className="w-full px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Listing Type Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Listing Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setListingType('both')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                    listingType === 'both' || listingType === 'sell'
                      ? 'border-black bg-zinc-900 text-white shadow-xs'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Sell in Marketplace</span>
                    {(listingType === 'both' || listingType === 'sell') && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-[10px] opacity-80 mt-0.5 font-normal">Listed with price & Buy button</p>
                </button>

                <button
                  type="button"
                  onClick={() => setListingType('showcase')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                    listingType === 'showcase'
                      ? 'border-black bg-zinc-900 text-white shadow-xs'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Showcase Only (NFS)</span>
                    {listingType === 'showcase' && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-[10px] opacity-80 mt-0.5 font-normal">Exhibition & portfolio view</p>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Artwork Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Celestial Horizon XII"
                required
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black font-medium"
                >
                  <option value="Pencil">Pencil</option>
                  <option value="Painting">Painting</option>
                  <option value="Digital">Digital</option>
                  <option value="Sketch">Sketch</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  disabled={listingType === 'showcase'}
                  value={listingType === 'showcase' ? '0' : price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="450"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black disabled:opacity-50 font-mono"
                />
              </div>
            </div>

            {/* Dimensions & Medium */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder='e.g. 24" × 36"'
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Medium
                </label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g. Oil on Canvas"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Artwork Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your creative process, inspiration, and details about the physical piece..."
                rows={3}
                required
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-black resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isUploading ? (
                <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish Artwork to artWorks.yo</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
