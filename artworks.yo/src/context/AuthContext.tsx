import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USER, ADMIN_USER, INITIAL_REGISTERED_USERS } from '../data/initialData';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from '../lib/firebase';

const ADMIN_EMAIL = 'ronitjain8080@gmail.com';

interface AuthContextType {
  user: UserProfile | null;
  isGuest: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isWelcomeDismissed: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  authModalPrompt: string;
  loading: boolean;
  registeredUsers: UserProfile[];
  setWelcomeDismissed: (val: boolean) => void;
  openAuthModal: (mode?: 'login' | 'signup', prompt?: string) => void;
  closeAuthModal: () => void;
  continueAsGuest: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, username: string, email: string, pass: string, role?: UserRole) => Promise<void>;
  loginAsDemoUser: () => void;
  loginAsAdmin: () => void;
  logout: () => Promise<void>;
  requireAuth: (callback: () => void, promptMessage?: string) => boolean;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  adminUpdateUser: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  adminDeleteUser: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'artworks_yo_user_profile';
const LOCAL_USERS_LIST_KEY = 'artworks_yo_all_users_list';
const WELCOME_DISMISSED_KEY = 'artworks_yo_welcome_dismissed';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          parsed.isAdmin = true;
          parsed.role = 'admin';
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_USERS_LIST_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REGISTERED_USERS;
      }
    }
    return INITIAL_REGISTERED_USERS;
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return !localStorage.getItem(LOCAL_USER_KEY);
  });

  const [isWelcomeDismissed, setIsWelcomeDismissed] = useState<boolean>(() => {
    return localStorage.getItem(WELCOME_DISMISSED_KEY) === 'true';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalPrompt, setAuthModalPrompt] = useState('');
  const [loading, setLoading] = useState(true);

  // Determine if current active user is Admin
  const isAdmin = Boolean(
    user && (
      user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      user.isAdmin === true ||
      user.role === 'admin'
    )
  );

  // Determine if current active user is Seller (Sellers can sell and buy)
  const isSeller = Boolean(user && (user.role === 'seller' || isAdmin));

  useEffect(() => {
    localStorage.setItem(LOCAL_USERS_LIST_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sync auth state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !firebaseUser.isAnonymous) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          const isUserAdminEmail = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            if (isUserAdminEmail) {
              data.isAdmin = true;
              data.role = 'admin';
            }
            setUser(data);
            setIsGuest(false);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data));
          } else {
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || (isUserAdminEmail ? 'Ronit Jain (Admin)' : 'Art Collector'),
              username: (firebaseUser.email?.split('@')[0] || 'collector').toLowerCase().replace(/[^a-z0-9_]/g, ''),
              email: firebaseUser.email || '',
              avatar: isUserAdminEmail
                ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              bio: isUserAdminEmail ? 'Platform Administrator on artWorks.yo' : 'Art enthusiast & collector on artWorks.yo',
              role: isUserAdminEmail ? 'admin' : 'buyer',
              followersCount: isUserAdminEmail ? 9500 : 0,
              followingCount: isUserAdminEmail ? 120 : 0,
              isGuest: false,
              isAdmin: isUserAdminEmail
            };
            setUser(fallbackProfile);
            setIsGuest(false);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(fallbackProfile));
            await setDoc(userDocRef, fallbackProfile).catch(() => {});
            
            // Add to users list
            setRegisteredUsers(prev => {
              if (prev.some(u => u.uid === fallbackProfile.uid || u.email === fallbackProfile.email)) return prev;
              return [fallbackProfile, ...prev];
            });
          }
        } catch (err) {
          console.warn('Firebase user fetch error, using local state:', err);
        }
      } else if (!user) {
        setIsGuest(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setWelcomeDismissed = (val: boolean) => {
    setIsWelcomeDismissed(val);
    localStorage.setItem(WELCOME_DISMISSED_KEY, val ? 'true' : 'false');
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login', prompt: string = '') => {
    setAuthModalMode(mode);
    setAuthModalPrompt(prompt);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalPrompt('');
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    setWelcomeDismissed(true);
    closeAuthModal();
  };

  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
    setIsGuest(false);
    setWelcomeDismissed(true);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEMO_USER));
    closeAuthModal();
  };

  const loginAsAdmin = () => {
    setUser(ADMIN_USER);
    setIsGuest(false);
    setWelcomeDismissed(true);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(ADMIN_USER));
    
    // Ensure in users list
    setRegisteredUsers(prev => {
      if (prev.some(u => u.email === ADMIN_EMAIL)) return prev;
      return [ADMIN_USER, ...prev];
    });

    closeAuthModal();
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const isTargetAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const uid = userCred.user.uid;
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      let profile: UserProfile;
      if (userDoc.exists()) {
        profile = userDoc.data() as UserProfile;
        if (isTargetAdmin) {
          profile.isAdmin = true;
          profile.role = 'admin';
        }
      } else {
        profile = {
          uid,
          name: userCred.user.displayName || (isTargetAdmin ? 'Ronit Jain' : email.split('@')[0]),
          username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
          email,
          avatar: isTargetAdmin 
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          bio: isTargetAdmin ? 'Platform Administrator on artWorks.yo' : 'Art enthusiast & collector on artWorks.yo',
          role: isTargetAdmin ? 'admin' : 'buyer',
          followersCount: isTargetAdmin ? 9500 : 120,
          followingCount: isTargetAdmin ? 120 : 45,
          isGuest: false,
          isAdmin: isTargetAdmin
        };
        await setDoc(userDocRef, profile).catch(() => {});
      }
      setUser(profile);
      setIsGuest(false);
      setWelcomeDismissed(true);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      
      setRegisteredUsers(prev => {
        const filtered = prev.filter(u => u.uid !== profile.uid && u.email !== profile.email);
        return [profile, ...filtered];
      });

      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase login notice, signing in locally:', err.message);
      const profile: UserProfile = {
        uid: isTargetAdmin ? 'admin_ronit_jain' : 'user_' + Date.now(),
        name: isTargetAdmin ? 'Ronit Jain' : email.split('@')[0],
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email,
        avatar: isTargetAdmin 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: isTargetAdmin ? 'Platform Administrator on artWorks.yo' : 'Art Collector on artWorks.yo',
        role: isTargetAdmin ? 'admin' : 'buyer',
        followersCount: isTargetAdmin ? 9500 : 150,
        followingCount: isTargetAdmin ? 120 : 88,
        isGuest: false,
        isAdmin: isTargetAdmin
      };
      setUser(profile);
      setIsGuest(false);
      setWelcomeDismissed(true);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));

      setRegisteredUsers(prev => {
        const filtered = prev.filter(u => u.uid !== profile.uid && u.email !== profile.email);
        return [profile, ...filtered];
      });

      closeAuthModal();
    }
  };

  const signupWithEmail = async (
    name: string, 
    username: string, 
    email: string, 
    pass: string, 
    role: UserRole = 'buyer'
  ) => {
    const isTargetAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const finalRole: UserRole = isTargetAdmin ? 'admin' : role;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = userCred.user.uid;
      const newProfile: UserProfile = {
        uid,
        name: name.trim() || (isTargetAdmin ? 'Ronit Jain' : 'New Collector'),
        username: (username.trim() || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email,
        avatar: isTargetAdmin 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: isTargetAdmin 
          ? 'Platform Administrator on artWorks.yo' 
          : finalRole === 'seller' 
            ? 'Artist & fine art creator showcasing work on artWorks.yo' 
            : 'Art collector discovering original art on artWorks.yo',
        role: finalRole,
        followersCount: isTargetAdmin ? 9500 : 0,
        followingCount: 0,
        isGuest: false,
        isAdmin: isTargetAdmin,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, newProfile).catch(() => {});
      
      setUser(newProfile);
      setIsGuest(false);
      setWelcomeDismissed(true);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));

      setRegisteredUsers(prev => [newProfile, ...prev.filter(u => u.uid !== uid)]);
      closeAuthModal();
    } catch (err: any) {
      console.warn('Firebase signup fallback to local account:', err.message);
      const newProfile: UserProfile = {
        uid: isTargetAdmin ? 'admin_ronit_jain' : 'user_' + Date.now(),
        name: name.trim() || (isTargetAdmin ? 'Ronit Jain' : 'New User'),
        username: (username.trim() || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email,
        avatar: isTargetAdmin 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: isTargetAdmin 
          ? 'Platform Administrator on artWorks.yo' 
          : finalRole === 'seller' 
            ? 'Artist & creator showcasing work on artWorks.yo' 
            : 'Art collector discovering original art on artWorks.yo',
        role: finalRole,
        followersCount: isTargetAdmin ? 9500 : 0,
        followingCount: 0,
        isGuest: false,
        isAdmin: isTargetAdmin,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUser(newProfile);
      setIsGuest(false);
      setWelcomeDismissed(true);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));

      setRegisteredUsers(prev => [newProfile, ...prev.filter(u => u.uid !== newProfile.uid)]);
      closeAuthModal();
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const requireAuth = (callback: () => void, promptMessage?: string): boolean => {
    if (user && !isGuest) {
      callback();
      return true;
    } else {
      openAuthModal('login', promptMessage || 'Please sign in to continue.');
      return false;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    
    // Preserve admin status if email matches
    if (updated.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      updated.isAdmin = true;
      updated.role = 'admin';
    }

    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    
    // Update in registered users list
    setRegisteredUsers(prev => prev.map(u => u.uid === user.uid ? updated : u));

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, updated, { merge: true });
    } catch (e) {
      console.warn('Error syncing updated profile to Firebase:', e);
    }
  };

  const setUserRole = async (role: UserRole) => {
    if (!user) return;
    await updateUserProfile({ role });
  };

  const adminUpdateUser = async (uid: string, updates: Partial<UserProfile>) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.uid === uid) {
        return { ...u, ...updates };
      }
      return u;
    }));

    if (user && user.uid === uid) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }

    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, updates, { merge: true });
    } catch (e) {}
  };

  const adminDeleteUser = async (uid: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.uid !== uid));
    if (user && user.uid === uid) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: !user || isGuest,
        isAdmin,
        isSeller,
        isWelcomeDismissed,
        authModalOpen,
        authModalMode,
        authModalPrompt,
        loading,
        registeredUsers,
        setWelcomeDismissed,
        openAuthModal,
        closeAuthModal,
        continueAsGuest,
        loginWithEmail,
        signupWithEmail,
        loginAsDemoUser,
        loginAsAdmin,
        logout,
        requireAuth,
        updateUserProfile,
        setUserRole,
        adminUpdateUser,
        adminDeleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

