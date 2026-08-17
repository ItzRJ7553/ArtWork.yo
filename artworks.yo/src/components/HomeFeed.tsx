import React from 'react';
import { useApp } from '../context/AppContext';
import { Category, Artwork } from '../types';
import { Heart, Bookmark, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES: Category[] = ['All', 'Pencil', 'Painting', 'Digital', 'Sketch', 'Other'];

export const HomeFeed: React.FC = () => {
  const { 
    artworks, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSelectedArtwork,
    openPurchaseModal,
    toggleSaveArtwork,
    isArtworkSaved,
    toggleLikeArtwork
  } = useApp();

  // Filter artworks by category and search query
  const filteredArtworks = artworks.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Only show items available for sale in Home marketplace or both
    const isSellable = art.listingType !== 'showcase' && !art.isNFS;
    return matchesCategory && matchesSearch && isSellable;
  });

  return (
    <div id="home-feed-container" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
      {/* Category Pills Row - Exact match to Image 3.png */}
      <div 
        id="home-category-filters" 
        className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar border-b border-zinc-100/80 mb-4 sticky top-14 sm:top-16 bg-white/95 backdrop-blur-md z-20"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`filter-pill-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-white text-[#444444] border border-[#E0E0E0] hover:border-[#999999]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Artwork Cards Feed */}
      <div className="space-y-10 sm:space-y-12">
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-zinc-50 rounded-2xl border border-zinc-100 mt-4">
            <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-700">No artwork found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
              {searchQuery ? `No results for "${searchQuery}" in ${selectedCategory}.` : `No artworks listed under ${selectedCategory} category currently.`}
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); }}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-xl"
            >
              Show All Artwork
            </button>
          </div>
        ) : (
          filteredArtworks.map((art, index) => {
            const saved = isArtworkSaved(art.id);

            return (
              <motion.article
                key={art.id}
                id={`artwork-card-${art.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                className="bg-white rounded-2xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Artwork Image Frame */}
                <div 
                  onClick={() => setSelectedArtwork(art)}
                  className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[#F7F7F7] cursor-pointer group overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />

                  {/* Save/Bookmark and Quick View overlay */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveArtwork(art.id);
                      }}
                      id={`save-art-btn-${art.id}`}
                      className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                        saved 
                          ? 'bg-black text-white' 
                          : 'bg-white/80 hover:bg-white text-black'
                      }`}
                      aria-label="Save Artwork"
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Category Chip in top-left */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-medium tracking-wide">
                    {art.category}
                  </div>
                </div>

                {/* Card Info Section */}
                <div className="p-4 sm:p-5">
                  {/* Creator Name (Uppercase) */}
                  <p 
                    className="text-[12px] font-bold text-[#666666] tracking-wider uppercase mb-1 cursor-pointer hover:text-black transition-colors"
                    onClick={() => setSelectedArtwork(art)}
                  >
                    {art.creator.name}
                  </p>

                  {/* Title & Price Header */}
                  <div className="flex items-baseline justify-between gap-2 mb-4">
                    <h3 
                      onClick={() => setSelectedArtwork(art)}
                      className="text-[20px] sm:text-[22px] font-extrabold text-[#111111] tracking-tight leading-snug cursor-pointer hover:underline decoration-1 underline-offset-4"
                    >
                      {art.title}
                    </h3>
                    <span className="text-[18px] sm:text-[20px] font-extrabold text-[#111111] shrink-0 font-display">
                      ${art.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4 font-normal">
                    {art.description}
                  </p>

                  {/* Buy Button - Full width black button matching Image 3.png */}
                  <button
                    id={`buy-artwork-btn-${art.id}`}
                    onClick={() => openPurchaseModal(art)}
                    className="w-full h-12 bg-[#000000] hover:bg-[#222222] active:scale-[0.99] text-white text-[14px] font-bold tracking-wide rounded-full transition-all shadow-sm cursor-pointer flex items-center justify-center"
                  >
                    Buy Artwork
                  </button>
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
};
