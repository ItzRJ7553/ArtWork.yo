import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ShowcaseFilter, Artwork } from '../types';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Plus, 
  Sparkles,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

const SHOWCASE_FILTERS: ShowcaseFilter[] = [
  'All Media',
  'Photography',
  'Digital 3D',
  'Abstract',
  'Painting',
  'Sculpture'
];

export const ShowcaseFeed: React.FC = () => {
  const { 
    artworks, 
    selectedShowcaseFilter, 
    setSelectedShowcaseFilter, 
    setSelectedArtwork,
    openUploadModal,
    startChatWithArtist,
    toggleSaveArtwork,
    isArtworkSaved,
    toggleLikeArtwork,
    showToast
  } = useApp();

  const { isGuest, openAuthModal } = useAuth();

  // Filter artworks for Showcase
  const filteredShowcase = artworks.filter((art) => {
    // Show items that are part of showcase or both
    if (art.listingType === 'sell' && !art.showcaseCategory) return false;
    
    if (selectedShowcaseFilter === 'All Media') return true;
    return (
      art.showcaseCategory?.toLowerCase() === selectedShowcaseFilter.toLowerCase() ||
      art.category.toLowerCase() === selectedShowcaseFilter.toLowerCase()
    );
  });

  const handleShare = (art: Artwork) => {
    if (navigator.share) {
      navigator.share({
        title: `${art.title} by ${art.creator.name}`,
        text: art.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Link to "${art.title}" copied to clipboard!`, 'info');
    }
  };

  return (
    <div id="showcase-feed-container" className="w-full max-w-xl mx-auto pb-28 px-4 sm:px-0">
      {/* Showcase Page Header - Matches Image 6.png */}
      <div className="pt-4 pb-2">
        <h1 
          id="showcase-heading"
          className="text-[26px] sm:text-[30px] font-extrabold text-[#111111] tracking-tight mb-1"
        >
          Showcase
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#666666] leading-relaxed max-w-md">
          Discover curated collections from emerging and established artists worldwide.
        </p>
      </div>

      {/* Filter Pills */}
      <div 
        id="showcase-filters"
        className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar border-b border-zinc-100/80 mb-6 sticky top-14 sm:top-16 bg-white/95 backdrop-blur-md z-20"
      >
        {SHOWCASE_FILTERS.map((filter) => {
          const isSelected = selectedShowcaseFilter === filter;
          return (
            <button
              key={filter}
              id={`showcase-filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedShowcaseFilter(filter)}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-white text-[#444444] border border-[#E0E0E0] hover:border-[#999999]'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Showcase Posts List */}
      <div className="space-y-12">
        {filteredShowcase.length === 0 ? (
          <div className="text-center py-16 px-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-700">No showcase items</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Be the first to showcase artwork under {selectedShowcaseFilter}!
            </p>
            <button
              onClick={openUploadModal}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-xl"
            >
              Upload Artwork
            </button>
          </div>
        ) : (
          filteredShowcase.map((art, index) => {
            const saved = isArtworkSaved(art.id);
            const isLiked = !!art.isLiked;

            return (
              <motion.article
                key={art.id}
                id={`showcase-post-${art.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                className="bg-white pb-6 border-b border-zinc-200/80 last:border-b-0"
              >
                {/* Creator Header: Avatar, Name, Options */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div 
                    onClick={() => startChatWithArtist(art.creator, art)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={art.creator.avatar}
                      alt={art.creator.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-zinc-200 group-hover:ring-2 group-hover:ring-black transition-all"
                    />
                    <div>
                      <h4 className="text-[14px] font-bold text-[#111111] group-hover:underline leading-none">
                        {art.creator.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        @{art.creator.username} • {art.showcaseCategory || art.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedArtwork(art)}
                    className="p-2 text-zinc-400 hover:text-black rounded-full transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Showcase Gallery Visual Container */}
                <div 
                  onClick={() => setSelectedArtwork(art)}
                  className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#F5F5F7] rounded-xl overflow-hidden cursor-pointer group border border-zinc-200/90 flex items-center justify-center p-3 sm:p-4 shadow-xs"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md transition-transform duration-500 group-hover:scale-[1.01]"
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />

                  {/* Subtle gallery exhibition plaque overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end p-4 pointer-events-none">
                    <span className="text-[11px] font-medium tracking-wide text-white bg-black/70 px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      View Exhibition Details
                    </span>
                  </div>
                </div>

                {/* Interactive Action Bar: Like, Chat, Share, Bookmark */}
                <div className="flex items-center justify-between py-3 px-1">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLikeArtwork(art.id)}
                      className="text-zinc-800 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
                      aria-label="Like Artwork"
                    >
                      <Heart 
                        className={`w-6 h-6 transition-transform active:scale-125 ${
                          isLiked ? 'fill-rose-600 text-rose-600' : 'stroke-[1.8px]'
                        }`} 
                      />
                      {art.likes > 0 && (
                        <span className="text-xs font-semibold text-zinc-600">{art.likes}</span>
                      )}
                    </button>

                    {/* Chat Inquiry Button */}
                    <button
                      onClick={() => startChatWithArtist(art.creator, art)}
                      className="text-zinc-800 hover:text-black transition-colors cursor-pointer"
                      aria-label="Message Creator"
                      title="Send message about this piece"
                    >
                      <MessageCircle className="w-6 h-6 stroke-[1.8px]" />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(art)}
                      className="text-zinc-800 hover:text-black transition-colors cursor-pointer"
                      aria-label="Share Artwork"
                    >
                      <Send className="w-6 h-6 stroke-[1.8px]" />
                    </button>
                  </div>

                  {/* Bookmark/Save Button */}
                  <button
                    onClick={() => toggleSaveArtwork(art.id)}
                    className="text-zinc-800 hover:text-black transition-colors cursor-pointer"
                    aria-label="Save to Bookmarks"
                  >
                    <Bookmark 
                      className={`w-6 h-6 ${
                        saved ? 'fill-black text-black' : 'stroke-[1.8px]'
                      }`} 
                    />
                  </button>
                </div>

                {/* Post Details */}
                <div className="px-1 space-y-1">
                  <h3 
                    onClick={() => setSelectedArtwork(art)}
                    className="text-[17px] font-bold text-[#111111] cursor-pointer hover:underline"
                  >
                    {art.title}
                  </h3>

                  <p className="text-[13px] text-[#333333] leading-relaxed">
                    <span className="font-bold text-black mr-1.5">{art.creator.name}</span>
                    {art.description}
                  </p>

                  <div className="pt-1.5 flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#111111]">
                      {art.isNFS ? 'NFS' : `$${art.price.toLocaleString()}`}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {art.dimensions} • {art.year}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>

      {/* Floating Action Button for Upload (Exact match to bottom-right plus button in Image 6.png) */}
      <button
        id="showcase-floating-upload-btn"
        onClick={openUploadModal}
        className="fixed bottom-20 right-5 sm:right-8 z-30 w-14 h-14 bg-[#000000] text-white rounded-full shadow-xl hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-white"
        aria-label="Upload Artwork"
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>
    </div>
  );
};
