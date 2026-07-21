'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Filter,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import FlipGalleryCard from '@/components/FlipGalleryCard';
import { formatVideoUrl } from '@/lib/video-utils';

export default function GalleryPage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState('All styles');
  const [selectedLength, setSelectedLength] = useState('All lengths');
  const [selectedColor, setSelectedColor] = useState('All colors'); 

  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const [videos, setVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  const styles = [
    'All styles',
    'Knotless Cornrows',
    'Puzzles',
    'Knotless Braids',
    'Key Braids',
    'Fulani Braids',
  ];
  const lengths = ['All lengths', 'Short', 'Medium', 'Long'];
  const colors = ['All colors', 'Black', 'Brown', 'Blonde', 'Red', 'Ombre'];

  const fetchGalleryItems = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();

      if (data.success) {
        setGalleryItems(data.data || []);
        setTotalItems(data.data?.length || 0);
      } else {
        console.error('Failed to fetch gallery items:', data);
        setGalleryItems([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setGalleryItems([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedVideos = async () => {
    setVideosLoading(true);
    try {
      // Keep this consistent with how Services page checks video table availability.
      const response = await fetch('/api/simple-test');
      const result = await response.json();

      if (result.status === 'success') {
        const videoResponse = await fetch('/api/videos?featured=true');
        const videoResult = await videoResponse.json();

        if (!videoResponse.ok) {
          console.error('Featured videos fetch failed:', videoResult);
          setVideos([]);
          return;
        }

        // /api/videos returns { data: Video[] }
        setVideos(videoResult.data || []);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Error fetching featured videos:', err);
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
    fetchFeaturedVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = galleryItems.filter((item) => {
    if (selectedStyle !== 'All styles' && item.styleName !== selectedStyle) return false;
    if (selectedLength !== 'All lengths' && item.length !== selectedLength) return false;
    if (selectedColor !== 'All colors' && item.color !== selectedColor) return false;
    return true;
  });

  const visibleItems = filteredItems.slice(0, visibleCount);
  const remainingItems = filteredItems.length - visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredItems.length));
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-sm md:text-base font-semibold tracking-[0.4em] text-[#D4A574] mb-4 uppercase">Exquisite Collection</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] via-[#F5DEB3] to-[#D4A574] mb-6 drop-shadow-lg">
            Timeless Elegance
          </h1>
          <p className="text-[#E8D4B8] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Discover our curated gallery of sophisticated braiding artistry, where tradition meets contemporary luxury
          </p>
        </motion.div>

        {/* Featured Video Gallery Section */}
        <section className="py-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] via-[#F5DEB3] to-[#D4A574] mb-4">Video Gallery</h2>
              <p className="text-[#E8D4B8] text-lg">Watch our artistry come to life</p>
            </motion.div>

            {videosLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="text-[#D4A574] animate-spin size-12" />
              </div>
            ) : videos.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-[280px] snap-start"
                  >
                    <div className="relative w-full h-[400px] bg-black rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group">
                      <div className="relative w-full h-full">
                        <video
                          src={formatVideoUrl(video.video_url)}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#E8D4B8] text-lg">No videos available right now.</p>
              </div>
            )}
          </div>
        </section>

        {/* Filter Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <div className="bg-gradient-to-br from-[#2d231e]/80 to-[#1a1512]/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-[#D4A574]/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex flex-wrap gap-3">
                <p className="text-sm font-semibold text-[#D4A574] w-full md:w-auto mb-2 md:mb-0 md:mr-2">
                  <Filter size={16} className="inline mr-1" />
                  Filter by Style:
                </p>
                {styles.map((style) => (
                  <motion.button
                    key={style}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStyle === style
                        ? 'bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-[#1a1512] shadow-lg'
                        : 'bg-[#1a1512]/50 text-[#E8D4B8] hover:bg-[#D4A574]/20 border border-[#D4A574]/30'
                    }`}
                  >
                    {style}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <select
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
                    className="appearance-none bg-[#1a1512]/50 border border-[#D4A574]/30 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-[#E8D4B8] focus:outline-none focus:ring-2 focus:ring-[#D4A574] cursor-pointer"
                  >
                    {lengths.map((length) => (
                      <option key={length} value={length}>
                        {length}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A574] pointer-events-none" size={16} />
                </div>

                <div className="relative">
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="appearance-none bg-[#1a1512]/50 border border-[#D4A574]/30 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-[#E8D4B8] focus:outline-none focus:ring-2 focus:ring-[#D4A574] cursor-pointer"
                  >
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A574] pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-[#D4A574] animate-spin size-12" />
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
            >
              {visibleItems.length > 0 ? (
                visibleItems.map((item, index) => (
                  <FlipGalleryCard
                    key={item.id || index}
                    id={item.id}
                    styleName={item.styleName}
                    length={item.length}
                    color={item.color}
                    image={item.image}
                    description={item.description}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-[#E8D4B8] text-lg">No styles found matching your filters.</p>
                </div>
              )}
            </motion.div>

            {remainingItems > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#D4A574] to-[#C49A6C] text-[#1a1512] rounded-xl font-semibold hover:from-[#C49A6C] hover:to-[#B88A5C] transition-all shadow-lg shadow-[#D4A574]/30"
                >
                  Load More Styles
                  <ArrowRight size={20} />
                </motion.button>
                <p className="text-sm text-[#E8D4B8] mt-3">{remainingItems} more styles remaining</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

