import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Conversation, Message } from '../types';
import { 
  Search, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  ExternalLink,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ChatView: React.FC = () => {
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    sendMessage,
    setSelectedArtwork,
    artworks
  } = useApp();

  const { user, isGuest, openAuthModal } = useAuth();
  const [chatSearch, setChatSearch] = useState('');
  const [inputText, setInputText] = useState('');

  // If user is guest, show guest sign-in banner
  if (isGuest) {
    return (
      <div id="chat-guest-view" className="w-full max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-zinc-700" />
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Direct Artist Messaging</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Sign in to start private inquiries, discuss commissions, and coordinate acquisitions with artists and gallery curators.
          </p>
          <button
            onClick={() => openAuthModal('login', 'Sign in to access artist messaging.')}
            className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
          >
            Log In / Create Account
          </button>
        </div>
      </div>
    );
  }

  // Filter conversations by search
  const filteredConversations = conversations.filter(c => 
    c.participantName.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !inputText.trim()) return;

    sendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  const handleQuickPreset = (presetText: string) => {
    if (!activeConversation) return;
    sendMessage(activeConversation.id, presetText);
  };

  // If active conversation is selected, render full interactive chat screen
  if (activeConversation) {
    const referencedArt = activeConversation.artworkContext 
      ? artworks.find(a => a.id === activeConversation.artworkContext?.id) || activeConversation.artworkContext
      : null;

    return (
      <div id="active-chat-thread" className="w-full max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-9rem)] bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden my-2">
        {/* Chat Thread Header */}
        <div className="p-3.5 sm:p-4 bg-zinc-50/90 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveConversation(null)}
              className="p-1.5 -ml-1 text-zinc-600 hover:text-black hover:bg-zinc-200/60 rounded-full transition-colors"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <img
                src={activeConversation.participantAvatar}
                alt={activeConversation.participantName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-zinc-200"
              />
              {activeConversation.participantOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
              )}
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-black leading-tight flex items-center gap-1.5">
                <span>{activeConversation.participantName}</span>
                {activeConversation.participantRole && (
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 bg-zinc-200/70 px-1.5 py-0.5 rounded">
                    {activeConversation.participantRole}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {activeConversation.participantOnline ? 'Active now' : 'Artist Portfolio'}
              </p>
            </div>
          </div>

          {referencedArt && (
            <button
              onClick={() => {
                const fullArt = artworks.find(a => a.id === referencedArt.id);
                if (fullArt) setSelectedArtwork(fullArt);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 transition-colors"
            >
              <img 
                src={referencedArt.image} 
                alt={referencedArt.title} 
                className="w-5 h-5 rounded object-cover"
              />
              <span className="hidden sm:inline truncate max-w-[100px]">{referencedArt.title}</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </button>
          )}
        </div>

        {/* Pinned Artwork Context Banner */}
        {activeConversation.artworkContext && (
          <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="font-semibold">Inquiry:</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{activeConversation.artworkContext.title}</span>
              <span className="font-bold">${activeConversation.artworkContext.price}</span>
            </div>
            <span className="text-[10px] text-amber-700 font-mono bg-amber-100 px-1.5 py-0.5 rounded">Verified Listing</span>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/40">
          {activeConversation.messages.map((msg) => {
            const isMe = msg.senderId === user?.uid || msg.isSender;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Artwork Attachment Bubble if present */}
                {msg.artworkAttachment && (
                  <div 
                    onClick={() => {
                      const fullArt = artworks.find(a => a.id === msg.artworkAttachment?.id);
                      if (fullArt) setSelectedArtwork(fullArt);
                    }}
                    className={`mb-1 p-2 rounded-xl border max-w-xs cursor-pointer hover:opacity-90 transition-opacity ${
                      isMe ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-zinc-900 border-zinc-200'
                    }`}
                  >
                    <img 
                      src={msg.artworkAttachment.image} 
                      alt={msg.artworkAttachment.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover rounded-lg mb-1.5"
                    />
                    <div className="flex justify-between items-center text-xs px-1">
                      <span className="font-bold truncate">{msg.artworkAttachment.title}</span>
                      <span className="font-mono ml-2">${msg.artworkAttachment.price}</span>
                    </div>
                  </div>
                )}

                {/* Message Text Bubble */}
                <div
                  className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-black text-white rounded-tr-xs shadow-sm'
                      : 'bg-zinc-200/80 text-zinc-900 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-zinc-400 mt-1 px-1 flex items-center gap-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Inquiry Preset Suggestions */}
        <div className="px-3 py-1.5 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleQuickPreset('Is this original piece still available?')}
            className="px-2.5 py-1 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            Is this piece available?
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Can you arrange custom archival framing?')}
            className="px-2.5 py-1 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            Custom framing inquiry
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Does this artwork come with a certificate of authenticity?')}
            className="px-2.5 py-1 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            Certificate inquiry
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
          <input
            type="text"
            id="chat-message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeConversation.participantName}...`}
            className="flex-1 px-4 py-2.5 bg-zinc-100 rounded-full text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
          />

          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputText.trim()}
            className="p-2.5 bg-black hover:bg-zinc-800 disabled:opacity-30 text-white rounded-full transition-all cursor-pointer shadow-sm"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Conversation List View (Exact replica of Image 8.png)
  return (
    <div id="messages-list-view" className="w-full max-w-xl mx-auto pb-24 px-4 sm:px-0">
      {/* Title Header - Matches Image 8.png */}
      <div className="pt-4 pb-3">
        <h1 
          id="messages-heading"
          className="text-[26px] sm:text-[30px] font-extrabold text-[#111111] tracking-tight"
        >
          Messages
        </h1>
      </div>

      {/* Search Bar - Rounded input with search icon matching Image 8.png */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          id="chat-search-input"
          value={chatSearch}
          onChange={(e) => setChatSearch(e.target.value)}
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2.5 bg-[#F2F2F2] hover:bg-[#EBEBEB] focus:bg-white text-sm text-[#111111] placeholder:text-zinc-500 rounded-xl border border-transparent focus:border-zinc-300 focus:outline-none transition-all"
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-700">No conversations found</p>
            <p className="text-xs text-zinc-400 mt-1">
              Browse Home or Showcase to message creators directly about artworks.
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            return (
              <div
                key={conv.id}
                id={`conversation-item-${conv.id}`}
                onClick={() => setActiveConversation(conv)}
                className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl hover:bg-zinc-100/80 active:bg-zinc-200/60 transition-colors cursor-pointer group"
              >
                {/* Avatar with Blue unread dot matching Image 8.png */}
                <div className="relative shrink-0">
                  {/* Circular avatar wrapper */}
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                    {conv.participantAvatar ? (
                      <img
                        src={conv.participantAvatar}
                        alt={conv.participantName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-bold text-zinc-600">
                        {conv.participantName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Active/Unread blue indicator pill/dot in top right of avatar */}
                  {conv.unread && (
                    <span 
                      id={`unread-dot-${conv.id}`}
                      className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#3B82F6] rounded-full border-2 border-white shadow-xs" 
                    />
                  )}
                </div>

                {/* Conversation text content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111] truncate group-hover:text-black">
                      {conv.participantName}
                    </h3>
                    <span className="text-[11px] sm:text-[12px] text-zinc-400 shrink-0 font-medium">
                      {conv.lastTimestamp}
                    </span>
                  </div>

                  <p className={`text-[13px] truncate ${conv.unread ? 'font-semibold text-zinc-900' : 'text-zinc-500 font-normal'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
