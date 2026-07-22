'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Heart,
  Sparkles,
  Scissors,
  ChevronRight,
  Star,
  X,
  Calendar,
  User
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  image_url: string | null;
  cloudinary_public_id: string | null;
  video_url: string | null;
  video_public_id: string | null;
  gallery: string[];
  gallery_public_ids: string[];
  is_featured: boolean;
}

function formatMoneyXaf(value: number) {
  return `${value.toLocaleString()} XAF`;
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  
  const id = params.id as string;

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch service');
        }

        setService(result.data);
      } catch (err) {
        console.error('Error fetching service:', err);
        router.push('/services/services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, router]);

  const handleBook = () => {
    router.push(`/book?service_id=${id}`);
  };

  const handleGalleryImage = (index: number) => {
    if (!service) return;

    setSelectedImageIndex(index + (service.video_url ? 1 : 0));
    setShowGallery(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF8F3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B3A3A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8B3A3A] font-serif text-lg">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF8F3]">
        <div className="text-center">
          <p className="text-[#8B3A3A] font-serif text-lg mb-4">Service not found</p>
          <button
            onClick={() => router.push('/services/services')}
            className="text-[#C4705B] hover:text-[#8B3A3A] transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const allImages = service.video_url 
    ? [service.video_url, ...service.gallery] 
    : service.image_url 
      ? [service.image_url, ...service.gallery] 
      : service.gallery;

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && allImages.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowGallery(false)}
                className="absolute -top-12 right-0 text-white hover:text-[#C4705B] transition-colors"
              >
                <X size={32} />
              </button>

              {/* Main Image */}
              <div className="relative flex-1 bg-black rounded-2xl overflow-hidden">
                {allImages[selectedImageIndex] && (
                  selectedImageIndex === 0 && service.video_url ? (
                    <video
                      src={allImages[selectedImageIndex]}
                      className="w-full h-full object-contain"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={allImages[selectedImageIndex]}
                      alt={`${service.name} - Image ${selectedImageIndex + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  )
                )}
              </div>

              {/* Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transition-all"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transition-all"
                  >
                    <ArrowRight size={24} />
                  </button>
                </>
              )}

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        selectedImageIndex === index ? 'ring-2 ring-[#C4705B] ring-offset-2' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {index === 0 && service.video_url ? (
                        <video
                          src={img}
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                        />
                      ) : (
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/services/services')}
            aria-label="Back to services"
            className="flex items-center justify-center rounded-full border border-[#8B3A3A]/20 bg-white/80 p-2 text-[#8B3A3A] shadow-sm transition-all hover:text-[#C4705B] hover:shadow-md md:hidden"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={() => router.push('/services/services')}
            className="hidden items-center gap-2 text-[#8B3A3A] transition-colors group md:flex"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Services</span>
          </button>
          
          <div className="flex items-center gap-3">
            {service.is_featured && (
              <div className="flex items-center gap-1.5 bg-[#8B3A3A]/10 px-3 py-1.5 rounded-full">
                <Star size={16} className="text-[#8B3A3A] fill-[#8B3A3A]" />
                <span className="text-xs font-medium text-[#8B3A3A]">Featured</span>
              </div>
            )}
            {service.category && (
              <div className="bg-[#C4705B]/10 px-3 py-1.5 rounded-full">
                <span className="text-xs font-medium text-[#C4705B]">{service.category}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-[#EBE5DE] rounded-3xl overflow-hidden shadow-2xl">
              {service.video_url ? (
                <video
                  src={service.video_url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  preload="metadata"
                  muted
                />
              ) : service.image_url ? (
                <Image
                  src={service.image_url}
                  alt={service.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#C4705B]/20 via-[#D4A574]/10 to-[#EBE5DE] flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-[#C4705B]/20">
                    <span className="text-4xl font-serif text-[#4A2C2A]">
                      {service.name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Video Overlay */}
              {service.video_url && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-[#3A241C]">Video Available</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {service.gallery && service.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {service.gallery.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleGalleryImage(index + (service.video_url || service.image_url ? 1 : 0))}
                    className="relative aspect-square bg-[#EBE5DE] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#C4705B] transition-all group"
                  >
                    <Image
                      src={img}
                      alt={`${service.name} gallery ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    {index === 3 && service.gallery.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium">+{service.gallery.length - 4}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Title */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="w-12 h-[1px] bg-[#C4705B]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#C4705B] font-medium">Premium Service</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-serif text-[#4A2C2A] leading-tight mb-4">
                {service.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-[#C4705B] fill-[#C4705B]"
                    />
                  ))}
                </div>
                <span className="text-[#8B7355] text-sm">5.0 (124 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DFD3]">
              <h3 className="text-lg font-serif text-[#4A2C2A] mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-[#C4705B]" />
                About This Service
              </h3>
              <p className="text-[#8B7355] leading-relaxed">
                {service.description || 'Experience our premium braiding service, crafted with precision and care. Our expert stylists use traditional techniques combined with modern methods to create stunning, long-lasting styles.'}
              </p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#FDF8F3] to-[#EBE5DE] rounded-2xl p-6 border border-[#E8DFD3]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#C4705B]/10 rounded-xl flex items-center justify-center">
                    <DollarSign size={24} className="text-[#C4705B]" />
                  </div>
                  <span className="text-sm text-[#8A4A32] font-medium">Price</span>
                </div>
                <p className="text-3xl font-serif text-[#4A2C2A] font-bold">
                  {formatMoneyXaf(service.price)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#FDF8F3] to-[#EBE5DE] rounded-2xl p-6 border border-[#E8DFD3]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#C4705B]/10 rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-[#C4705B]" />
                  </div>
                  <span className="text-sm text-[#8A4A32] font-medium">Duration</span>
                </div>
                <p className="text-3xl font-serif text-[#4A2C2A] font-bold">
                  {service.duration} <span className="text-lg font-normal">min</span>
                </p>
              </motion.div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-[#4A2C2A] mb-4">What's Included</h3>
              {[
                'Professional consultation',
                'Premium hair products',
                'Expert styling',
                'Aftercare advice',
                'Complimentary refreshments'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 text-[#8B7355]"
                >
                  <div className="w-6 h-6 bg-[#C4705B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#C4705B] rounded-full" />
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <button
                onClick={handleBook}
                className="w-full py-5 bg-gradient-to-r from-[#8A4A32] to-[#C4705B] text-white rounded-2xl hover:from-[#C4705B] hover:to-[#B86050] transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-lg font-semibold group"
              >
                Book This Service
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[#8B7355] text-sm mt-3">
                Free cancellation up to 24 hours before appointment
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Video Section */}
      {service.video_url && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 py-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-[#4A2C2A] mb-4">See It In Action</h2>
            <p className="text-[#8B7355]">Watch our expert stylists create this beautiful style</p>
          </div>
          <div className="relative max-w-4xl mx-auto aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
            <video
              src={service.video_url}
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </motion.section>
      )}

      {/* Related Services CTA */}
      <section className="bg-gradient-to-r from-[#8A4A32] to-[#C4705B] py-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Explore More Styles
          </h2>
          <p className="text-[#D4C4B5] mb-8 text-lg">
            Discover our complete collection of premium braiding services
          </p>
          <button
            onClick={() => router.push('/services/services')}
            className="inline-flex items-center gap-3 bg-white text-[#8A4A32] px-8 py-4 rounded-full font-semibold hover:bg-[#FDF8F3] transition-colors shadow-xl"
          >
            View All Services
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
