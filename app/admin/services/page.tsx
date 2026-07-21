'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatVideoUrl } from '@/lib/video-utils';
import { 
  Search, 
  Plus, 
  Scissors,
  Clock,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Award,
  Sparkles,
  Loader2,
  X,
  Play,
  Images
} from 'lucide-react';
import ServiceForm from '@/components/admin/ServiceForm';
import StyleMediaUpload from '@/components/admin/StyleMediaUpload';

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
  created_at: string;
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch services');
      }

      console.log('Admin fetched services:', result.data);
      setServices(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchServices();
  }, []);

  // (fetchServices moved above; duplicate block removed)


  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      console.log('=== DELETE SERVICE FROM ADMIN ===');
      console.log('Service ID:', serviceId);

      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceId }),
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);
      
      let result;
      try {
        const responseText = await response.text();
        console.log('Delete response text:', responseText);
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        result = { error: 'Failed to parse server response' };
      }
      
      console.log('Delete response parsed:', result);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        console.error('Delete failed:', result);
        console.error('Response status:', response.status);
        // Response text already logged above
        
        const errorMessage = result?.error || result?.details || result?.message || 'Failed to delete service';
        const errorDetails = result?.details || result?.errorDetails || '';
        console.error('Error message:', errorMessage);
        console.error('Error details:', errorDetails);
        
      // If it's a booking constraint error, force delete bookings + service.
        if (
          response.status === 400 &&
          (errorMessage.toLowerCase().includes('booking') ||
            errorMessage.toLowerCase().includes('bookings'))
        ) {
          const forceDelete = confirm(
            `${errorMessage}\n\nDo you want to delete the associated bookings as well?`
          );
          
          if (forceDelete) {
            // Force delete with cascade
            const forceResponse = await fetch(`/api/services/${serviceId}?force=true`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: serviceId }),
            });

            const forceResult = await forceResponse.json();
            if (forceResponse.ok) {
              await fetchServices();
              return;
            } else {
              throw new Error(forceResult.error || 'Failed to force delete service');
            }
          } else {
            throw new Error(errorMessage);
          }
        }
        
        throw new Error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`);
      }

      // Refresh services
      await fetchServices();
    } catch (err) {
      console.error('Delete error:', err);
      console.error('Error type:', typeof err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        alert(`Delete failed: ${err.message}`);
      } else {
        console.error('Unknown error:', err);
        alert('Delete failed: Unknown error occurred');
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Submitting form data:', JSON.stringify(formData, null, 2));

      const url = editingService 
        ? `/api/services/${editingService.id}`
        : '/api/services';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        console.error('API Error:', result);
        throw new Error(result.error || result.details || (editingService ? 'Failed to update service' : 'Failed to create service'));
      }

      console.log('Service created/updated successfully');
      // Refresh services and close form
      await fetchServices();
      setShowForm(false);
      setEditingService(null);
    } catch (err) {
      console.error('Form submission error:', err);
      alert(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#8A4A32] size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchServices}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Services Management</h1>
          <p className="text-[#454545]">Manage your salon services, pricing, and descriptions</p>
        </div>
        <button 
          onClick={() => {
            setEditingService(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A4A32] size-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Total Services</p>
              <p className="text-2xl font-bold text-[#3A241C]">{services.length}</p>
            </div>
            <Scissors className="text-[#8A4A32]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Featured</p>
              <p className="text-2xl font-bold text-[#8A4A32]">{services.filter(s => s.is_featured).length}</p>
            </div>
            <Sparkles className="text-[#8A4A32]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Avg. Price</p>
              <p className="text-2xl font-bold text-[#3A241C]">{Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) || 0} XAF</p>
            </div>
            <DollarSign className="text-[#8A4A32]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Avg. Duration</p>
              <p className="text-2xl font-bold text-[#3A241C]">{Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length) || 0}m</p>
            </div>
            <Clock className="text-[#8A4A32]" size={24} />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Service Image/Video */}
            <div className="relative h-48 bg-[#F7F1EC]">
              {service.video_url ? (
                <video
                  key={service.video_url}
                  src={formatVideoUrl(service.video_url)}
                  poster={service.image_url || undefined}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  controls
                  preload="auto"
                  onError={(e) => {
                    console.error('Admin video load error:', e);
                    console.error('Video URL:', service.video_url);
                    console.error('Formatted URL:', formatVideoUrl(service.video_url));
                    // Fallback to image if video fails
                    if (service.image_url) {
                      (e.target as HTMLVideoElement).poster = service.image_url;
                    }
                  }}
                />
              ) : service.image_url ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${service.image_url}")` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scissors className="text-[#8A4A32]/30 size-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A241C]/80 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {service.is_featured && (
                  <span className="px-3 py-1 bg-[#8A4A32] text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Sparkles size={12} />
                    Featured
                  </span>
                )}
              </div>

              {/* Category Badge */}
              {service.category && (
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-[#3A241C] text-xs font-medium rounded-full">
                    {service.category}
                  </span>
                </div>
              )}

              {/* Media indicators */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {service.video_url && (
                  <div className="bg-white/90 backdrop-blur-sm text-[#3A241C] p-2 rounded-full">
                    <Play size={14} />
                  </div>
                )}
                {service.gallery && service.gallery.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm text-[#3A241C] p-2 rounded-full">
                    <Images size={14} />
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-serif text-[#3A241C]">{service.name}</h3>
                <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition">
                  <MoreVertical size={18} className="text-[#454545]" />
                </button>
              </div>

              {service.description && (
                <p className="text-sm text-[#454545] mb-4 line-clamp-2">{service.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-[#8A4A32]" />
                  <div>
                    <p className="text-lg font-bold text-[#3A241C]">{service.price.toLocaleString()} XAF</p>
                    <p className="text-xs text-[#454545]">Price</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#8A4A32]" />
                  <div>
                    <p className="text-lg font-bold text-[#3A241C]">{service.duration}m</p>
                    <p className="text-xs text-[#454545]">Duration</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#3A241C]/10">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingService(service);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-[#F7F1EC] rounded-lg transition" 
                    title="Edit"
                  >
                    <Edit size={16} className="text-[#8A4A32]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition" 
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-[#3A241C]/10">
          <Scissors className="mx-auto text-[#8A4A32] size-12 mb-4" />
          <p className="text-[#454545]">No services found</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Style Media Upload Sections */}
      <div className="mt-12 space-y-8">
        <div className="border-t border-[#3A241C]/10 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-serif text-[#3A241C] mb-2">Style Gallery Manager</h2>
            <p className="text-[#454545]">Upload and manage media for different braid styles</p>
          </motion.div>

          {/* Classic Braids Section */}
          <StyleMediaUpload
            styleCategory="classic-braids"
            title="Classic Braids Collection"
            description="Upload images and videos showcasing classic and timeless braiding styles. Perfect for displaying traditional protective styles and timeless designs."
          />

          <div className="my-8" />

          {/* Modern Style Section */}
          <StyleMediaUpload
            styleCategory="modern-style"
            title="Modern Style Collection"
            description="Upload images and videos showcasing contemporary and trendy braiding styles. Feature your latest designs and modern interpretations."
          />
        </div>
      </div>
    </div>
  );
}
