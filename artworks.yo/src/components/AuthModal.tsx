import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles, Store, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    authModalMode, 
    authModalPrompt, 
    closeAuthModal, 
    loginWithEmail, 
    signupWithEmail, 
    loginAsDemoUser,
    loginAsAdmin,
    continueAsGuest 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode with props
  React.useEffect(() => {
    setMode(authModalMode);
    setError('');
  }, [authModalMode, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(name, username, email, password, role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AnimatePresence>
      <div 
        id="auth-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200"
        >
          {/* Close button */}
          <button
            id="auth-close-btn"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="pt-8 pb-6 px-8 text-center bg-zinc-50 border-b border-zinc-100">
            <h2 className="text-2xl font-extrabold tracking-tight text-black">
              artWorks.yo
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {authModalPrompt || (mode === 'login' ? 'Welcome back! Sign in to your collector account.' : 'Create your account to showcase, buy, and save.')}
            </p>

            {authModalPrompt && (
              <div className="mt-3 py-1.5 px-3 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-800 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{authModalPrompt}</span>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            <div className="flex bg-zinc-200/70 p-1 rounded-xl mt-5">
              <button
                type="button"
                id="auth-tab-login"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  mode === 'login' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                id="auth-tab-signup"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  mode === 'signup' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Username / Handle
                  </label>
                  <div className="relative">
                    <span className="text-zinc-400 text-sm font-semibold absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                    <input
                      id="signup-username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="alex_creates"
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    />
                  </div>
                </div>

                {/* Role Selection on Signup */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Account Type / Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === 'buyer'
                          ? 'border-black bg-zinc-50 ring-1 ring-black'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-black">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                        <span>Buyer</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Collect and purchase authentic art</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === 'seller'
                          ? 'border-black bg-zinc-50 ring-1 ring-black'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-black">
                        <Store className="w-3.5 h-3.5 text-purple-600" />
                        <span>Seller</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Sell artworks & buy from others</p>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isSubmitting}
              className="w-full py-3 bg-black hover:bg-zinc-800 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-3 text-zinc-400 text-xs font-medium uppercase">Fast Access</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            {/* Admin Quick Login Button for ronitjain8080@gmail.com */}
            <button
              type="button"
              id="auth-admin-quick-login-btn"
              onClick={loginAsAdmin}
              className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Sign In as Admin (ronitjain8080@gmail.com)</span>
            </button>

            {/* Instant Demo Login Button */}
            <button
              type="button"
              id="auth-demo-btn"
              onClick={loginAsDemoUser}
              className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              <span>Demo Collector Profile</span>
            </button>


            {/* Continue as Guest link */}
            <div className="text-center pt-2">
              <button
                type="button"
                id="auth-guest-link"
                onClick={continueAsGuest}
                className="text-xs text-zinc-500 hover:text-black font-semibold uppercase tracking-wider transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
