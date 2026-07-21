'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  TrendingUp,
  Heart,
  Bookmark,
  Filter,
  X,
} from 'lucide-react';
import {
  getAllBlogPosts,
  getFeaturedBlogPosts,
} from '@/lib/blog-posts';
import SiteShell from './_components/SiteShell';
import StayInLoopThreeAnimation from '@/components/StayInLoopThreeAnimation';


const categoryAll = 'All categories';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTimeMinutes: number;
  imageUrl: string;
};

export default function BlogLandingPage() {
  const allPosts = useMemo(() => getAllBlogPosts() as BlogPost[], []);
  const featured = useMemo(() => getFeaturedBlogPosts() as BlogPost[], []);

  const categories = useMemo(() => {
    const set = new Set(allPosts.map((p) => p.category));
    return [categoryAll, ...Array.from(set)];
  }, [allPosts]);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryAll);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPosts.filter((p) => {
      const categoryOk =
        activeCategory === categoryAll ? true : p.category === activeCategory;
      const text = `${p.title} ${p.excerpt} ${p.category}`.toLowerCase();
      const queryOk = q.length === 0 ? true : text.includes(q);
      return categoryOk && queryOk;
    });
  }, [allPosts, query, activeCategory]);

  const remaining = useMemo(() => {
    const featuredIds = new Set(featured.map((p) => p.id));
    return filtered.filter((p) => !featuredIds.has(p.id));
  }, [filtered, featured]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SiteShell>
      <div className="min-h-screen bg-gradient-to-br from-[#F7F1EC] via-[#FFF5F2] to-[#F5E6D8] relative overflow-hidden">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C4705B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8A4A32]/5 rounded-full blur-3xl" />

        {/* Hero Section */}
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-8 md:pt-24 md:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1.0],
                scale: { type: 'spring', stiffness: 200 },
              }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-[#C4705B]/20 shadow-lg mb-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="text-[#C4705B]" size={18} />
                </motion.div>
                <span className="text-sm font-semibold text-[#5A3A2C] tracking-wider uppercase">
                  Hair Stories & Studio Tips
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-[#5A3A2C] mb-6 leading-tight"
              >
                The Blog
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-[#8A4A32]/80 max-w-2xl mx-auto leading-relaxed mb-10"
              >
                Care routines, style guidance, and practical tips to keep your braids
                looking flawless—from installation day to wash week.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center gap-2 text-[#8A4A32] bg-white/60 px-4 py-2 rounded-full shadow-md"
                >
                  <BookOpen size={18} />
                  <span className="text-sm font-medium">{allPosts.length} Articles</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="flex items-center gap-2 text-[#8A4A32] bg-white/60 px-4 py-2 rounded-full shadow-md"
                >
                  <TrendingUp size={18} />
                  <span className="text-sm font-medium">Trending Topics</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center gap-2 text-[#8A4A32] bg-white/60 px-4 py-2 rounded-full shadow-md"
                >
                  <Heart size={18} />
                  <span className="text-sm font-medium">Expert Tips</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-xl border border-[#C4705B]/20 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Search Input */}
                  <div className="flex-1">
                    <div className="relative">
                      <motion.div
                        animate={{ x: query ? [0, -5, 5, -5, 0] : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A4A32]/50" size={20} />
                      </motion.div>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search articles, tips, styles..."
                        className="w-full bg-white/50 border-2 border-[#C4705B]/20 rounded-2xl pl-12 pr-12 py-4 text-[#5A3A2C] placeholder-[#8A4A32]/40 outline-none focus:ring-2 focus:ring-[#C4705B]/50 focus:border-[#C4705B] transition-all font-medium"
                      />
                      {query.trim().length > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A4A32]/50 hover:text-[#C4705B] transition"
                          aria-label="Clear search"
                        >
                          <X size={18} />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter Button */}
                  <div className="flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-[#C4705B] to-[#8A4A32] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Filter size={18} />
                      <span>{activeCategory === categoryAll ? 'All Categories' : activeCategory}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Expandable Category Pills */}
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-[#C4705B]/20"
                    >
                      <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => {
                          const active = activeCategory === cat;
                          return (
                            <motion.button
                              key={cat}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setActiveCategory(cat);
                                setIsFilterOpen(false);
                              }}
                              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                                active
                                  ? 'bg-gradient-to-r from-[#C4705B] to-[#8A4A32] text-white shadow-lg shadow-[#C4705B]/30'
                                  : 'bg-white/60 text-[#5A3A2C] hover:bg-white/80 border border-[#C4705B]/20'
                              }`}
                            >
                              {cat}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#C4705B] to-[#8A4A32] shadow-lg"
                >
                  <Sparkles className="text-white" size={24} />
                </motion.div>
                <span className="text-lg font-semibold text-[#8A4A32]">Featured Reads</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5A3A2C]">
                Studio Favorites
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featured.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + idx * 0.15,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#C4705B]/10">
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F1EC]">
                        <motion.img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        <motion.div
                          className="absolute top-6 left-6"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-md text-[#C4705B] shadow-lg">
                            <Sparkles size={14} />
                            {post.category}
                          </span>
                        </motion.div>

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <motion.h3
                            className="text-white text-2xl md:text-3xl font-serif font-bold leading-tight mb-4 group-hover:text-[#C4705B] transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            {post.title}
                          </motion.h3>
                          <div className="flex items-center gap-6 text-white/90 text-sm">
                            <span className="flex items-center gap-2">
                              <Calendar size={16} />
                              {formatDate(post.date)}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock size={16} />
                              {post.readingTimeMinutes} min read
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-8">
                        <p className="text-[#8A4A32]/80 text-base leading-relaxed line-clamp-2 mb-6">
                          {post.excerpt}
                        </p>
                        <motion.div
                          className="flex items-center gap-3 text-[#C4705B] font-semibold text-base group-hover:gap-5 transition-all"
                          whileHover={{ x: 10 }}
                        >
                          Read More
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight size={20} />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* All Posts Section - Masonry Layout */}
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#8A4A32] to-[#7F1D1D] shadow-lg"
                >
                  <BookOpen className="text-white" size={24} />
                </motion.div>
                <span className="text-lg font-semibold text-[#8A4A32]">All Articles</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5A3A2C]">
                Latest Posts
              </h2>
              <p className="text-[#8A4A32]/70 mt-2 text-lg">
                {filtered.length} {filtered.length === 1 ? 'article' : 'articles'} found
              </p>
            </motion.div>

            {remaining.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {remaining.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 50, rotateY: 10 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4 + idx * 0.08,
                      type: 'spring',
                      stiffness: 80,
                    }}
                    whileHover={{ y: -8, scale: 1.03, rotateY: 2 }}
                    className="break-inside-avoid group"
                  >

                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#C4705B]/10 mb-6">
                        <div className="relative overflow-hidden">
                          <div className="relative w-full aspect-[4/3] overflow-hidden">
                            <motion.img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.15 }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          <motion.div
                            className="absolute top-4 left-4"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#C4705B] shadow-md">
                              {post.category}
                            </span>
                          </motion.div>

                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-4 text-white/90 text-xs">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(post.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {post.readingTimeMinutes}m
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <motion.h3
                            className="text-[#5A3A2C] text-base font-serif font-semibold leading-tight mb-2 group-hover:text-[#C4705B] transition-colors"
                            whileHover={{ x: 2 }}
                          >
                            {post.title}
                          </motion.h3>
                          <p className="text-[#8A4A32]/70 text-sm leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                          <motion.div
                            className="flex items-center gap-2 text-[#C4705B] text-sm font-semibold group-hover:gap-4 transition-all"
                            whileHover={{ x: 5 }}
                          >
                            <ArrowRight size={16} />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/80 mb-8 shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Search className="text-[#8A4A32]/50" size={40} />
                </motion.div>
                <h3 className="text-2xl font-semibold text-[#5A3A2C] mb-3">
                  No articles found
                </h3>
                <p className="text-[#8A4A32]/70">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative bg-gradient-to-br from-[#C4705B] to-[#8A4A32] rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl"
            >
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Exceptional three.js animation */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  {/* (3D) */}
                  <StayInLoopThreeAnimation />
                </div>


                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                  Stay in the Loop
                </h2>

                <p className="text-white/90 text-base mb-6 leading-relaxed">
                  Get the latest hair care tips, style inspiration, and exclusive offers delivered straight to your inbox.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-[#C4705B] font-bold rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
                >
                  Subscribe Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

