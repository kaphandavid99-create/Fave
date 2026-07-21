'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface FlipGalleryCardProps {
  id: number | string;
  styleName: string;
  length: string;
  color: string;
  image: string;
  description: string;
  index?: number;
}

export default function FlipGalleryCard({
  id,
  styleName,
  length,
  color,
  image,
  description,
  index = 0
}: FlipGalleryCardProps) {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const liked = isInWishlist(id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, styleName, length, color, image, description });
    }
  };

  const fallbackSrc: string | null = null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="relative w-full h-[500px] cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side - Image */}
          <motion.div
            className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden border border-[#D4A574]/30"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative w-full h-full bg-gradient-to-br from-[#2d231e] to-[#1a1512]">
              {image ? (
                <img
                  src={image}
                  alt={styleName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.getAttribute('data-fallback-applied') === 'true') return;
                    target.setAttribute('data-fallback-applied', 'true');
                    // Remove broken image rather than showing repeated placeholders
                    target.removeAttribute('src');
                  }}
                />
              ) : null}

              {/* Overlay gradient and content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

              {/* Style Name on Front */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center px-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="text-[#D4A574]" size={20} />
                    <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#E8D4B8]">
                      STYLE
                    </p>
                    <Sparkles className="text-[#D4A574]" size={20} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#D4A574] drop-shadow-lg">
                    {styleName}
                  </h3>
                </div>
              </div>

              {/* Heart Like Button */}
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 bg-[#D4A574]/90 backdrop-blur-md rounded-full p-3 shadow-lg z-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: liked ? 1 : 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Heart
                    size={20}
                    className={liked ? "text-[#1a1512] fill-[#1a1512]" : "text-[#1a1512]/40"}
                  />
                </motion.div>
              </motion.button>

              {/* Flip Indicator */}
              <div className="absolute top-4 left-4 bg-[#D4A574]/90 backdrop-blur-md rounded-full p-2 shadow-lg">
                <motion.div
                  animate={{ rotateZ: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg
                    className="w-5 h-5 text-[#1a1512]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Back Side - Details */}
          <motion.div
            className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden border border-[#D4A574]/30 bg-gradient-to-br from-[#D4A574] to-[#C49A6C]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a1512]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#2d231e]/10 rounded-full blur-3xl"></div>

            <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-8">
              {/* Top Section */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#1a1512] mb-2">
                    DETAILS
                  </p>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1512] mb-2">
                    {styleName}
                  </h3>
                </div>

                {/* Description */}
                <div className="bg-[#1a1512]/10 backdrop-blur-sm rounded-xl p-4 border border-[#1a1512]/20">
                  <p className="text-sm md:text-base text-[#1a1512]/90 leading-relaxed line-clamp-3">
                    {description || 'A beautiful and timeless protective style crafted with precision and care.'}
                  </p>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#1a1512]/10 backdrop-blur-sm rounded-lg p-3 border border-[#1a1512]/20 hover:bg-[#1a1512]/20 transition-all cursor-default"
                  >
                    <p className="text-xs text-[#2d231e] font-semibold mb-1">LENGTH</p>
                    <p className="text-sm font-bold text-[#1a1512]">{length}</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#1a1512]/10 backdrop-blur-sm rounded-lg p-3 border border-[#1a1512]/20 hover:bg-[#1a1512]/20 transition-all cursor-default"
                  >
                    <p className="text-xs text-[#2d231e] font-semibold mb-1">COLOR</p>
                    <p className="text-sm font-bold text-[#1a1512]">{color}</p>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Section - CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(26, 21, 18, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  router.push(`/book?style=${encodeURIComponent(styleName)}&style_image=${encodeURIComponent(image)}`);
                }}
                className="w-full py-3 md:py-4 bg-gradient-to-r from-[#1a1512] via-[#2d231e] to-[#1a1512] text-[#D4A574] rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span>Book This Style</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
