export type MainTab = 'home' | 'showcase' | 'chat' | 'account' | 'admin';

export type UserRole = 'buyer' | 'seller' | 'admin';

export type Category = 'All' | 'Pencil' | 'Painting' | 'Digital' | 'Sketch' | 'Other';

export type ShowcaseFilter = 'All Media' | 'Photography' | 'Digital 3D' | 'Abstract' | 'Painting' | 'Sculpture';

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email?: string;
  bio?: string;
  followers?: number;
  following?: number;
  location?: string;
  isRealUser?: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  creator: Creator;
  creatorId: string;
  price: number;
  isNFS?: boolean; // Not For Sale
  category: Category | string;
  showcaseCategory?: ShowcaseFilter | string;
  image: string;
  secondaryImages?: string[];
  description: string;
  dimensions: string;
  medium: string;
  year: number;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: number | string;
  listingType: 'sell' | 'showcase' | 'both';
  featured?: boolean;
  isSample?: boolean; // Indicates initial mock post vs real user post
  orientation?: 'portrait' | 'landscape' | 'square';
}

export interface UserProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role: UserRole;
  followersCount: number;
  followingCount: number;
  isGuest: boolean;
  isAdmin?: boolean;
  location?: string;
  website?: string;
  createdAt?: string | number;
}

export interface PurchaseRecord {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkImage: string;
  creatorName: string;
  creatorUsername: string;
  price: number;
  buyerUid?: string;
  buyerName?: string;
  buyerEmail?: string;
  purchasedAt: string;
  status: 'Confirmed' | 'Processing' | 'Delivered';
  certificateId: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSender: boolean;
  artworkAttachment?: {
    id: string;
    title: string;
    image: string;
    price: number;
    creatorName: string;
  };
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole?: string;
  participantAvatar: string;
  participantOnline?: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  messages: Message[];
  artworkContext?: {
    id: string;
    title: string;
    image: string;
    price: number;
  };
}

