import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/TopHeader';
import { Navigation } from './components/Navigation';
import { SidebarDrawer } from './components/SidebarDrawer';
import { HomeFeed } from './components/HomeFeed';
import { ShowcaseFeed } from './components/ShowcaseFeed';
import { ChatView } from './components/ChatView';
import { AccountView } from './components/AccountView';
import { AdminPanel } from './components/AdminPanel';
import { WelcomeModal } from './components/WelcomeModal';
import { AuthModal } from './components/AuthModal';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { UploadArtworkModal } from './components/UploadArtworkModal';
import { PurchaseModal } from './components/PurchaseModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] flex flex-col antialiased">
      {/* Top Header */}
      <TopHeader />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'showcase' && <ShowcaseFeed />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'account' && <AccountView />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>


      {/* Fixed Bottom Navigation (Home | Showcase | Chat | Account) */}
      <Navigation />

      {/* Side Navigation Drawer */}
      <SidebarDrawer />

      {/* Modals & Overlays */}
      <WelcomeModal />
      <AuthModal />
      <ArtworkDetailModal />
      <UploadArtworkModal />
      <PurchaseModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
