import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Bookmark, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  Maximize2, 
  Share2, 
  Eye, 
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ArtworkDetailModal: React.FC = () => {
  const { 
    selectedArtwork, 
    setSelectedArtwork, 
    openPurchaseModal, 
    toggleSaveArtwork, 
    isArtworkSaved,
    toggleLikeArtwork,
    startChatWithArtist,
    deleteArtwork,
    showToast
  } = useApp();

  const { user, isGuest, isAdmin, openAuthModal } = useAuth();
  const [viewInRoom, setViewInRoom] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedArtwork) return null;

  const saved = isArtworkSaved(selectedArtwork.id);
  const isLiked = !!selectedArtwork.isLiked;
  const isOwner = user && (user.id === selectedArtwork.creator.id || user.username === selectedArtwork.creator.username);
  const canModerate = isOwner || isAdmin;


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedArtwork.title} — artWorks.yo`,
        text: selectedArtwork.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Artwork link copied to clipboard!', 'info');
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="artwork-detail-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-screen md:max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            id="artwork-detail-close-btn"
            onClick={() => setSelectedArtwork(null)}
            className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black text-white rounded-full transition-all shadow-md cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Viewer / Room Simulation */}
          <div className="w-full md:w-3/5 bg-[#141414] relative flex items-center justify-center min-h-[350px] md:min-h-[500px] overflow-hidden p-6 sm:p-8">
            {viewInRoom ? (
              /* Gallery Wall Simulation */
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#E5E5E5] rounded-xl p-8 shadow-inner overflow-hidden">
                {/* Wall moulding & floor line */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-[#DCDCDC] border-b border-[#CECECE]" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#C8B89E] border-t border-[#A89880]" />
                <div className="absolute bottom-16 left-0 right-0 h-2 bg-[#F0F0F0]" />

                {/* Framed piece on wall with shadow */}
                <div className="relative z-10 p-2 bg-black shadow-2xl shadow-black/40 rounded-xs transform -translate-y-4">
                  <img
                    src={selectedArtwork.image}
                    alt={selectedArtwork.title}
                    referrerPolicy="no-referrer"
                    className="max-h-56 sm:max-h-64 object-contain"
                  />
                </div>

                <div className="absolute bottom-3 left-4 text-[10px] text-zinc-600 font-mono">
                  Scale Preview: 1:1 Gallery Wall Hanging
                </div>
              </div>
            ) : (
              /* Standard high-res presentation */
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}

            {/* Room simulator toggle button */}
            <button
              onClick={() => setViewInRoom(!viewInRoom)}
              className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-white/90 hover:bg-white text-black text-xs font-semibold rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{viewInRoom ? 'Standard View' : 'View on Gallery Wall'}</span>
            </button>
          </div>

          {/* Right Column: Details, Specifications, Actions */}
          <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
            <div>
              {/* Category & Year */}
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
                <span className="uppercase tracking-wider px-2 py-0.5 bg-zinc-100 rounded text-zinc-600 font-bold">
                  {selectedArtwork.category}
                </span>
                <span>{selectedArtwork.year} • Original</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mb-2">
                {selectedArtwork.title}
              </h2>

              {/* Price */}
              <div className="text-xl sm:text-2xl font-extrabold text-[#111111] mb-6 font-display">
                {selectedArtwork.isNFS ? 'Not For Sale (Exhibition Only)' : `$${selectedArtwork.price.toLocaleString()}`}
              </div>

              {/* Creator Profile Chip */}
              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedArtwork.creator.avatar}
                    alt={selectedArtwork.creator.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-black">{selectedArtwork.creator.name}</h4>
                    <p className="text-xs text-zinc-400">@{selectedArtwork.creator.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedArtwork(null);
                    startChatWithArtist(selectedArtwork.creator, selectedArtwork);
                  }}
                  className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-200/60 rounded-full transition-colors"
                  title="Message Artist"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  About the Artwork
                </h4>
                <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                  {selectedArtwork.description}
                </p>
              </div>

              {/* Specifications Matrix */}
              <div className="border-t border-b border-zinc-100 py-3 mb-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Medium</span>
                  <span className="font-semibold text-zinc-800 text-right max-w-[200px]">{selectedArtwork.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Dimensions</span>
                  <span className="font-semibold text-zinc-800">{selectedArtwork.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Authenticity</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {selectedArtwork.isSample ? 'Curated Sample Exhibition' : 'Verified Creator Certificate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5 pt-2">
              {!selectedArtwork.isNFS && (
                <button
                  id="detail-buy-btn"
                  onClick={() => {
                    setSelectedArtwork(null);
                    openPurchaseModal(selectedArtwork);
                  }}
                  className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now • ${selectedArtwork.price.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  id="detail-save-btn"
                  onClick={() => toggleSaveArtwork(selectedArtwork.id)}
                  className={`flex-1 py-2.5 border rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    saved 
                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                      : 'border-zinc-300 text-zinc-800 hover:border-black'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                  <span>{saved ? 'Saved in Collection' : 'Save Artwork'}</span>
                </button>

                <button
                  id="detail-like-btn"
                  onClick={() => toggleLikeArtwork(selectedArtwork.id)}
                  className={`p-2.5 border rounded-xl transition-colors cursor-pointer ${
                    isLiked 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'border-zinc-300 text-zinc-700 hover:border-black'
                  }`}
                  aria-label="Like"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                </button>

                <button
                  id="detail-share-btn"
                  onClick={handleShare}
                  className="p-2.5 border border-zinc-300 text-zinc-700 hover:border-black rounded-xl transition-colors cursor-pointer"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {canModerate && (
                  <button
                    id="detail-delete-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2.5 border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                    title={isAdmin ? "Admin: Delete Artwork" : "Delete My Post"}
                    aria-label="Delete Artwork"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Delete Confirmation Modal Overlay */}
              {showDeleteConfirm && (
                <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Confirm deletion of this artwork?</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    This will permanently remove "{selectedArtwork.title}" from the marketplace and gallery.
                  </p>
                  <div className="flex gap-2 justify-end mt-1">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 bg-white text-zinc-700 border border-zinc-200 rounded-lg text-xs font-semibold hover:bg-zinc-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await deleteArtwork(selectedArtwork.id);
                        setSelectedArtwork(null);
                        showToast('Artwork successfully removed.', 'info');
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 shadow-sm"
                    >
                      Permanently Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
