import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { X, User, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: name.trim() || user.name,
        username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || user.username,
        bio: bio.trim(),
        avatar
      });
      showToast('Profile updated successfully!', 'success');
      onClose();
    } catch (e) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="edit-profile-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200"
        >
          <div className="p-6 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-black">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-4">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Profile Avatar
              </label>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={avatar}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-black"
                />
                <div className="flex gap-1.5 overflow-x-auto">
                  {AVATAR_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(p)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                        avatar === p ? 'border-black ring-2 ring-black/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Handle
              </label>
              <div className="relative">
                <span className="text-zinc-400 text-xs font-bold absolute left-3 top-1/2 -translate-y-1/2">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-7 pr-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Curator Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-black resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer mt-2"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
