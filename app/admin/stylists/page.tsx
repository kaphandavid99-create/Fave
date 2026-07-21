'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  UserCog,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Loader2
} from 'lucide-react';
import StylistForm from '@/components/admin/StylistForm';

interface Stylist {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[];
  image_url: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function StylistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);

  useEffect(() => {
    fetchStylists();
  }, []);

  const fetchStylists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stylists');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch stylists');
      }

      setStylists(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stylists');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stylistId: string) => {
    if (!confirm('Are you sure you want to delete this stylist?')) {
      return;
    }

    try {
      const response = await fetch(`/api/stylists/${stylistId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete stylist');
      }

      await fetchStylists();
    } catch (err) {
      alert('Failed to delete stylist');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = editingStylist 
        ? `/api/stylists/${editingStylist.id}`
        : '/api/stylists';
      
      const method = editingStylist ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(editingStylist ? 'Failed to update stylist' : 'Failed to create stylist');
      }

      await fetchStylists();
      setShowForm(false);
      setEditingStylist(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const filteredStylists = stylists.filter(stylist => {
    const matchesSearch = 
      stylist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stylist.bio && stylist.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      stylist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
          onClick={fetchStylists}
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
          <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Stylists Management</h1>
          <p className="text-[#454545]">Manage your salon team and their performance</p>
        </div>
        <button 
          onClick={() => {
            setEditingStylist(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium"
        >
          <Plus size={20} />
          Add Stylist
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A4A32] size-5" />
          <input
            type="text"
            placeholder="Search stylists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Total Stylists</p>
              <p className="text-2xl font-bold text-[#3A241C]">{stylists.length}</p>
            </div>
            <UserCog className="text-[#8A4A32]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Active Stylists</p>
              <p className="text-2xl font-bold text-green-600">{stylists.filter(s => s.is_active).length}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#454545]">Avg. Rating</p>
              <p className="text-2xl font-bold text-[#3A241C]">
                {stylists.length > 0 
                  ? (stylists.reduce((sum, s) => sum + s.rating, 0) / stylists.length).toFixed(1) 
                  : '0'}
              </p>
            </div>
            <Star className="text-[#8A4A32] size={24}" />
          </div>
        </div>
      </div>

      {/* Stylists Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredStylists.map((stylist) => (
          <div key={stylist.id} className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Stylist Header */}
            <div className="bg-gradient-to-r from-[#8A4A32] to-[#5C241E] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {stylist.image_url ? (
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden">
                      <img
                        src={stylist.image_url}
                        alt={stylist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#8A4A32] font-serif font-bold text-2xl">
                      {stylist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-serif text-white">{stylist.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={14} className="text-yellow-300 fill-yellow-300" />
                      <span className="text-white text-sm font-medium">{stylist.rating.toFixed(1)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${stylist.is_active ? 'bg-green-500' : 'bg-gray-500'} text-white mt-2 inline-block`}>
                      {stylist.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/20 rounded-lg transition">
                  <MoreVertical size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Stylist Details */}
            <div className="p-6 space-y-4">
              {stylist.bio && (
                <p className="text-sm text-[#454545] italic">{stylist.bio}</p>
              )}
              
              {stylist.specialties.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#3A241C] mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {stylist.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-[#F7F1EC] text-[#3A241C] text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#3A241C]/10">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingStylist(stylist);
                      setShowForm(true);
                    }}
                    className="p-2 hover:bg-[#F7F1EC] rounded-lg transition"
                    title="Edit"
                  >
                    <Edit size={16} className="text-[#8A4A32]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(stylist.id)}
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

      {filteredStylists.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-[#3A241C]/10">
          <UserCog className="mx-auto text-[#8A4A32] size-12 mb-4" />
          <p className="text-[#454545]">No stylists found</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <StylistForm
          stylist={editingStylist}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingStylist(null);
          }}
        />
      )}
    </div>
  );
}
