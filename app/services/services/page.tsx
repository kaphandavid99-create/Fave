'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Clock,
  DollarSign,
  ArrowRight,
  Sparkles,
  Droplets,
  Wind,
  Leaf,
  ChevronRight,
  Star,
  Scissors,
  Heart,
  Info,
  X
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

interface AddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
  icon: string;
}

type ServiceCardVariant = 'classic' | 'elevated' | 'glass' | 'showcase';

function formatMoneyXaf(value: number) {
  return `${value.toLocaleString()} XAF`;
}

function getVariant(index: number): ServiceCardVariant {
  const mod = index % 4;
  return mod === 0 ? 'classic' : mod === 1 ? 'elevated' : mod === 2 ? 'glass' : 'showcase';
}

function VideoGallery({ onBook }: { onBook: (serviceId: string) => void }) {
  const [videos, setVideos] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/services');
        const result = await response.json();
        
        if (response.ok) {
          // Filter services that have videos
          const servicesWithVideos = (result.data || []).filter((service: Service) => service.video_url);
          setVideos(servicesWithVideos);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleViewDetails = (video: Service) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const handleBook = () => {
    if (selectedVideo) {
      onBook(selectedVideo.id);
      handleCloseModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#8B3A3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (videos.length === 0) {
    return null; // Don't show section if no videos
  }

  return (
    <>
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
                  src={video.video_url || ''}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              
              {/* Details Button */}
              <button
                onClick={() => handleViewDetails(video)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                title="View Details"
              >
                <Info size={18} className="text-[#8B3A3A]" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      {showModal && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#E8DFD3] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#3A241C]">{selectedVideo.name}</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-[#FDF8F3] rounded-full transition-colors"
              >
                <X size={20} className="text-[#454545]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Video Preview */}
              <div className="relative w-full h-[200px] bg-black rounded-xl overflow-hidden">
                <video
                  src={selectedVideo.video_url || ''}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>

              {/* Description */}
              {selectedVideo.description && (
                <div>
                  <h4 className="text-sm font-medium text-[#8A4A32] mb-2">Description</h4>
                  <p className="text-[#454545] leading-relaxed">{selectedVideo.description}</p>
                </div>
              )}

              {/* Price and Duration */}
              <div className="flex gap-4">
                <div className="flex-1 bg-[#FDF8F3] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={16} className="text-[#C4705B]" />
                    <span className="text-sm text-[#8A4A32]">Price</span>
                  </div>
                  <p className="text-lg font-semibold text-[#3A241C]">{formatMoneyXaf(selectedVideo.price)}</p>
                </div>
                <div className="flex-1 bg-[#FDF8F3] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={16} className="text-[#C4705B]" />
                    <span className="text-sm text-[#8A4A32]">Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-[#3A241C]">{selectedVideo.duration} min</p>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                className="w-full py-3 bg-[#8A4A32] text-white rounded-xl hover:bg-[#6A3A22] transition font-medium flex items-center justify-center gap-2"
              >
                Book Now
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function ServiceClassicCard({
  service,
  index,
  onBook,
}: {
  service: Service;
  index: number;
  onBook: () => void;
}) {
  const variant = getVariant(index);

  const sharedImage = (
    <div className="relative w-full h-full overflow-hidden">
      {service.image_url ? (
        <Image
          src={service.image_url}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#C4705B]/20 via-[#D4A574]/10 to-[#EBE5DE] flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-[#C4705B]/20">
            <span className="text-2xl font-serif text-[#4A2C2A] drop-shadow-sm">
              {service.name.charAt(0)}
            </span>
          </div>
        </div>
      )}

      {/* Radial glow overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#C4705B]/30 via-[#C4705B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* frame glow / hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {service.is_featured && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-[#8B3A3A] text-white px-3 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-lg shadow-[#8B3A3A]/30 ring-1 ring-[#8B3A3A]/20">
            Popular
          </div>
        </div>
      )}
    </div>
  );

  const variantClass =
    variant === 'classic'
      ? {
          wrapper:
            'bg-[#FDF8F3] border border-[#E8DFD3] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 group-hover:-translate-y-1.5',
          media:
            'bg-[#EBE5DE] rounded-t-2xl overflow-hidden aspect-[4/3]',
          iconBg: 'bg-[#FDF8F3] border border-[#E8DFD3]',
          iconColor: 'text-[#C4705B]',
          bodyBg: 'bg-white/50',
          pricePill: 'bg-[#C4705B]/10 text-[#C4705B]',
          durationPill: 'bg-[#D4A574]/10 text-[#8A4A32]',
          footer: '',
        }
      : variant === 'elevated'
        ? {
            wrapper:
              'bg-white/70 border border-white/40 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 backdrop-blur group-hover:-translate-y-1.5',
            media:
              'bg-[#EBE5DE] rounded-2xl overflow-hidden mx-4 mt-4 aspect-[4/3]',
            iconBg: 'bg-white/80 border border-white/40',
            iconColor: 'text-[#8A4A32]',
            bodyBg: 'bg-transparent',
            pricePill: 'bg-[#8A4A32]/10 text-[#8A4A32]',
            durationPill: 'bg-[#C4705B]/10 text-[#C4705B]',
            footer: '',
          }
        : variant === 'glass'
          ? {
              wrapper:
                'bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 backdrop-blur-sm group-hover:-translate-y-1.5',
              media:
                'rounded-2xl overflow-hidden mx-4 mt-4 aspect-[4/3]',
              iconBg: 'bg-white/20 border border-white/30',
              iconColor: 'text-[#D4A574]',
              bodyBg: 'bg-transparent',
              pricePill: 'bg-white/20 text-white',
              durationPill: 'bg-white/10 text-[#D4A574]',
              footer: '',
            }
          : {
              wrapper:
                'bg-gradient-to-b from-[#F7F1EC] to-[#EBE5DE] border border-[#E8DFD3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 group-hover:-translate-y-1.5',
              media:
                'bg-[#EBE5DE] rounded-t-2xl overflow-hidden aspect-[4/3]',
              iconBg: 'bg-white/70 border border-[#C4705B]/20',
              iconColor: 'text-[#8B3A3A]',
              bodyBg: 'bg-transparent',
              pricePill: 'bg-[#8B3A3A]/10 text-[#8B3A3A]',
              durationPill: 'bg-[#C4705B]/10 text-[#C4705B]',
              footer: 'border-t border-[#D4C4B5]/30',
            };

  const topIcon =
    variant === 'classic' ? (
      <Scissors className={variantClass.iconColor} size={18} />
    ) : variant === 'elevated' ? (
      <Star className={variantClass.iconColor} size={18} />
    ) : variant === 'glass' ? (
      <Heart className={variantClass.iconColor} size={18} />
    ) : (
      <Sparkles className={variantClass.iconColor} size={18} />
    );

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <div className={variantClass.wrapper}>
        {/* Media */}
        <div className={variantClass.media}>
          <div className="relative w-full h-full">
            {sharedImage}
          </div>
        </div>

        {/* Body */}
        <div className={`p-5 space-y-3 ${variantClass.bodyBg}`}>
          {/* Header: Icon + Name */}
          <div className="flex items-start gap-3">
            <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${variantClass.iconBg} shadow-sm flex-shrink-0`}>
              {topIcon}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-lg font-serif text-[#4A2C2A] leading-tight line-clamp-1">
                {service.name}
              </h3>
              {variant === 'showcase' && (
                <span className="text-[10px] uppercase tracking-widest text-[#C4705B] font-medium">
                  Signature Collection
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {service.description ? (
            <p className="text-sm text-[#8B7355] leading-relaxed line-clamp-2">
              {service.description}
            </p>
          ) : (
            <p className="text-sm text-[#8B7355] leading-relaxed line-clamp-2">
              Crafted for comfort, precision, and a flawless finish.
            </p>
          )}

          {/* Price & Duration - Pill style matching add-ons */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${variantClass.pricePill}`}>
              <DollarSign size={12} />
              <span>{formatMoneyXaf(service.price)}</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${variantClass.durationPill}`}>
              <Clock size={12} />
              <span>{service.duration}m</span>
            </div>
          </div>

          {/* CTA Button - Unique per variant */}
          <button
            onClick={onBook}
            className={
              variant === 'classic'
                ? 'w-full inline-flex items-center justify-center gap-2 text-[#8B3A3A] text-sm font-semibold py-2.5 px-4 rounded-xl bg-[#F7F1EC] hover:bg-[#C4705B] hover:text-white transition-all duration-300 border border-[#E8DFD3] hover:border-[#C4705B]'
                : variant === 'elevated'
                  ? 'w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8A4A32] to-[#C4705B] hover:from-[#C4705B] hover:to-[#B86050] transition-all duration-300 shadow-md hover:shadow-lg'
                  : variant === 'glass'
                    ? 'w-full inline-flex items-center justify-center gap-2 text-[#FDF8F3] text-sm font-semibold py-2.5 px-4 rounded-xl bg-[#C4705B]/70 hover:bg-[#C4705B]/90 transition-all duration-300 border border-white/20 backdrop-blur-sm'
                    : 'w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 px-4 rounded-xl bg-[#8B3A3A] hover:bg-[#6B2A2A] transition-all duration-300 shadow-lg shadow-[#8B3A3A]/20 hover:shadow-[#8B3A3A]/30'
            }
          >
            Book This Service
            <ChevronRight size={16} />
          </button>

          {/* Showcase footer accent */}
          {variant === 'showcase' && (
            <div className={`pt-2 ${variantClass.footer}`}>
              <p className="mt-2 text-[11px] uppercase tracking-widest text-[#8B7355]">
                Premium service • Appointment recommended
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const addOns: AddOn[] = [
    { id: '1', name: 'Steam Treatment', price: 1000, duration: 30, icon: 'droplets' },
    { id: '2', name: 'Detox Wash', price: 1500, duration: 45, icon: 'leaf' },
    { id: '3', name: 'Scalp Massage', price: 1000, duration: 20, icon: 'wind' },
    { id: '4', name: 'Deep Conditioning', price: 1500, duration: 35, icon: 'sparkles' },
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch services');
      }

      setServices(result.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchServices();
    })();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplets':
        return <Droplets size={20} />;
      case 'leaf':
        return <Leaf size={20} />;
      case 'wind':
        return <Wind size={20} />;
      case 'sparkles':
        return <Sparkles size={20} />;
      default:
        return <Sparkles size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF8F3]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B3A3A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8B3A3A] font-serif text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] relative">

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#C4705B] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8A4A32] rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#C4705B]/60" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C4705B] font-medium">Hair Artistry</span>
              <span className="w-8 h-[1px] bg-[#C4705B]/60" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-tight leading-[0.9]">
              <span className="block text-[#4A2C2A]">The Art of</span>
              <span className="block bg-gradient-to-r from-[#4A2C2A] via-[#C4705B] to-[#8A4A32] bg-clip-text text-transparent">Braiding</span>
            </h1>
            <p className="text-lg md:text-xl text-[#8B7355] font-light leading-relaxed max-w-2xl mx-auto mb-8 italic">
              &ldquo;Where heritage meets elegance. Each strand tells a story of tradition,
              crafted with modern sophistication and timeless beauty.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-32 h-px bg-gradient-to-r from-transparent to-[#C4705B]" />
              <div className="w-3 h-3 bg-[#C4705B] rounded-full" />
              <div className="w-32 h-px bg-gradient-to-l from-transparent to-[#C4705B]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#F7F1EC] to-[#EBE5DE]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <span className="w-6 h-[1px] bg-[#C4705B]/40" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4705B] font-medium">In Motion</span>
              <span className="w-6 h-[1px] bg-[#C4705B]/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#4A2C2A] mb-4 tracking-tight">
              Style <span className="bg-gradient-to-r from-[#C4705B] to-[#8A4A32] bg-clip-text text-transparent">Showcase</span>
            </h2>
            <p className="text-[#8B7355] text-lg max-w-xl mx-auto">
              Watch our latest braiding styles in action
            </p>
          </motion.div>

          <VideoGallery onBook={(serviceId) => router.push(`/book?service_id=${serviceId}`)} />
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <span className="w-6 h-[1px] bg-[#C4705B]/40" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4705B] font-medium">What We Offer</span>
              <span className="w-6 h-[1px] bg-[#C4705B]/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#4A2C2A] mb-4 tracking-tight">
              Our <span className="bg-gradient-to-r from-[#C4705B] to-[#8A4A32] bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-[#8B7355] text-lg max-w-xl mx-auto">
              Explore our complete range of braiding services
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.filter((service) => !service.video_url).map((service, index) => (
              <ServiceClassicCard
                key={service.id}
                service={service}
                index={index}
                onBook={() => router.push(`/book?service_id=${service.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Add-ons Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <span className="w-6 h-[1px] bg-[#C4705B]/40" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4705B] font-medium">Extras</span>
              <span className="w-6 h-[1px] bg-[#C4705B]/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#4A2C2A] mb-4 tracking-tight">
              Premium <span className="bg-gradient-to-r from-[#C4705B] to-[#8A4A32] bg-clip-text text-transparent">Add-ons</span>
            </h2>
            <p className="text-[#8B7355] text-lg max-w-xl mx-auto">
              Elevate your braiding experience with our premium services
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {addOns.map((addOn, index) => {
              const addonMod = index % 4;
              const addonVariant = addonMod === 0 ? 'classic' : addonMod === 1 ? 'elevated' : addonMod === 2 ? 'glass' : 'showcase';
              
              const addonWrapperClass =
                addonVariant === 'classic'
                  ? 'bg-[#FDF8F3] border border-[#E8DFD3] rounded-2xl p-6 text-center shadow-sm hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 group-hover:-translate-y-1.5 group'
                  : addonVariant === 'elevated'
                    ? 'bg-white/70 border border-white/40 rounded-2xl p-6 text-center shadow-md hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 backdrop-blur group-hover:-translate-y-1.5 group'
                    : addonVariant === 'glass'
                      ? 'bg-white/10 border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 backdrop-blur group-hover:-translate-y-1.5 group'
                      : 'bg-gradient-to-b from-[#F7F1EC] to-[#EBE5DE] border border-[#E8DFD3] rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl hover:shadow-[#C4705B]/10 transition-all duration-300 group-hover:-translate-y-1.5 group';
              
              const addonIconBg =
                addonVariant === 'classic'
                  ? 'bg-gradient-to-br from-[#C4705B]/10 to-[#D4A574]/10 border border-[#C4705B]/20'
                  : addonVariant === 'elevated'
                    ? 'bg-gradient-to-br from-[#8A4A32]/10 to-[#C4705B]/10 border border-[#8A4A32]/20'
                    : addonVariant === 'glass'
                      ? 'bg-white/20 border border-white/30'
                      : 'bg-gradient-to-br from-[#8B3A3A]/10 to-[#C4705B]/10 border border-[#8B3A3A]/20';

              const addonIconColor =
                addonVariant === 'classic' ? 'text-[#C4705B]'
                  : addonVariant === 'elevated' ? 'text-[#8A4A32]'
                    : addonVariant === 'glass' ? 'text-[#D4A574]'
                      : 'text-[#8B3A3A]';

              return (
                <motion.div
                  key={addOn.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={addonWrapperClass}
                >
                  <div className={`w-12 h-12 ${addonIconBg} rounded-xl flex items-center justify-center mx-auto mb-4 ${addonIconColor} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    {getIcon(addOn.icon)}
                  </div>

                  <h3 className="font-serif text-[#4A2C2A] text-base mb-3">{addOn.name}</h3>

                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-[#8B3A3A]/10 text-[#8B3A3A] text-xs font-semibold px-3 py-1.5 rounded-full">
                      <DollarSign size={12} />
                      <span>{addOn.price.toLocaleString()} XAF</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-[#C4705B]/10 text-[#C4705B] text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Clock size={12} />
                      <span>{addOn.duration}m</span>
                    </div>

                    {addonVariant === 'showcase' && (
                      <div className="pt-1">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C4705B]/40 to-transparent" />
                        <p className="mt-2 text-[10px] uppercase tracking-wider text-[#8B7355]">Premium add-on</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden min-h-[600px]">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="/video1.mp4"
              type="video/mp4"
            />
          </video>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[#FDF8F3] mb-6">
              Begin Your Braiding Journey
            </h2>
            <p className="text-xl text-[#D4C4B5] mb-10 font-light leading-relaxed">
              Schedule your appointment and experience the art of personalized hair styling
            </p>
            <button
              onClick={() => router.push('/book')}
              className="inline-flex items-center gap-3 bg-[#C4705B] text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-[#B86050] transition-colors shadow-xl hover:shadow-2xl"
            >
              Book Your Appointment
              <ArrowRight size={24} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


