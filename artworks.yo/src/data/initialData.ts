import { Artwork, Creator, Conversation, UserProfile } from '../types';

export const INITIAL_CREATORS: Record<string, Creator> = {
  elena: {
    id: 'creator_elena',
    name: 'Elena Rostova',
    username: 'elena_rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Berlin-based visual artist & architectural photographer exploring spatial geometry, light dispersion, and modular structures.',
    followers: 4820,
    following: 310,
    location: 'Berlin, Germany'
  },
  marcus_thorne: {
    id: 'creator_marcus_thorne',
    name: 'Marcus Thorne',
    username: 'marcus_thorne',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Architectural draftsman & brutalist pencil artist. Investigating structural gravity and void spaces.',
    followers: 3290,
    following: 195,
    location: 'London, UK'
  },
  aria: {
    id: 'creator_aria',
    name: 'Aria Vance',
    username: 'aria_vance',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    bio: 'Contemporary oil painter capturing atmospheric seascape textures and monochromatic coastal tides.',
    followers: 6140,
    following: 420,
    location: 'Copenhagen, Denmark'
  },
  marcus_chen: {
    id: 'creator_marcus_chen',
    name: 'Marcus Chen',
    username: 'marcuschen_art',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Digital abstract painter exploring fluid dynamics, mineral pigment simulations, and iridescent palettes.',
    followers: 8920,
    following: 540,
    location: 'Singapore'
  },
  studio_blanc: {
    id: 'creator_studio_blanc',
    name: 'Studio Blanc',
    username: 'studio_blanc',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    bio: 'Sculptural design atelier focusing on tactile matte ceramics, parametric curves, and architectural stillness.',
    followers: 12400,
    following: 180,
    location: 'Tokyo, Japan'
  },
  sarah: {
    id: 'creator_sarah',
    name: 'Sarah Jenkins',
    username: 'sarah_jenkins',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bio: 'Macro botanical fine-art photographer exploring organic decay, delicate shadows, and botanical silhouettes.',
    followers: 2750,
    following: 312,
    location: 'Melbourne, Australia'
  },
  david: {
    id: 'creator_david',
    name: 'David O\'Connor',
    username: 'david_oconnor',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    bio: 'Landscape minimalist painting desert horizons, tectonic gradients, and muted earth pigment color fields.',
    followers: 5310,
    following: 280,
    location: 'Santa Fe, USA'
  }
};

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'art-geometric-echoes',
    title: 'Geometric Echoes IV',
    creator: INITIAL_CREATORS.elena,
    creatorId: INITIAL_CREATORS.elena.id,
    price: 450,
    category: 'Pencil',
    showcaseCategory: 'Digital 3D',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'An immersive geometric light and suspended polygonal installation study examining reflection, equilibrium, and spatial shadow choreography in museum galleries.',
    dimensions: '48" × 60" (122 × 152 cm)',
    medium: 'Suspended illuminated acrylic wire sculpture & archival graphite study',
    year: 2024,
    likes: 342,
    listingType: 'both',
    featured: true,
    isSample: true,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'art-structure-in-void',
    title: 'Structure in Void',
    creator: INITIAL_CREATORS.marcus_thorne,
    creatorId: INITIAL_CREATORS.marcus_thorne.id,
    price: 820,
    category: 'Pencil',
    showcaseCategory: 'Abstract',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Sharp architectural pencil and graphite composition focusing on intersecting cantilevered concrete planes, intense chiaroscuro contrast, and structural tension.',
    dimensions: '24" × 32" (61 × 81 cm)',
    medium: 'Archival graphite & charcoal on 300gsm cold-press cotton rag',
    year: 2023,
    likes: 512,
    listingType: 'both',
    featured: true,
    isSample: true,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'art-silent-tide',
    title: 'Silent Tide',
    creator: INITIAL_CREATORS.aria,
    creatorId: INITIAL_CREATORS.aria.id,
    price: 1200,
    category: 'Painting',
    showcaseCategory: 'Painting',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
    secondaryImages: [
      'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Atmospheric monochromatic seascape capturing dense fog rolling over turbulent dark coastal water. Heavy impasto oil strokes create a tactile, sculptural surface texture.',
    dimensions: '36" × 48" (91 × 122 cm)',
    medium: 'Heavy body oil on custom-stretched Belgian linen',
    year: 2024,
    likes: 890,
    listingType: 'both',
    featured: true,
    isSample: true,
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'art-urban-geometry-4',
    title: 'Urban Geometry No. 4',
    creator: INITIAL_CREATORS.elena,
    creatorId: INITIAL_CREATORS.elena.id,
    price: 1200,
    category: 'Digital',
    showcaseCategory: 'Photography',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    description: 'A stunning high-contrast black and white architectural photograph focusing on sharp geometric lines of a modern skyscraper vanishing into the sky.',
    dimensions: '40" × 60" (101 × 152 cm)',
    medium: 'Archival pigment print mounted on aluminum dibond, signed edition of 10',
    year: 2023,
    likes: 1240,
    listingType: 'both',
    featured: true,
    isSample: true,
    createdAt: Date.now() - 86400000 * 9
  },
  {
    id: 'art-ethereal-tides',
    title: 'Ethereal Tides',
    creator: INITIAL_CREATORS.marcus_chen,
    creatorId: INITIAL_CREATORS.marcus_chen.id,
    price: 850,
    category: 'Digital',
    showcaseCategory: 'Digital 3D',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
    description: 'A vibrant, fluid abstract digital painting featuring sweeping strokes of deep cobalt blue, muted gold, and stark white evoking ocean currents.',
    dimensions: '30" × 45" (76 × 114 cm)',
    medium: 'Ultra-high definition digital simulation printed on Hahnemühle Museum Etching',
    year: 2024,
    likes: 730,
    listingType: 'both',
    isSample: true,
    createdAt: Date.now() - 86400000 * 12
  },
  {
    id: 'art-interlocking-forms',
    title: 'Interlocking Forms',
    creator: INITIAL_CREATORS.studio_blanc,
    creatorId: INITIAL_CREATORS.studio_blanc.id,
    price: 0,
    isNFS: true,
    category: 'Other',
    showcaseCategory: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    description: 'A minimalist 3D rendering of a smooth, matte white ceramic continuous knot sculpture resting on a subtle pale grey pedestal in an open gallery.',
    dimensions: '18" × 18" × 22" (45 × 45 × 56 cm)',
    medium: 'Hand-cast porcelain stoneware with matte non-reflective glaze',
    year: 2024,
    likes: 1540,
    listingType: 'showcase',
    isSample: true,
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: 'art-fragility-study',
    title: 'Fragility Study I',
    creator: INITIAL_CREATORS.sarah,
    creatorId: INITIAL_CREATORS.sarah.id,
    price: 450,
    category: 'Other',
    showcaseCategory: 'Photography',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85',
    description: 'A stark, high-resolution macro photograph of a single dried flower stem illuminated against an absolute deep black background, highlighting delicate organic veins.',
    dimensions: '20" × 30" (50 × 76 cm)',
    medium: 'Silver gelatin fine-art photographic print',
    year: 2023,
    likes: 680,
    listingType: 'both',
    isSample: true,
    createdAt: Date.now() - 86400000 * 18
  },
  {
    id: 'art-dune-horizon',
    title: 'Dune Horizon',
    creator: INITIAL_CREATORS.david,
    creatorId: INITIAL_CREATORS.david.id,
    price: 3200,
    category: 'Painting',
    showcaseCategory: 'Painting',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=85',
    description: 'A sprawling, minimalist desert landscape painting composed of flat, muted color blocks in sand, terracotta, and soft sky blue evoking tranquil southwest vistas.',
    dimensions: '48" × 72" (122 × 183 cm)',
    medium: 'Acrylic and mineral ground on raw raw canvas',
    year: 2024,
    likes: 2150,
    listingType: 'both',
    featured: true,
    isSample: true,
    createdAt: Date.now() - 86400000 * 21
  },
  {
    id: 'art-monolith-study',
    title: 'Monolith in Solitude',
    creator: INITIAL_CREATORS.marcus_thorne,
    creatorId: INITIAL_CREATORS.marcus_thorne.id,
    price: 680,
    category: 'Sketch',
    showcaseCategory: 'Abstract',
    image: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85',
    description: 'Quick architectural gesture sketch examining vertical monolithic stone geometry in natural landscapes.',
    dimensions: '16" × 20" (40 × 50 cm)',
    medium: 'Carbon ink and graphite wash on Japanese washi paper',
    year: 2024,
    likes: 410,
    listingType: 'sell',
    isSample: true,
    createdAt: Date.now() - 86400000 * 25
  }
];

export const DEMO_USER: UserProfile = {
  uid: 'user_alex_mercer',
  name: 'Alex Mercer',
  username: 'alex_creates',
  email: 'alex.mercer@artworks.yo',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Contemporary collector & digital painter based in New York. Passionate about brutalism, minimalism, and textured mixed media.',
  role: 'seller', // Can sell art and buy art
  followersCount: 1200,
  followingCount: 840,
  isGuest: false,
  isAdmin: false,
  location: 'New York, USA',
  website: 'alexmercer.studio'
};

export const ADMIN_USER: UserProfile = {
  uid: 'admin_ronit_jain',
  name: 'Ronit Jain',
  username: 'ronitjain',
  email: 'ronitjain8080@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  bio: 'Platform Administrator & Art Curator on artWorks.yo',
  role: 'admin',
  followersCount: 9500,
  followingCount: 150,
  isGuest: false,
  isAdmin: true,
  location: 'Platform Admin HQ',
  website: 'artworks.yo/admin'
};

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  ADMIN_USER,
  DEMO_USER,
  {
    uid: 'user_sophia_reed',
    name: 'Sophia Reed',
    username: 'sophia_collector',
    email: 'sophia.reed@artworks.yo',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    bio: 'Contemporary art buyer & minimalist interior enthusiast.',
    role: 'buyer',
    followersCount: 240,
    followingCount: 520,
    isGuest: false,
    isAdmin: false,
    location: 'London, UK'
  },
  {
    uid: 'user_lucas_v',
    name: 'Lucas Vance',
    username: 'lucas_art',
    email: 'lucas.vance@artworks.yo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Sculptor & digital artist selling fine art editions.',
    role: 'seller',
    followersCount: 1420,
    followingCount: 310,
    isGuest: false,
    isAdmin: false,
    location: 'Berlin, Germany'
  }
];


export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-elena',
    participantId: 'creator_elena',
    participantName: 'Elena Rostova',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    participantRole: 'Artist',
    participantOnline: true,
    lastMessage: 'The framing on the new geometric series looks fantastic! I just shipped the certificate.',
    lastTimestamp: '10:42 AM',
    unread: true,
    artworkContext: {
      id: 'art-geometric-echoes',
      title: 'Geometric Echoes IV',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
      price: 450
    },
    messages: [
      {
        id: 'msg-1',
        senderId: 'user_alex_mercer',
        senderName: 'Alex Mercer',
        text: 'Hi Elena, I was admiring your Geometric Echoes IV piece in the showcase. Is the custom aluminum floating frame included with this archival edition?',
        timestamp: '10:15 AM',
        isSender: true,
        artworkAttachment: {
          id: 'art-geometric-echoes',
          title: 'Geometric Echoes IV',
          image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
          price: 450,
          creatorName: 'Elena Rostova'
        }
      },
      {
        id: 'msg-2',
        senderId: 'creator_elena',
        senderName: 'Elena Rostova',
        text: 'Hello Alex! Yes, each piece is delivered museum-ready with our custom matte black aluminum shadowbox frame and anti-reflective UV70 glass.',
        timestamp: '10:30 AM',
        isSender: false
      },
      {
        id: 'msg-3',
        senderId: 'creator_elena',
        senderName: 'Elena Rostova',
        text: 'The framing on the new geometric series looks fantastic! I just shipped the certificate.',
        timestamp: '10:42 AM',
        isSender: false
      }
    ]
  },
  {
    id: 'conv-julian',
    participantId: 'curator_julian',
    participantName: 'Julian Vance, Curator',
    participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    participantRole: 'Curator',
    participantOnline: true,
    lastMessage: 'We need to discuss the spacing for the upcoming autumn exhibition.',
    lastTimestamp: 'Yesterday',
    unread: true,
    messages: [
      {
        id: 'msg-j1',
        senderId: 'curator_julian',
        senderName: 'Julian Vance, Curator',
        text: 'Good afternoon Alex. The curatorial committee selected your recent oil studies for the featured autumn salon.',
        timestamp: 'Yesterday 3:20 PM',
        isSender: false
      },
      {
        id: 'msg-j2',
        senderId: 'curator_julian',
        senderName: 'Julian Vance, Curator',
        text: 'We need to discuss the spacing for the upcoming autumn exhibition.',
        timestamp: 'Yesterday 3:22 PM',
        isSender: false
      }
    ]
  },
  {
    id: 'conv-studio',
    participantId: 'studio_ops',
    participantName: 'Studio Operations',
    participantAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    participantRole: 'Logistics',
    participantOnline: false,
    lastMessage: 'Shipping confirmation for the minimalist sculpture has been sent.',
    lastTimestamp: 'Mon',
    unread: false,
    messages: [
      {
        id: 'msg-s1',
        senderId: 'studio_ops',
        senderName: 'Studio Operations',
        text: 'Your order #ART-8942 has been packed in a climate-controlled reinforced wooden art crate.',
        timestamp: 'Mon 11:00 AM',
        isSender: false
      },
      {
        id: 'msg-s2',
        senderId: 'studio_ops',
        senderName: 'Studio Operations',
        text: 'Shipping confirmation for the minimalist sculpture has been sent.',
        timestamp: 'Mon 11:05 AM',
        isSender: false
      }
    ]
  },
  {
    id: 'conv-marcus',
    participantId: 'creator_marcus_thorne',
    participantName: 'Marcus Thorne',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    participantRole: 'Artist',
    participantOnline: false,
    lastMessage: 'Thank you for the feedback on the tonal values of Structure in Void...',
    lastTimestamp: 'Oct 12',
    unread: false,
    artworkContext: {
      id: 'art-structure-in-void',
      title: 'Structure in Void',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      price: 820
    },
    messages: [
      {
        id: 'msg-m1',
        senderId: 'user_alex_mercer',
        senderName: 'Alex Mercer',
        text: 'Marcus, the depth in Structure in Void is breathtaking. The cross-hatching gradient gives immense architectural scale.',
        timestamp: 'Oct 12 2:10 PM',
        isSender: true
      },
      {
        id: 'msg-m2',
        senderId: 'creator_marcus_thorne',
        senderName: 'Marcus Thorne',
        text: 'Thank you for the feedback on the tonal values of Structure in Void. Really appreciate your keen eye!',
        timestamp: 'Oct 12 2:45 PM',
        isSender: false
      }
    ]
  }
];
