import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Trash2, 
  Sparkles, 
  Users, 
  Palette, 
  ShoppingBag, 
  DollarSign, 
  Filter, 
  Search, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Eye, 
  ArrowUpRight, 
  UserCheck, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

type AdminTab = 'artworks' | 'users' | 'orders' | 'settings';

export const AdminPanel: React.FC = () => {
  const { user, isAdmin, registeredUsers, adminUpdateUser, adminDeleteUser, loginAsAdmin } = useAuth();
  const { 
    artworks, 
    purchases, 
    deleteArtwork, 
    purgeSampleArtworks, 
    toggleFeatureArtwork, 
    updateOrderStatus, 
    setSelectedArtwork,
    openUploadModal,
    showToast,
    setActiveTab
  } = useApp();

  const [currentTab, setCurrentTab] = useState<AdminTab>('artworks');
  const [artSearch, setArtSearch] = useState('');
  const [artFilter, setArtFilter] = useState<'all' | 'real' | 'sample'>('all');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'buyer' | 'seller' | 'admin'>('all');

  // Stats calculation
  const totalArtworks = artworks.length;
  const sampleArtworksCount = artworks.filter(a => a.isSample).length;
  const realArtworksCount = totalArtworks - sampleArtworksCount;
  
  const totalUsers = registeredUsers.length;
  const sellersCount = registeredUsers.filter(u => u.role === 'seller').length;
  const buyersCount = registeredUsers.filter(u => u.role === 'buyer').length;

  const totalVolume = purchases.reduce((acc, curr) => acc + curr.price, 0);
  const totalOrders = purchases.length;

  // Filter artworks
  const filteredArtworks = artworks.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(artSearch.toLowerCase()) || 
                          art.creator.name.toLowerCase().includes(artSearch.toLowerCase()) ||
                          art.category.toLowerCase().includes(artSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (artFilter === 'real') return !art.isSample;
    if (artFilter === 'sample') return art.isSample;
    return true;
  });

  // Filter users
  const filteredUsers = registeredUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.username.toLowerCase().includes(userSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (userRoleFilter !== 'all') return u.role === userRoleFilter;
    return true;
  });

  // Access guard
  if (!isAdmin && user?.email?.toLowerCase() !== 'ronitjain8080@gmail.com') {
    return (
      <div id="admin-access-denied" className="w-full max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-black">Administrator Access Required</h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mt-2 mb-6">
          The Admin Panel is reserved for <strong className="text-black font-mono">ronitjain8080@gmail.com</strong>.
        </p>
        <button
          onClick={loginAsAdmin}
          className="px-6 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
        >
          Sign In as Ronit Jain (Admin)
        </button>
      </div>
    );
  }

  return (
    <div id="admin-panel-container" className="w-full max-w-6xl mx-auto pb-28 px-4 sm:px-6 pt-6">
      {/* Top Banner with Admin Identity */}
      <div className="bg-black text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-amber-300 border border-white/10 mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Platform Super Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              artWorks.yo Administration Hub
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
              Logged in as <span className="text-white font-mono font-semibold">ronitjain8080@gmail.com</span>. Complete control over artwork moderation, user roles (buyer/seller), order fulfillment, and fake post removal.
            </p>
          </div>

          {/* Quick Action: Purge fake mock sample postings */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {sampleArtworksCount > 0 && (
              <button
                id="admin-purge-sample-btn"
                onClick={purgeSampleArtworks}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                title="Remove all initial sample/mock posts from the feeds"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove {sampleArtworksCount} Fake Posts</span>
              </button>
            )}
            <button
              onClick={openUploadModal}
              className="px-4 py-2.5 bg-white hover:bg-zinc-100 active:scale-95 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Artwork</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Artworks</span>
            <Palette className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-extrabold text-black font-display">{totalArtworks}</div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
            <span className="font-semibold text-emerald-600">{realArtworksCount} Real</span>
            <span>•</span>
            <span className="text-zinc-400">{sampleArtworksCount} Sample</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Users</span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-extrabold text-black font-display">{totalUsers}</div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
            <span className="font-semibold text-purple-600">{sellersCount} Sellers</span>
            <span>•</span>
            <span className="font-semibold text-blue-600">{buyersCount} Buyers</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-black font-display">${totalVolume.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            100% Collector Verified
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-extrabold text-black font-display">{totalOrders}</div>
          <div className="text-[11px] text-zinc-500 font-semibold mt-1">
            Authenticity certificates issued
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-zinc-100/80 p-1.5 rounded-2xl mb-6 max-w-md">
        <button
          id="admin-tab-artworks"
          onClick={() => setCurrentTab('artworks')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            currentTab === 'artworks'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Posts ({artworks.length})</span>
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setCurrentTab('users')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            currentTab === 'users'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({registeredUsers.length})</span>
        </button>

        <button
          id="admin-tab-orders"
          onClick={() => setCurrentTab('orders')}
          className={`flex-1 py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            currentTab === 'orders'
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({purchases.length})</span>
        </button>
      </div>

      {/* Tab 1: Artworks & Post Moderation */}
      {currentTab === 'artworks' && (
        <div id="admin-artworks-section" className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={artSearch}
                onChange={(e) => setArtSearch(e.target.value)}
                placeholder="Search artwork title, artist name, medium..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-100 p-1 rounded-xl">
                <button
                  onClick={() => setArtFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    artFilter === 'all' ? 'bg-white text-black shadow-xs' : 'text-zinc-500'
                  }`}
                >
                  All ({totalArtworks})
                </button>
                <button
                  onClick={() => setArtFilter('real')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    artFilter === 'real' ? 'bg-white text-black shadow-xs' : 'text-zinc-500'
                  }`}
                >
                  Real Posts ({realArtworksCount})
                </button>
                <button
                  onClick={() => setArtFilter('sample')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    artFilter === 'sample' ? 'bg-white text-black shadow-xs' : 'text-zinc-500'
                  }`}
                >
                  Sample ({sampleArtworksCount})
                </button>
              </div>
            </div>
          </div>

          {/* Artworks Table / Card Grid */}
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
            {filteredArtworks.length === 0 ? (
              <div className="p-12 text-center text-zinc-400">
                <Palette className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
                <p className="text-sm font-semibold">No artworks found matching criteria.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filteredArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-black truncate">
                            {art.title}
                          </h3>
                          {art.isSample ? (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-bold uppercase">
                              Sample Mock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase">
                              Real User Post
                            </span>
                          )}
                          {art.featured && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-[10px] font-bold uppercase">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-500 mt-1">
                          By <strong className="text-zinc-800">{art.creator.name}</strong> (@{art.creator.username}) • {art.category} • {art.year}
                        </p>

                        <p className="text-xs font-bold text-black mt-1 font-display">
                          {art.isNFS ? 'Not For Sale (Showcase)' : `$${art.price.toLocaleString()}`}
                        </p>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setSelectedArtwork(art)}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="View Artwork"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => toggleFeatureArtwork(art.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          art.featured
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{art.featured ? 'Featured' : 'Feature'}</span>
                      </button>

                      <button
                        id={`admin-delete-art-${art.id}`}
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove the post "${art.title}" from the platform?`)) {
                            deleteArtwork(art.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Post</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: User Directory & Role Management */}
      {currentTab === 'users' && (
        <div id="admin-users-section" className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, email, handle..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center bg-zinc-100 p-1 rounded-xl">
              <button
                onClick={() => setUserRoleFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  userRoleFilter === 'all' ? 'bg-white text-black shadow-xs' : 'text-zinc-500'
                }`}
              >
                All ({registeredUsers.length})
              </button>
              <button
                onClick={() => setUserRoleFilter('seller')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  userRoleFilter === 'seller' ? 'bg-white text-black shadow-xs' : 'text-zinc-500'
                }`}
              >
                Sellers ({sellersCount})
              </button>
              <button
                onClick={() => setUserRoleFilter('buyer')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  userRoleFilter === 'buyer' ? 'bg-white text-black shadow-xs' : 'text-zinc-500'
                }`}
              >
                Buyers ({buyersCount})
              </button>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden shadow-xs">
            {filteredUsers.map((u) => {
              const isTargetUserAdmin = u.email?.toLowerCase() === 'ronitjain8080@gmail.com';
              const userArtworksCount = artworks.filter(a => a.creatorId === u.uid || a.creator.name === u.name).length;

              return (
                <div key={u.uid} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-black">{u.name}</h4>
                        {isTargetUserAdmin ? (
                          <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase rounded-md">
                            Super Admin
                          </span>
                        ) : u.role === 'seller' ? (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase rounded-md">
                            🎨 Seller (Can Sell & Buy)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase rounded-md">
                            🛍️ Buyer (Collector)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">{u.email}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        @{u.username} • {userArtworksCount} listed artworks
                      </p>
                    </div>
                  </div>

                  {/* Role Assignment dropdown for Admin */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isTargetUserAdmin ? (
                      <>
                        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                          <button
                            onClick={() => {
                              adminUpdateUser(u.uid, { role: 'buyer' });
                              showToast(`Updated ${u.name}'s role to Buyer.`, 'info');
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              u.role === 'buyer' ? 'bg-white text-blue-700 shadow-xs' : 'text-zinc-500 hover:text-black'
                            }`}
                          >
                            Buyer
                          </button>
                          <button
                            onClick={() => {
                              adminUpdateUser(u.uid, { role: 'seller' });
                              showToast(`Updated ${u.name}'s role to Seller (Can Sell & Buy).`, 'info');
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              u.role === 'seller' ? 'bg-white text-purple-700 shadow-xs' : 'text-zinc-500 hover:text-black'
                            }`}
                          >
                            Seller
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user account for ${u.name}?`)) {
                              adminDeleteUser(u.uid);
                              showToast(`Deleted user ${u.name}`, 'info');
                            }
                          }}
                          className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-zinc-400 px-3 py-1 bg-zinc-50 rounded-lg">
                        Permanent Admin
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Orders & Transactions Ledger */}
      {currentTab === 'orders' && (
        <div id="admin-orders-section" className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
            {purchases.length === 0 ? (
              <div className="p-12 text-center text-zinc-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-zinc-300" />
                <p className="text-sm font-semibold">No transactions recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {purchases.map((rec) => (
                  <div key={rec.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <img
                        src={rec.artworkImage}
                        alt={rec.artworkTitle}
                        className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-black">{rec.artworkTitle}</h4>
                          <span className="font-display font-bold text-sm text-black">
                            ${rec.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500">
                          Artist: <strong>{rec.creatorName}</strong> (@{rec.creatorUsername})
                        </p>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          Order ID: {rec.id} • Certificate: {rec.certificateId}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Ship to: {rec.shippingAddress.fullName}, {rec.shippingAddress.street}, {rec.shippingAddress.city}, {rec.shippingAddress.country}
                        </p>
                      </div>
                    </div>

                    {/* Order Fulfillment Status */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <span className="text-xs font-semibold text-zinc-500 mr-1">Status:</span>
                      <select
                        value={rec.status}
                        onChange={(e) => updateOrderStatus(rec.id, e.target.value as any)}
                        className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-black focus:outline-none cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
