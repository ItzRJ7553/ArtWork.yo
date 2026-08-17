import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Palette, 
  ShoppingBag, 
  Heart, 
  Settings as SettingsIcon, 
  LogOut, 
  ChevronRight, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ExternalLink,
  Plus,
  RefreshCw,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditProfileModal } from './EditProfileModal';

type SubSection = 'main' | 'my-art' | 'purchases' | 'saved' | 'settings';

export const AccountView: React.FC = () => {
  const { user, isGuest, isAdmin, isSeller, setUserRole, logout, openAuthModal } = useAuth();
  const { 
    artworks, 
    savedArtworkIds, 
    purchases, 
    myUploadedArtworks, 
    setSelectedArtwork, 
    openUploadModal,
    toggleSaveArtwork,
    deleteArtwork,
    setActiveTab,
    showToast
  } = useApp();


  const [activeSection, setActiveSection] = useState<SubSection>('main');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Settings State
  const [currency, setCurrency] = useState('USD ($)');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [highResPreviews, setHighResPreviews] = useState(true);

  // Filter saved artworks objects
  const savedArtworks = artworks.filter(a => savedArtworkIds.includes(a.id));

  // If in guest mode, show guest account screen
  if (isGuest || !user) {
    return (
      <div id="guest-account-screen" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
        <div className="pt-8 pb-6 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-zinc-200 border-4 border-white shadow-md flex items-center justify-center mb-4 text-zinc-400">
            <span className="text-3xl font-bold">?</span>
          </div>
          <h2 className="text-2xl font-extrabold text-black mb-1">Guest Account</h2>
          <p className="text-sm text-zinc-500 max-w-xs mb-6">
            Log in or create an account to upload, purchase, and save artworks to your personal collection.
          </p>
          <div className="w-full max-w-xs space-y-3">
            <button
              id="guest-login-btn"
              onClick={() => openAuthModal('login')}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Log In
            </button>
            <button
              id="guest-create-account-btn"
              onClick={() => openAuthModal('signup')}
              className="w-full py-3 bg-white hover:bg-zinc-50 text-black border border-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Guest menu previews */}
        <div className="mt-8 border-t border-zinc-200 pt-4 space-y-1">
          <button
            onClick={() => openAuthModal('login', 'Sign in to view your uploaded artworks.')}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-100/70 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <Palette className="w-5 h-5 text-zinc-600" />
              <span className="text-[15px] font-bold text-zinc-800">My Artwork</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            onClick={() => openAuthModal('login', 'Sign in to view your purchases & certificates.')}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-100/70 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-5 h-5 text-zinc-600" />
              <span className="text-[15px] font-bold text-zinc-800">My Purchases</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            onClick={() => openAuthModal('login', 'Sign in to view your saved collection.')}
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-100/70 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <Heart className="w-5 h-5 text-zinc-600" />
              <span className="text-[15px] font-bold text-zinc-800">Saved Artwork</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
    );
  }

  // Sub-section: My Artwork
  if (activeSection === 'my-art') {
    return (
      <div id="sub-my-artwork" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
        <div className="py-4 flex items-center justify-between border-b border-zinc-200 mb-6">
          <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-base font-bold text-black">My Artwork ({myUploadedArtworks.length})</h2>
          <button
            onClick={openUploadModal}
            className="p-1.5 bg-black text-white rounded-full hover:bg-zinc-800"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {myUploadedArtworks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <Palette className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-700">No artwork uploaded yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto mb-6">
              Share your creations with global collectors across Home & Showcase.
            </p>
            <button
              onClick={openUploadModal}
              className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase rounded-xl hover:bg-zinc-800"
            >
              Upload Your First Piece
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {myUploadedArtworks.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArtwork(art)}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-zinc-100 relative">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-white text-[10px] font-medium">
                    {art.listingType === 'showcase' ? 'Showcase Only' : `$${art.price}`}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm text-black truncate">{art.title}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">{art.category} • {art.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sub-section: My Purchases
  if (activeSection === 'purchases') {
    return (
      <div id="sub-my-purchases" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
        <div className="py-4 flex items-center justify-between border-b border-zinc-200 mb-6">
          <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-base font-bold text-black">My Purchases ({purchases.length})</h2>
          <div className="w-6" />
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-16 px-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-700">No purchases yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto mb-6">
              When you buy original art, your verified certificate of authenticity and tracking will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col gap-3"
              >
                <div className="flex gap-3.5">
                  <img
                    src={rec.artworkImage}
                    alt={rec.artworkTitle}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-zinc-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-base text-black truncate">{rec.artworkTitle}</h4>
                      <span className="text-sm font-extrabold text-black shrink-0 font-display">
                        ${rec.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium">By {rec.creatorName}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Acquired on {rec.purchasedAt}</p>
                    
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        {rec.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Certificate Details Plaque */}
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="font-mono text-zinc-600 text-[11px]">Certificate: {rec.certificateId}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Museum Authenticated</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sub-section: Saved Artwork
  if (activeSection === 'saved') {
    return (
      <div id="sub-saved-artwork" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
        <div className="py-4 flex items-center justify-between border-b border-zinc-200 mb-6">
          <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-base font-bold text-black">Saved Artwork ({savedArtworks.length})</h2>
          <div className="w-6" />
        </div>

        {savedArtworks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <Heart className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-700">Your collection is empty</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto mb-4">
              Tap the bookmark or save icon on any artwork in Home or Showcase to curate your wishlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {savedArtworks.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArtwork(art)}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group relative"
              >
                <div className="aspect-[4/5] bg-zinc-100 relative">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveArtwork(art.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[11px] uppercase font-bold text-zinc-400 truncate">{art.creator.name}</p>
                  <h4 className="font-bold text-sm text-black truncate">{art.title}</h4>
                  <p className="text-xs font-bold text-black mt-1 font-display">
                    {art.isNFS ? 'NFS' : `$${art.price.toLocaleString()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sub-section: Settings
  if (activeSection === 'settings') {
    return (
      <div id="sub-settings" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
        <div className="py-4 flex items-center justify-between border-b border-zinc-200 mb-6">
          <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Account</span>
          </button>
          <h2 className="text-base font-bold text-black">Settings</h2>
          <div className="w-6" />
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-black">Currency Display</h4>
              <p className="text-xs text-zinc-500">Select your preferred transaction currency</p>
            </div>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                showToast(`Currency updated to ${e.target.value}`, 'info');
              }}
              className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
            </select>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-black">Email Notifications</h4>
              <p className="text-xs text-zinc-500">Receive inquiry updates and order notices</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 accent-black rounded cursor-pointer"
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-black">Ultra HD Image Previews</h4>
              <p className="text-xs text-zinc-500">Load high-resolution uncompressed gallery assets</p>
            </div>
            <input
              type="checkbox"
              checked={highResPreviews}
              onChange={(e) => setHighResPreviews(e.target.checked)}
              className="w-5 h-5 accent-black rounded cursor-pointer"
            />
          </div>

          <div className="p-4 bg-zinc-50 text-xs text-zinc-500">
            <p className="font-semibold text-zinc-700 mb-1">About artWorks.yo</p>
            <p>Version 1.0.4 • Contemporary Digital Art & Original Fine Art Registry</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Account Screen (Exact replica of Image 10.png)
  return (
    <div id="account-main-screen" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
      {/* Profile Header section - Matches Image 10.png */}
      <div className="pt-8 pb-6 flex flex-col items-center text-center">
        {/* Large circular avatar with clean border */}
        <div className="relative mb-3">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>

        {/* User Name (Bold) */}
        <h2 
          id="account-user-name"
          className="text-[22px] sm:text-[24px] font-extrabold text-[#111111] tracking-tight"
        >
          {user.name}
        </h2>

        {/* User Handle */}
        <p className="text-[14px] text-[#666666] font-medium mt-0.5">
          @{user.username}
        </p>

        {/* Stats: Followers | Following with divider */}
        <div className="flex items-center gap-6 my-4 text-[14px]">
          <div className="text-center">
            <span className="font-bold text-[#111111]">{user.followersCount >= 1000 ? `${(user.followersCount / 1000).toFixed(1)}k` : user.followersCount}</span>
            <span className="text-[#666666] ml-1.5">Followers</span>
          </div>
          <div className="w-[1px] h-4 bg-[#DEDEDE]" />
          <div className="text-center">
            <span className="font-bold text-[#111111]">{user.followingCount}</span>
            <span className="text-[#666666] ml-1.5">Following</span>
          </div>
        </div>

        {/* Edit Profile Button & Role Switcher */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
          <button
            id="account-edit-profile-btn"
            onClick={() => setIsEditProfileOpen(true)}
            className="px-6 py-2 bg-[#000000] hover:bg-[#222222] active:scale-[0.99] text-white text-[13px] font-bold tracking-wide rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Edit Profile
          </button>

          {!isAdmin && (
            <button
              id="account-toggle-role-btn"
              onClick={() => {
                const nextRole = user.role === 'seller' ? 'buyer' : 'seller';
                setUserRole(nextRole);
                showToast(`Switched mode to ${nextRole === 'seller' ? 'Seller (Can Sell & Buy)' : 'Buyer (Collector)'}`, 'info');
              }}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[12px] font-bold tracking-wide rounded-xl border border-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
              <span>Switch to {user.role === 'seller' ? 'Buyer Mode' : 'Seller Mode'}</span>
            </button>
          )}
        </div>

        {/* Role Information Banner */}
        <div className="mt-4 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-center max-w-sm">
          <p className="text-xs text-zinc-600">
            Account Status: <strong className="text-black capitalize font-bold">{user.role || 'Buyer'}</strong>
            {user.role === 'seller' ? (
              <span className="text-zinc-500 block text-[11px] mt-0.5">
                🎨 You are a verified Seller. You have full privileges to sell original art and buy from other artists!
              </span>
            ) : (
              <span className="text-zinc-500 block text-[11px] mt-0.5">
                🛍️ You are in Collector mode. Switch to Seller anytime to publish your art.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Menu List Items */}
      <div className="border-t border-[#EBEBEB] pt-2 space-y-1">
        {/* Admin Hub entry for ronitjain8080@gmail.com */}
        {isAdmin && (
          <>
            <button
              id="account-menu-admin-hub"
              onClick={() => setActiveTab('admin')}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 transition-colors text-left cursor-pointer group border border-amber-200/60"
            >
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-amber-700 stroke-[2px]" />
                <div>
                  <span className="text-[15px] font-extrabold text-amber-950 block">Admin Control Panel</span>
                  <span className="text-xs text-amber-700 font-mono">ronitjain8080@gmail.com</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-700 group-hover:text-amber-950 transition-colors" />
            </button>
            <div className="h-[1px] bg-[#F0F0F0] mx-4" />
          </>
        )}

        {/* 1. My Artwork */}
        <button
          id="account-menu-my-artwork"
          onClick={() => setActiveSection('my-art')}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-zinc-100/70 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <Palette className="w-5 h-5 text-[#111111] stroke-[2px]" />
            <span className="text-[15px] font-bold text-[#111111]">
              My Artwork {myUploadedArtworks.length > 0 && `(${myUploadedArtworks.length})`}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
        </button>
        <div className="h-[1px] bg-[#F0F0F0] mx-4" />

        {/* 2. My Purchases */}
        <button
          id="account-menu-my-purchases"
          onClick={() => setActiveSection('purchases')}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-zinc-100/70 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-5 h-5 text-[#111111] stroke-[2px]" />
            <span className="text-[15px] font-bold text-[#111111]">
              My Purchases {purchases.length > 0 && `(${purchases.length})`}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
        </button>
        <div className="h-[1px] bg-[#F0F0F0] mx-4" />


        {/* 3. Saved Artwork */}
        <button
          id="account-menu-saved-artwork"
          onClick={() => setActiveSection('saved')}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-zinc-100/70 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5 text-[#111111] stroke-[2px]" />
            <span className="text-[15px] font-bold text-[#111111]">Saved Artwork</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
        </button>
        <div className="h-[1px] bg-[#F0F0F0] mx-4" />

        {/* 4. Settings */}
        <button
          id="account-menu-settings"
          onClick={() => setActiveSection('settings')}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-zinc-100/70 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <SettingsIcon className="w-5 h-5 text-[#111111] stroke-[2px]" />
            <span className="text-[15px] font-bold text-[#111111]">Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
        </button>
        <div className="h-[1px] bg-[#F0F0F0] mx-4" />

        {/* 5. Logout */}
        <button
          id="account-menu-logout"
          onClick={logout}
          className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-rose-50/60 transition-colors text-left cursor-pointer group"
        >
          <LogOut className="w-5 h-5 text-[#E11D48] stroke-[2px]" />
          <span className="text-[15px] font-bold text-[#E11D48]">Logout</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
