// Simple in-memory storage for fallback when database isn't set up
export const inMemoryStorage = {
  media: [] as any[],
  gallery: [] as any[],
  galleryNextId: 5
};

// Initialize with sample media data using actual images from public folder
inMemoryStorage.media = [
  {
    id: '1',
    url: '/first.jpeg',
    publicId: 'first.jpeg',
    name: 'first.jpeg',
    type: 'image',
    size: 61886,
    width: 800,
    height: 600,
    folder: 'gallery',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    url: '/second.jpeg',
    publicId: 'second.jpeg',
    name: 'second.jpeg',
    type: 'image',
    size: 66464,
    width: 800,
    height: 600,
    folder: 'gallery',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    url: '/third.jpeg',
    publicId: 'third.jpeg',
    name: 'third.jpeg',
    type: 'image',
    size: 110875,
    width: 800,
    height: 600,
    folder: 'gallery',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    url: '/fourth.jpeg',
    publicId: 'fourth.jpeg',
    name: 'fourth.jpeg',
    type: 'image',
    size: 88713,
    width: 800,
    height: 600,
    folder: 'gallery',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    url: '/girl1.jpg',
    publicId: 'girl1.jpg',
    name: 'girl1.jpg',
    type: 'image',
    size: 100646,
    width: 800,
    height: 600,
    folder: 'gallery',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    url: '/girl2.jpg',
    publicId: 'girl2.jpg',
    name: 'girl2.jpg',
    type: 'image',
    size: 75108,
    width: 800,
    height: 600,
    folder: 'gallery',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    url: '/girl3.jpg',
    publicId: 'girl3.jpg',
    name: 'girl3.jpg',
    type: 'image',
    size: 97402,
    width: 800,
    height: 600,
    folder: 'gallery',
    createdAt: new Date().toISOString()
  }
];

// Initialize with sample data using actual images from public folder
inMemoryStorage.gallery = [
  {
    id: 1,
    style_name: 'Knotless Cornrows',
    length: 'Medium',
    color: 'Black',
    image: '/first.jpeg',
    description: 'Classic knotless cornrows with intricate pattern'
  },
  {
    id: 2,
    style_name: 'Boho',
    length: 'Long',
    color: 'Brown',
    image: '/second.jpeg',
    description: 'Bohemian style with loose curls and tribal beads'
  },
  {
    id: 3,
    style_name: 'Fulani',
    length: 'Medium',
    color: 'Ombre',
    image: '/third.jpeg',
    description: 'Fulani braids with traditional cowrie shell accessories'
  },
  {
    id: 4,
    style_name: 'Knotless Braids',
    length: 'Long',
    color: 'Black',
    image: '/fourth.jpeg',
    description: 'Elegant knotless braids with clean parts'
  }
];
