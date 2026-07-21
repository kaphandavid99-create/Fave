'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowRight, Trash2, Sparkles, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import Link from 'next/link';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const handleBook = (item: any) => {
    router.push(`/book?style=${encodeURIComponent(item.styleName)}&style_image=${encodeURIComponent(item.image)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F1EC] via-[#FFF5F2] to-[#F5E6D8] relative overflow-hidden">
      {/* Elegant decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C4705B]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8A4A32]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1.0],
            scale: { type: "spring", stiffness: 200 }
          }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-[#C4705B]/20 shadow-lg mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-[#C4705B]" size={18} />
            </motion.div>
            <span className="text-sm font-semibold text-[#5A3A2C] tracking-wider uppercase">
              Your Favorites
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-serif font-bold text-[#5A3A2C] mb-6 leading-tight"
          >
            Wishlist
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-[#8A4A32]/80 max-w-2xl mx-auto leading-relaxed"
          >
            Your curated collection of favorite braiding styles, saved for your next appointment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center gap-2 text-[#8A4A32] bg-white/60 px-4 py-2 rounded-full shadow-md"
            >
              <Heart size={18} className="text-[#C4705B]" />
              <span className="text-sm font-medium">{wishlist.length} Items</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/80 mb-8 shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Heart className="text-[#8A4A32]/50" size={64} />
            </motion.div>
            <h3 className="text-3xl font-serif font-bold text-[#5A3A2C] mb-4">Your wishlist is empty</h3>
            <p className="text-[#8A4A32]/70 text-lg mb-8 max-w-md mx-auto">
              Start exploring our gallery and save your favorite styles to build your perfect collection.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C4705B] to-[#8A4A32] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingBag size={20} />
                Explore Gallery
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {wishlist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50, rotateY: 10 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.7 + index * 0.1,
                    type: "spring",
                    stiffness: 80
                  }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#C4705B]/10 group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.styleName}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Heart Badge */}
                    <motion.div 
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Heart 
                        size={20} 
                        className="text-red-500 fill-red-500" 
                      />
                    </motion.div>

                    {/* Style Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-2xl font-serif font-bold leading-tight mb-2">
                        {item.styleName}
                      </h3>
                      <div className="flex items-center gap-4 text-white/90 text-sm">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                          {item.length}
                        </span>
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                          {item.color}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[#8A4A32]/70 text-sm leading-relaxed line-clamp-2 mb-4">
                      {item.description || 'A beautiful and timeless protective style crafted with precision and care.'}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBook(item)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#C4705B] to-[#8A4A32] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        Book Now
                        <ArrowRight size={16} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Clear All Button */}
            {wishlist.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearWishlist}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 text-[#8A4A32] font-semibold rounded-full shadow-md hover:bg-white hover:text-red-500 transition-all border border-[#C4705B]/20"
                >
                  <Trash2 size={18} />
                  Clear All
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}