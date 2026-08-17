import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const WelcomeModal: React.FC = () => {
  const { isWelcomeDismissed, setWelcomeDismissed, openAuthModal, continueAsGuest } = useAuth();

  if (isWelcomeDismissed) return null;

  return (
    <AnimatePresence>
      <div 
        id="welcome-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAFA]/95 backdrop-blur-md px-6 py-8 overflow-y-auto"
      >
        {/* Background Subtle Gallery Art Element */}
        <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden flex items-center justify-center">
          <div className="w-[85vw] max-w-[540px] aspect-[4/3] border border-[#E5E5E5] rounded-xl bg-white shadow-2xl p-6 flex flex-col justify-between">
            <div className="flex-1 bg-[#F5F5F5] rounded-lg border border-dashed border-[#E0E0E0] relative flex items-center justify-center overflow-hidden">
              <div className="w-16 h-8 bg-rose-200/50 rounded-full blur-sm absolute bottom-8 right-12 transform rotate-12" />
              <div className="text-[11px] uppercase tracking-widest text-[#999999] font-medium">
                Gallery Minimalist Abstracts
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#A0A0A0] mt-3 font-mono">
              <span>Dimensions: 48" × 60"</span>
              <span>Canon 5D Mark IV • ISO 200</span>
            </div>
          </div>
        </div>

        {/* Foreground Content Card - Exact replication of Welcome Screen */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-sm flex flex-col items-center text-center bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-2xl shadow-xl shadow-black/5"
        >
          {/* Logo Brand Title */}
          <h1 
            id="welcome-brand-title" 
            className="text-[32px] sm:text-[36px] font-extrabold text-[#000000] tracking-tight mb-2"
          >
            artWorks.yo
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] text-[#555555] font-normal mb-8 max-w-[260px] leading-relaxed">
            Discover, showcase and buy artwork.
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            {/* Log In Button - Solid Black */}
            <button
              id="welcome-login-btn"
              onClick={() => openAuthModal('login')}
              className="w-full h-12 bg-[#000000] hover:bg-[#222222] active:scale-[0.99] text-white text-[14px] font-bold tracking-wider uppercase rounded-xl transition-all shadow-md shadow-black/10 cursor-pointer flex items-center justify-center"
            >
              Log In
            </button>

            {/* Create Account Button - White with Black Border */}
            <button
              id="welcome-signup-btn"
              onClick={() => openAuthModal('signup')}
              className="w-full h-12 bg-white hover:bg-[#F9F9F9] active:scale-[0.99] text-[#000000] border border-[#000000] text-[14px] font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center"
            >
              Create Account
            </button>

            {/* Continue as Guest Button - Text Action */}
            <button
              id="welcome-guest-btn"
              onClick={continueAsGuest}
              className="w-full py-3 text-[#444444] hover:text-[#000000] text-[13px] font-semibold tracking-wider uppercase transition-colors cursor-pointer pt-3"
            >
              Continue as Guest
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F0F0F0] w-full text-[11px] text-[#888888]">
            Explore curated fine art, photography, drawings & sculptures.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
