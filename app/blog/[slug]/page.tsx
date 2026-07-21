'use client';

import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles, Share2, Heart, Bookmark, ArrowRight } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import SiteShell from '../_components/SiteShell';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTimeMinutes: number;
  imageUrl: string;
  content: Array<
    | { type: 'p'; text: string }
    | { type: 'h2'; text: string }
    | { type: 'quote'; text: string; cite?: string }
    | { type: 'ul'; items: string[] }
  >;
};

function formatMetaDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogPostDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const post = useMemo(() => {
    if (!slug) return undefined;
    return getBlogPostBySlug(slug) as BlogPost | undefined;
  }, [slug]);

  if (!post) {
    notFound();
  }

  return (
    <SiteShell>
      <div className="min-h-screen bg-gradient-to-br from-[#F7F1EC] via-[#FFF5F2] to-[#F5E6D8] relative overflow-hidden">
        {/* Elegant decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C4705B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8A4A32]/5 rounded-full blur-3xl" />

        {/* Header */}
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1.0],
                scale: { type: "spring", stiffness: 200 }
              }}
            >
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <motion.div 
                      className="flex items-center gap-3 mb-6"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.6 }}
                        className="p-3 rounded-2xl bg-gradient-to-br from-[#C4705B] to-[#8A4A32] shadow-lg"
                      >
                        <Sparkles className="text-white" size={20} />
                      </motion.div>
                      <span className="text-lg font-semibold text-[#8A4A32]">{post.category}</span>
                    </motion.div>

                    <motion.h1 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#5A3A2C] leading-tight mb-6"
                    >
                      {post.title}
                    </motion.h1>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="flex flex-wrap items-center gap-6 text-[#8A4A32]/70 mb-8"
                    >
                      <motion.span 
                        className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-md"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Calendar size={16} />
                        {formatMetaDate(post.date)}
                      </motion.span>
                      <motion.span 
                        className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-md"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Clock size={16} />
                        {post.readingTimeMinutes} min read
                      </motion.span>
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="text-lg text-[#8A4A32]/80 leading-relaxed mb-8"
                    >
                      {post.excerpt}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex items-center gap-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white shadow-md hover:shadow-lg text-[#8A4A32] border border-[#C4705B]/20 transition-all"
                      >
                        <Heart size={18} />
                        <span className="text-sm font-medium">Like</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white shadow-md hover:shadow-lg text-[#8A4A32] border border-[#C4705B]/20 transition-all"
                      >
                        <Bookmark size={18} />
                        <span className="text-sm font-medium">Save</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white shadow-md hover:shadow-lg text-[#8A4A32] border border-[#C4705B]/20 transition-all"
                      >
                        <Share2 size={18} />
                        <span className="text-sm font-medium">Share</span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div 
                  className="w-full lg:w-[500px]"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C4705B]/10"
                  >
                    <div className="relative aspect-[16/10]">
                      <motion.img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-12">
              <motion.article 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#C4705B]/10"
              >
                <div className="space-y-8">
                  {post.content.map((block, idx) => {
                    if (block.type === 'p') {
                      return (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 + idx * 0.05 }}
                          className="text-[#5A3A2C]/90 leading-relaxed text-lg"
                        >
                          {block.text}
                        </motion.p>
                      );
                    }
                    if (block.type === 'h2') {
                      return (
                        <motion.h2
                          key={idx}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 + idx * 0.05 }}
                          className="text-3xl md:text-4xl font-serif font-bold text-[#5A3A2C] mt-12 mb-6"
                        >
                          {block.text}
                        </motion.h2>
                      );
                    }
                    if (block.type === 'quote') {
                      return (
                        <motion.figure
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.5 + idx * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-br from-[#C4705B]/10 to-[#8A4A32]/10 border-2 border-[#C4705B]/20 rounded-3xl p-8 md:p-10 my-8 shadow-lg"
                        >
                          <blockquote className="text-[#5A3A2C] text-xl md:text-2xl font-medium leading-relaxed font-serif">
                            "{block.text}"
                          </blockquote>
                          {block.cite && (
                            <motion.figcaption 
                              className="mt-4 text-[#8A4A32]/70 text-sm font-medium"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 + idx * 0.05 }}
                            >
                              — {block.cite}
                            </motion.figcaption>
                          )}
                        </motion.figure>
                      );
                    }
                    if (block.type === 'ul') {
                      return (
                        <motion.ul
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 + idx * 0.05 }}
                          className="space-y-4 text-[#5A3A2C]/90"
                        >
                          {block.items.map((it, j) => (
                            <motion.li 
                              key={j} 
                              className="flex gap-4 items-start"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + idx * 0.05 + j * 0.05 }}
                            >
                              <motion.span 
                                className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#C4705B] to-[#8A4A32] text-white font-bold text-sm shadow-md"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                ✓
                              </motion.span>
                              <span className="leading-relaxed text-lg">
                                {it}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      );
                    }
                    return null;
                  })}
                </div>
              </motion.article>

              {/* Sidebar */}
              <aside className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-[#C4705B]/10 sticky top-24"
                >
                  <motion.h3 
                    className="text-lg font-serif font-bold text-[#5A3A2C] mb-4"
                    whileHover={{ x: 5 }}
                  >
                    Table of Contents
                  </motion.h3>
                  <nav className="space-y-2">
                    {post.content
                      .filter((block) => block.type === 'h2')
                      .map((block, idx) => (
                        <motion.a
                          key={idx}
                          href={`#section-${idx}`}
                          className="block text-[#8A4A32]/70 hover:text-[#C4705B] text-sm transition-colors py-2 px-3 rounded-lg hover:bg-[#C4705B]/5"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {block.text}
                        </motion.a>
                      ))}
                  </nav>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-[#C4705B] to-[#8A4A32] rounded-2xl p-6 shadow-xl"
                >
                  <motion.h3 
                    className="text-lg font-serif font-bold text-white mb-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    Want a personalized recommendation?
                  </motion.h3>
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    Tell us your hair goals and your schedule—we'll help you choose the perfect protective style.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/book"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#C4705B] font-semibold hover:shadow-lg transition-all"
                    >
                      Book a session
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-10"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#8A4A32] to-[#7F1D1D] shadow-lg"
                >
                  <Sparkles className="text-white" size={24} />
                </motion.div>
                <span className="text-lg font-semibold text-[#8A4A32]">More to Explore</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5A3A2C]">
                Related Articles
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateY: 10 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.8 + i * 0.1,
                    type: "spring",
                    stiffness: 80
                  }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#C4705B]/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={post.imageUrl}
                      alt="Related post"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[#5A3A2C] text-lg font-serif font-semibold leading-tight mb-3">
                      Related Article Title {i}
                    </h3>
                    <p className="text-[#8A4A32]/70 text-sm leading-relaxed line-clamp-2 mb-4">
                      This is a sample excerpt for a related article that readers might be interested in.
                    </p>
                    <motion.div 
                      className="flex items-center gap-2 text-[#C4705B] text-sm font-semibold"
                      whileHover={{ x: 5 }}
                    >
                      Read More
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}