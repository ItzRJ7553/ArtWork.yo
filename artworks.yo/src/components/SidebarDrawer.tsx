import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Home, 
  LayoutGrid, 
  MessageSquare, 
  User, 
  UploadCloud, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  LogIn, 
  LogOut, 
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Store,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types';

export const SidebarDrawer: React.FC = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    setActiveTab, 
    setSelectedCategory,
    openUploadModal,
    purchases,
    savedArtworkIds
  } = useApp();

  const { user, isGuest, isAdmin, isSeller, setUserRole, openAuthModal, logout } = useAuth();

  if (!sidebarOpen) return null;

  const handleNav = (tab: any) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setActiveTab('home');
    setSidebarOpen(false);
  };

  const categories: Category[] = ['All', 'Pencil', 'Painting', 'Digital', 'Sketch', 'Other'];

  return (
    <AnimatePresence>
      <div 
        id="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
      >
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xs h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
          {/* Header */}
          <div>
            <div className="p-5 flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-black">
                  artWorks.yo
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                  v1.0
                </span>
              </div>
              <button
                id="sidebar-close-btn"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile / Role Badge */}
            <div className="p-4 mx-4 mt-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              {user && !isGuest ? (
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border border-zinc-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-black truncate">{user.name}</p>
                        {isAdmin && (
                          <span className="px-1.5 py-0.2 bg-black text-white text-[9px] font-bold rounded uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
                    </div>
                  </div>

                  {/* Role Status & Switcher */}
                  <div className="mt-3 pt-3 border-t border-zinc-200/60 flex items-center justify-between">
                    <div className="text-[11px] font-medium text-zinc-600">
                      Role: <strong className="text-black capitalize">{user.role || 'Buyer'}</strong>
                      {isSeller && <span className="text-zinc-400 block text-[10px]">(Can sell & buy)</span>}
                    </div>

                    {!isAdmin && (
                      <button
                        onClick={() => {
                          const nextRole = user.role === 'seller' ? 'buyer' : 'seller';
                          setUserRole(nextRole);
                        }}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Switch to {user.role === 'seller' ? 'Buyer' : 'Seller'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-1">
                  <p className="text-xs font-bold text-zinc-800 mb-1">Browsing in Guest Mode</p>
                  <p className="text-[11px] text-zinc-500 mb-2">Sign in to buy, sell, and showcase artworks.</p>
                  <button
                    onClick={() => { setSidebarOpen(false); openAuthModal('login'); }}
                    className="w-full py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Main Menu Links */}
            <div className="p-4 space-y-1">
              <button
                onClick={() => handleNav('home')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 text-zinc-500" />
                <span>Marketplace (Home)</span>
              </button>

              <button
                onClick={() => handleNav('showcase')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 text-zinc-500" />
                <span>Curated Showcase</span>
              </button>

              <button
                onClick={() => handleNav('chat')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-zinc-500" />
                <span>Messages & Inquiries</span>
              </button>

              <button
                onClick={() => handleNav('account')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-zinc-500" />
                <span>Account & Profile</span>
              </button>

              {isAdmin && (
                <button
                  id="sidebar-admin-link"
                  onClick={() => handleNav('admin')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Panel (ronitjain8080)</span>
                </button>
              )}

              <div className="pt-2 pb-1 border-t border-zinc-100 mt-2">
                <button
                  onClick={() => { setSidebarOpen(false); openUploadModal(); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    <span>Post Real Artwork</span>
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">New</span>
                </button>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="px-5 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Browse Mediums
              </p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCategory(c)}
                    className="px-2.5 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-full transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50">
            {user && !isGuest ? (
              <button
                onClick={() => { logout(); setSidebarOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="text-center text-[11px] text-zinc-400">
                artWorks.yo • Contemporary Art Platform
              </div>
            )}
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};

