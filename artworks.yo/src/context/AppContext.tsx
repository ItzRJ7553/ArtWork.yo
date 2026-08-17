import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MainTab, 
  Category, 
  ShowcaseFilter, 
  Artwork, 
  Creator, 
  PurchaseRecord, 
  Conversation, 
  Message 
} from '../types';
import { 
  INITIAL_ARTWORKS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_CREATORS 
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  getDocs, 
  onSnapshot 
} from '../lib/firebase';


interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  artworks: Artwork[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedShowcaseFilter: ShowcaseFilter;
  setSelectedShowcaseFilter: (f: ShowcaseFilter) => void;
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (art: Artwork | null) => void;
  selectedCreator: Creator | null;
  setSelectedCreator: (c: Creator | null) => void;
  savedArtworkIds: string[];
  toggleSaveArtwork: (artworkId: string) => void;
  isArtworkSaved: (artworkId: string) => boolean;
  toggleLikeArtwork: (artworkId: string) => void;
  purchases: PurchaseRecord[];
  isPurchaseModalOpen: boolean;
  purchasingArtwork: Artwork | null;
  openPurchaseModal: (art: Artwork) => void;
  closePurchaseModal: () => void;
  completePurchase: (artwork: Artwork, shippingDetails: any) => Promise<PurchaseRecord>;
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  uploadArtwork: (data: Partial<Artwork>) => Promise<Artwork>;
  deleteArtwork: (artworkId: string) => Promise<boolean>;
  purgeSampleArtworks: () => Promise<number>;
  toggleFeatureArtwork: (artworkId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: 'Confirmed' | 'Processing' | 'Delivered') => Promise<void>;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (c: Conversation | null) => void;
  sendMessage: (convId: string, text: string, artworkAttachment?: any) => Promise<void>;
  startChatWithArtist: (artist: Creator, artworkContext?: Artwork) => void;
  myUploadedArtworks: Artwork[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_ARTWORKS_KEY = 'artworks_yo_all_artworks';
const LOCAL_SAVED_KEY = 'artworks_yo_saved_ids';
const LOCAL_PURCHASES_KEY = 'artworks_yo_purchases';
const LOCAL_CONVERSATIONS_KEY = 'artworks_yo_conversations';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, requireAuth } = useAuth();

  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedShowcaseFilter, setSelectedShowcaseFilter] = useState<ShowcaseFilter>('All Media');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toast system
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Artworks state
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    const saved = localStorage.getItem(LOCAL_ARTWORKS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ARTWORKS;
      }
    }
    return INITIAL_ARTWORKS;
  });

  // Saved Artworks
  const [savedArtworkIds, setSavedArtworkIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_SAVED_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['art-geometric-echoes', 'art-silent-tide'];
      }
    }
    return ['art-geometric-echoes', 'art-silent-tide'];
  });

  // Purchases
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_PURCHASES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'purch_sample_1',
        artworkId: 'art-structure-in-void',
        artworkTitle: 'Structure in Void',
        artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
        creatorName: 'Marcus Thorne',
        creatorUsername: 'marcus_thorne',
        price: 820,
        purchasedAt: '2024-10-15',
        status: 'Delivered',
        certificateId: 'AY-CERT-8842-MT',
        shippingAddress: {
          fullName: 'Alex Mercer',
          street: '452 Broadway Apt 4B',
          city: 'New York',
          postalCode: '10013',
          country: 'United States'
        }
      }
    ];
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(LOCAL_CONVERSATIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CONVERSATIONS;
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Modals
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchasingArtwork, setPurchasingArtwork] = useState<Artwork | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_ARTWORKS_KEY, JSON.stringify(artworks));
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(savedArtworkIds));
  }, [savedArtworkIds]);

  useEffect(() => {
    localStorage.setItem(LOCAL_PURCHASES_KEY, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(LOCAL_CONVERSATIONS_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Try fetching artworks from Firestore on startup
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'artworks'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: Artwork[] = [];
          snapshot.forEach((d) => {
            remoteList.push(d.data() as Artwork);
          });
          // Merge with initial if not already present
          setArtworks((prev) => {
            const map = new Map<string, Artwork>();
            INITIAL_ARTWORKS.forEach((a) => map.set(a.id, a));
            prev.forEach((a) => map.set(a.id, a));
            remoteList.forEach((a) => map.set(a.id, a));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Firestore real-time sync listening notice:', err.message);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase snapshot initialization fallback:', e);
    }
  }, []);

  const isArtworkSaved = (id: string) => {
    return savedArtworkIds.includes(id);
  };

  const toggleSaveArtwork = (id: string) => {
    const allowed = requireAuth(() => {
      setSavedArtworkIds((prev) => {
        const isSaved = prev.includes(id);
        const next = isSaved ? prev.filter((item) => item !== id) : [...prev, id];
        showToast(isSaved ? 'Removed from Saved Artworks' : 'Saved to your collection ❤️', 'info');
        
        // Sync with Firestore if logged in
        if (user) {
          try {
            setDoc(doc(db, 'saved', `${user.uid}_${id}`), {
              userId: user.uid,
              artworkId: id,
              saved: !isSaved,
              timestamp: Date.now()
            }).catch(() => {});
          } catch (e) {}
        }
        return next;
      });
    }, 'Sign in to save artworks to your personal collection.');
  };

  const toggleLikeArtwork = (id: string) => {
    setArtworks((prev) =>
      prev.map((art) => {
        if (art.id === id) {
          const isLiked = !art.isLiked;
          const likes = isLiked ? art.likes + 1 : Math.max(0, art.likes - 1);
          return { ...art, isLiked, likes };
        }
        return art;
      })
    );
  };

  const openPurchaseModal = (art: Artwork) => {
    requireAuth(() => {
      setPurchasingArtwork(art);
      setIsPurchaseModalOpen(true);
    }, 'Sign in to securely buy this artwork.');
  };

  const closePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setPurchasingArtwork(null);
  };

  const completePurchase = async (artwork: Artwork, shippingDetails: any): Promise<PurchaseRecord> => {
    const newRecord: PurchaseRecord = {
      id: 'order_' + Date.now(),
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      artworkImage: artwork.image,
      creatorName: artwork.creator.name,
      creatorUsername: artwork.creator.username,
      price: artwork.price,
      purchasedAt: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      certificateId: `AY-CERT-${Math.floor(1000 + Math.random() * 9000)}-${artwork.creator.username.substring(0, 2).toUpperCase()}`,
      shippingAddress: shippingDetails || {
        fullName: user?.name || 'Art Collector',
        street: '120 Gallery Row',
        city: 'New York',
        postalCode: '10001',
        country: 'USA'
      }
    };

    setPurchases((prev) => [newRecord, ...prev]);
    showToast(`Order confirmed for "${artwork.title}"! Added to My Purchases.`, 'success');

    // Save to Firestore
    try {
      await setDoc(doc(db, 'purchases', newRecord.id), {
        ...newRecord,
        buyerUid: user?.uid || 'guest'
      });
    } catch (e) {
      console.warn('Firestore purchase write fallback:', e);
    }

    return newRecord;
  };

  const openUploadModal = () => {
    requireAuth(() => {
      setIsUploadModalOpen(true);
    }, 'Sign in to upload and showcase your artwork.');
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const uploadArtwork = async (data: Partial<Artwork>): Promise<Artwork> => {
    const creatorInfo: Creator = {
      id: user?.uid || 'user_creator',
      name: user?.name || 'Alex Mercer',
      username: user?.username || 'alex_creates',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: user?.bio || 'Artist & Collector',
      followers: user?.followersCount || 120,
      following: user?.followingCount || 80
    };

    const newArt: Artwork = {
      id: 'art_' + Date.now(),
      title: data.title || 'Untitled Creation',
      creator: creatorInfo,
      creatorId: creatorInfo.id,
      price: Number(data.price) || 0,
      isNFS: data.isNFS || data.listingType === 'showcase',
      category: data.category || 'Painting',
      showcaseCategory: data.showcaseCategory || 'Painting',
      image: data.image || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      description: data.description || '',
      dimensions: data.dimensions || '24" × 36"',
      medium: data.medium || 'Original Medium',
      year: new Date().getFullYear(),
      likes: 0,
      createdAt: Date.now(),
      listingType: data.listingType || 'both',
      featured: false,
      isSample: false // Real user uploaded post
    };

    setArtworks((prev) => [newArt, ...prev]);
    showToast(`"${newArt.title}" has been successfully published!`, 'success');

    // Firestore record
    try {
      await setDoc(doc(db, 'artworks', newArt.id), newArt);
    } catch (e) {
      console.warn('Firestore upload write notice:', e);
    }

    closeUploadModal();
    return newArt;
  };

  const deleteArtwork = async (artworkId: string): Promise<boolean> => {
    setArtworks((prev) => prev.filter((a) => a.id !== artworkId));
    if (selectedArtwork?.id === artworkId) {
      setSelectedArtwork(null);
    }
    showToast('Post removed successfully.', 'info');

    try {
      await deleteDoc(doc(db, 'artworks', artworkId));
    } catch (e) {
      console.warn('Firestore delete error notice:', e);
    }
    return true;
  };

  const purgeSampleArtworks = async (): Promise<number> => {
    let count = 0;
    setArtworks((prev) => {
      const realOnly = prev.filter((a) => !a.isSample);
      count = prev.length - realOnly.length;
      return realOnly;
    });

    showToast(`Removed all fake sample postings (${count} posts removed). Only genuine user posts remain.`, 'success');
    return count;
  };

  const toggleFeatureArtwork = async (artworkId: string) => {
    setArtworks((prev) =>
      prev.map((a) => {
        if (a.id === artworkId) {
          const next = { ...a, featured: !a.featured };
          try {
            setDoc(doc(db, 'artworks', artworkId), { featured: next.featured }, { merge: true }).catch(() => {});
          } catch (e) {}
          return next;
        }
        return a;
      })
    );
    showToast('Artwork spotlight status updated.', 'info');
  };

  const updateOrderStatus = async (orderId: string, status: 'Confirmed' | 'Processing' | 'Delivered') => {
    setPurchases((prev) =>
      prev.map((p) => {
        if (p.id === orderId) {
          return { ...p, status };
        }
        return p;
      })
    );
    showToast(`Order status updated to ${status}.`, 'info');
    try {
      await setDoc(doc(db, 'purchases', orderId), { status }, { merge: true });
    } catch (e) {}
  };


  const sendMessage = async (convId: string, text: string, artworkAttachment?: any) => {
    if (!text.trim() && !artworkAttachment) return;

    const newMessage: Message = {
      id: 'msg_' + Date.now(),
      senderId: user?.uid || 'user_alex_mercer',
      senderName: user?.name || 'Alex Mercer',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true,
      artworkAttachment
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const updatedMessages = [...c.messages, newMessage];
          return {
            ...c,
            lastMessage: text.trim() || `Shared artwork: ${artworkAttachment?.title}`,
            lastTimestamp: 'Just now',
            unread: false,
            messages: updatedMessages
          };
        }
        return c;
      })
    );

    if (activeConversation && activeConversation.id === convId) {
      setActiveConversation((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: text.trim() || `Shared artwork: ${artworkAttachment?.title}`,
              lastTimestamp: 'Just now',
              messages: [...prev.messages, newMessage]
            }
          : null
      );
    }

    // Firestore sync
    try {
      await setDoc(doc(db, 'chats', convId, 'messages', newMessage.id), newMessage);
    } catch (e) {}
  };

  const startChatWithArtist = (artist: Creator, artworkContext?: Artwork) => {
    requireAuth(() => {
      // Find if conversation exists
      const existing = conversations.find(
        (c) => c.participantId === artist.id || c.participantName.toLowerCase() === artist.name.toLowerCase()
      );

      if (existing) {
        setActiveConversation(existing);
        setActiveTab('chat');
      } else {
        const newConv: Conversation = {
          id: 'conv_' + Date.now(),
          participantId: artist.id,
          participantName: artist.name,
          participantAvatar: artist.avatar,
          participantRole: 'Artist',
          participantOnline: true,
          lastMessage: artworkContext ? `Inquiry regarding "${artworkContext.title}"` : 'Conversation started',
          lastTimestamp: 'Just now',
          unread: false,
          artworkContext: artworkContext ? {
            id: artworkContext.id,
            title: artworkContext.title,
            image: artworkContext.image,
            price: artworkContext.price
          } : undefined,
          messages: artworkContext ? [
            {
              id: 'init_msg_' + Date.now(),
              senderId: user?.uid || 'user_alex',
              senderName: user?.name || 'Alex Mercer',
              text: `Hello ${artist.name}, I am interested in your piece "${artworkContext.title}". Is it available for private viewing or acquisition?`,
              timestamp: 'Just now',
              isSender: true,
              artworkAttachment: {
                id: artworkContext.id,
                title: artworkContext.title,
                image: artworkContext.image,
                price: artworkContext.price,
                creatorName: artist.name
              }
            }
          ] : []
        };

        setConversations((prev) => [newConv, ...prev]);
        setActiveConversation(newConv);
        setActiveTab('chat');
        showToast(`Connected with ${artist.name}`, 'info');
      }
    }, `Sign in to message ${artist.name}.`);
  };

  const myUploadedArtworks = artworks.filter(
    (a) => a.creatorId === user?.uid || a.creator.name === user?.name || a.creator.username === user?.username
  );

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        artworks,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedShowcaseFilter,
        setSelectedShowcaseFilter,
        selectedArtwork,
        setSelectedArtwork,
        selectedCreator,
        setSelectedCreator,
        savedArtworkIds,
        toggleSaveArtwork,
        isArtworkSaved,
        toggleLikeArtwork,
        purchases,
        isPurchaseModalOpen,
        purchasingArtwork,
        openPurchaseModal,
        closePurchaseModal,
        completePurchase,
        isUploadModalOpen,
        openUploadModal,
        closeUploadModal,
        uploadArtwork,
        deleteArtwork,
        purgeSampleArtworks,
        toggleFeatureArtwork,
        updateOrderStatus,
        conversations,

        activeConversation,
        setActiveConversation,
        sendMessage,
        startChatWithArtist,
        myUploadedArtworks,
        toasts,
        showToast,
        sidebarOpen,
        setSidebarOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
