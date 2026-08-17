import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Menu, Search, SquarePen, X, Sparkles, Plus, Heart, ShoppingBag, ShieldCheck } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    setSidebarOpen,
    openUploadModal,
    conversations
  } = useApp();
  
  const { user, isGuest, isAdmin, openAuthModal } = useAuth();
  const [showSearchInput, setShowSearchInput] = useState(false);

  const unreadMessagesCount = conversations.filter(c => c.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Action: Hamburger Menu */}
        <div className="flex items-center gap-3">
          <button
            id="header-menu-btn"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-[#111111] hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 ml-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-sm font-semibold transition-colors ${
                activeTab === 'home' ? 'text-black border-b-2 border-black pb-0.5' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`text-sm font-semibold transition-colors ${
                activeTab === 'showcase' ? 'text-black border-b-2 border-black pb-0.5' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Showcase
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat' ? 'text-black border-b-2 border-black pb-0.5' : 'text-zinc-500 hover:text-black'
              }`}
            >
              <span>Chat</span>
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`text-sm font-semibold transition-colors ${
                activeTab === 'account' ? 'text-black border-b-2 border-black pb-0.5' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Account
            </button>

            {isAdmin && (
              <button
                id="header-admin-tab-btn"
                onClick={() => setActiveTab('admin')}
                className={`text-sm font-bold transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                  activeTab === 'admin'
                    ? 'bg-black text-white'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Hub</span>
              </button>
            )}
          </nav>
        </div>


        {/* Center: Brand Logo */}
        <div className="flex-1 flex justify-center md:flex-none">
          <button
            id="header-brand-logo"
            onClick={() => setActiveTab('home')}
            className="text-[20px] sm:text-[22px] font-extrabold tracking-tight text-[#000000] hover:opacity-85 transition-opacity cursor-pointer"
          >
            artWorks.yo
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center relative w-56">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artwork, artist..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-zinc-100 border border-transparent rounded-full focus:bg-white focus:border-zinc-300 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Desktop Upload Button */}
          <button
            onClick={openUploadModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Art</span>
          </button>

          {/* Chat tab shows Compose button, otherwise Search toggle icon */}
          {activeTab === 'chat' ? (
            <button
              id="header-compose-btn"
              onClick={() => setActiveTab('showcase')}
              title="Explore artists to message"
              className="p-2 -mr-2 text-[#111111] hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              aria-label="New Message"
            >
              <SquarePen className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          ) : (
            <button
              id="header-search-toggle-btn"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-2 -mr-2 text-[#111111] hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* User Avatar Chip on Desktop */}
          {user && !isGuest && (
            <button
              onClick={() => setActiveTab('account')}
              className="hidden md:flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-zinc-200"
              />
            </button>
          )}

          {isGuest && (
            <button
              onClick={() => openAuthModal('login')}
              className="hidden md:block text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-zinc-300 rounded-full hover:border-black transition-colors"
            >
              Log In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {showSearchInput && (
        <div className="lg:hidden px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artwork, artist, medium..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSearchInput(false)}
            className="text-xs font-semibold text-zinc-600 px-2 py-1 hover:text-black"
          >
            Cancel
          </button>
        </div>
      )}
    </header>
  );
};
