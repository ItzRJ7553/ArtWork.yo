import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, LayoutGrid, MessageSquare, User } from 'lucide-react';
import { MainTab } from '../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, conversations } = useApp();

  const unreadChatCount = conversations.filter(c => c.unread).length;

  const tabs: Array<{ id: MainTab; label: string; icon: React.FC<{ className?: string; strokeWidth?: number }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'showcase', label: 'Showcase', icon: LayoutGrid },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav 
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] pb-safe"
    >
      <div className="max-w-md mx-auto px-6 h-14 sm:h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors cursor-pointer ${
                isActive ? 'text-[#000000]' : 'text-[#888888] hover:text-[#333333]'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                    isActive ? 'scale-105 stroke-[2.4px]' : 'stroke-[1.8px]'
                  }`} 
                />
                {tab.id === 'chat' && unreadChatCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
                )}
              </div>
              <span 
                className={`text-[10px] sm:text-[11px] mt-1 tracking-tight font-medium ${
                  isActive ? 'font-bold text-[#000000]' : 'text-[#777777]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
