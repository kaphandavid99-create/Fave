export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingTimeMinutes: number;
  imageUrl: string;
  content: Array<
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'quote'; text: string; cite?: string }
    | { type: 'ul'; items: string[] }
  >;
};

const posts: BlogPost[] = [
  {
    id: 'p1',
    slug: 'how-to-prepare-your-hair-for-braids',
    title: 'How to Prepare Your Hair for Braids (Without the Damage)',
    excerpt:
      'A damage-minimizing prep routine: cleanse, moisturize, detangle, and protect—so your braids look incredible longer.',
    category: 'Care & Preparation',
    date: '2024-03-18',
    readingTimeMinutes: 6,
    imageUrl: '/girl1.jpg',
    content: [
      {
        type: 'p',
        text: 'Preparation is where longevity begins. The goal is to start with clean, conditioned hair and a scalp that feels calm—not stressed.'
      },
      { type: 'h2', text: 'Step-by-step routine' },
      {
        type: 'ul',
        items: [
          'Clarify gently (no heavy stripping).',
          'Deep condition or use a moisturizing mask.',
          'Detangle thoroughly while hair is conditioned.',
          'Add a light leave-in and seal where needed.'
        ]
      },
      {
        type: 'quote',
        text: 'Your braids can be beautiful and gentle—when the prep is right.',
        cite: "Fave's Touch Studio"
      },
      {
        type: 'p',
        text: 'If you’re starting with dry ends, focus on hydration before styling. Healthy hair holds shape, reduces frizz, and keeps your scalp comfortable.'
      }
    ]
  },
  {
    id: 'p2',
    slug: 'braid-maintenance-what-to-do-weekly',
    title: 'Braids Maintenance: What to Do Weekly',
    excerpt:
      'Quick weekly habits that keep your parts neat, your scalp refreshed, and your braid tension balanced.',
    category: 'Maintenance',
    date: '2024-04-27',
    readingTimeMinutes: 5,
    imageUrl: '/girl2.jpg',
    content: [
      { type: 'p', text: 'Maintenance doesn’t have to be complicated. A few small steps each week can dramatically improve how long your braids look fresh.' },
      { type: 'h2', text: 'A simple weekly checklist' },
      {
        type: 'ul',
        items: [
          'Lightly moisturize your scalp and edges.',
          'Re-tighten loose sections only if needed (avoid over-tension).',
          'Use a soft brush or fingertips for gentle styling.',
          'Sleep with a satin bonnet or scarf.'
        ]
      },
      { type: 'p', text: 'Keep products lightweight to avoid buildup. When in doubt, start with hydration first, then seal lightly.' }
    ]
  },
  {
    id: 'p3',
    slug: 'choosing-the-right-braids-for-your-lifestyle',
    title: 'Choosing the Right Braids for Your Lifestyle',
    excerpt:
      'Protective style meets practicality—find the perfect braid type based on your routine, schedule, and hair goals.',
    category: 'Styles',
    date: '2024-05-14',
    readingTimeMinutes: 7,
    imageUrl: '/girl3.jpg',
    content: [
      { type: 'p', text: 'The best braid style is the one you’ll comfortably maintain. Consider your schedule, comfort level, and how often you want to refresh.' },
      { type: 'h2', text: 'Match style to routine' },
      {
        type: 'ul',
        items: [
          'Busy week? Choose a low-maintenance pattern.',
          'Want maximum volume? Pick styles with flexible parting.',
          'Sensitive scalp? Focus on gentle installation and hydration.'
        ]
      },
      {
        type: 'quote',
        text: 'Your lifestyle is part of the design—tell us what you need, and we’ll tailor the style.'
      },
      { type: 'p', text: 'Consultation matters. We’ll recommend the best option for your hair texture and desired longevity.' }
    ]
  }
];

export function getAllBlogPosts(): BlogPost[] {
  return posts.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getFeaturedBlogPosts(): BlogPost[] {
  // Keep deterministic: first 2 by date as featured.
  return getAllBlogPosts().slice(0, 2);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

