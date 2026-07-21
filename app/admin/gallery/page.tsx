'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  Trash2,
  Edit,
  Loader2,
  Save,
  X,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';

interface GalleryItem {
  id: number;
  styleName: string;
  length: string;
  color: string;
  image: string;
  description: string;
}

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  name: string;
  type: string;
}

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    styleName: 'Knotless Cornrows',
    length: 'Medium',
    color: 'Black',
    description: '',
    image: ''
  });

  const styleOptions = ['Knotless Cornrows', 'Key Braids','Puzzles','Knotless Braids', 'Fulani Braids'];
  const lengthOptions = ['Short', 'Medium', 'Long'];
  const colorOptions = ['Black', 'Brown', 'Blonde', 'Red', 'Ombre'];

  useEffect(() => {
    fetchGalleryItems();
    fetchMediaItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery-admin');
      const data = await response.json();
      if (data.success) {
        setGalleryItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/media?type=image');
      const data = await response.json();
      if (data.success) {
        setMediaItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching media items:', error);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      styleName: 'Knotless Cornrows',
      length: 'Medium',
      color: 'Black',
      description: '',
      image: ''
    });
    setShowAddModal(true);
  };

  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      styleName: item.styleName,
      length: item.length,
      color: item.color,
      description: item.description,
      image: item.image
    });
    setShowAddModal(true);
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch('/api/gallery-admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        setGalleryItems(galleryItems.filter(item => item.id !== id));
        showSuccess('Gallery item deleted successfully');
      }
    } catch (error) {
      showError('Failed to delete gallery item');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      showError('Please select an image');
      return;
    }

    setSaveStatus('saving');
    
    try {
      const payload = editingItem 
        ? { ...formData, id: editingItem.id }
        : formData;

      const method = editingItem ? 'PUT' : 'POST';
      const response = await fetch('/api/gallery-admin', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        if (editingItem) {
          setGalleryItems(galleryItems.map(item => 
            item.id === editingItem.id ? { ...item, ...formData } : item
          ));
          showSuccess('Gallery item updated successfully');
        } else {
          setGalleryItems([...galleryItems, { ...formData, id: data.id }]);
          showSuccess('Gallery item added successfully');
        }
        setShowAddModal(false);
      } else {
        showError(data.error || 'Failed to save gallery item');
      }
    } catch (error) {
      showError('Failed to save gallery item');
    } finally {
      setSaveStatus('idle');
    }
  };

  const showSuccess = (message: string) => {
    setSaveStatus('success');
    setSaveMessage(message);
    setTimeout(() => {
      setSaveStatus('idle');
      setSaveMessage('');
    }, 3000);
  };

  const showError = (message: string) => {
    setSaveStatus('error');
    setSaveMessage(message);
    setTimeout(() => {
      setSaveStatus('idle');
      setSaveMessage('');
    }, 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'gallery');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (response.ok && result.url) {
        setFormData({ ...formData, image: result.url });
        // Refresh media items to include the newly uploaded image
        await fetchMediaItems();
      } else {
        showError('Failed to upload image');
      }
    } catch (error) {
      showError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Gallery Management</h1>
        <p className="text-[#454545]">Manage your portfolio images and their styling details</p>
      </div>

      {/* Success/Error Message */}
      {saveMessage && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
          saveStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          saveStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {saveStatus === 'success' && <Check size={20} />}
          {saveStatus === 'error' && <AlertCircle size={20} />}
          {saveStatus === 'saving' && <Loader2 size={20} className="animate-spin" />}
          <span className="font-medium">{saveMessage}</span>
        </div>
      )}

      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddItem}
        className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium w-fit"
      >
        <Plus size={20} />
        Add Gallery Item
      </motion.button>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-[#8A4A32] animate-spin size-12" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden">
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  whileHover={{ y: -5 }}
                  className="bg-[#F7F1EC] rounded-xl overflow-hidden border border-[#3A241C]/10 group"
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={item.image}
                      alt={item.styleName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditItem(item)}
                        className="p-3 bg-white rounded-full"
                      >
                        <Edit size={20} className="text-[#3A241C]" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-3 bg-red-500 rounded-full"
                      >
                        <Trash2 size={20} className="text-white" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-serif font-bold text-[#5C241E] mb-2">
                      {item.styleName}
                    </h3>
                    <p className="text-sm text-[#3A241C] mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-white rounded-full text-[#3A241C]">
                        {item.length}
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-[#5C241E]">
                        {item.color}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#454545]">
              <ImageIcon className="mx-auto text-[#8A4A32]/30 size-16 mb-4" />
              <p className="text-lg">No gallery items yet</p>
              <p className="text-sm mt-2">Click "Add Gallery Item" to create your first portfolio entry</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-[#3A241C]/10 flex items-center justify-between">
              <h2 className="text-2xl font-serif text-[#3A241C]">
                {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-[#F7F1EC] rounded-lg transition"
              >
                <X size={24} className="text-[#454545]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Image Upload and Selection */}
              <div>
                <label className="block text-sm font-medium text-[#454545] mb-3">
                  Image
                </label>
                
                {/* Upload New Image */}
                <div className="mb-4">
                  <div className="border-2 border-dashed border-[#3A241C]/20 rounded-lg p-4 text-center hover:border-[#8A4A32] transition">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="p-2 bg-[#F7F1EC] rounded-full mb-2">
                        {uploading ? (
                          <Loader2 className="animate-spin text-[#8A4A32] size-6" />
                        ) : (
                          <ImageIcon className="text-[#8A4A32] size-6" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#3A241C]">
                        {uploading ? 'Uploading...' : 'Upload new image'}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Or Select from Existing Media */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#3A241C]/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#454545]">Or select from media library</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {mediaItems.length > 0 ? (
                    mediaItems.map((media, index) => (
                      <button
                        key={`${media.id}-${index}`}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: media.url })}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                          formData.image === media.url
                            ? 'border-[#8A4A32]'
                            : 'border-transparent hover:border-[#3A241C]/30'
                        }`}
                      >
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                        {formData.image === media.url && (
                          <div className="absolute top-2 right-2 bg-[#8A4A32] rounded-full p-1">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 bg-[#F7F1EC] rounded-lg">
                      <ImageIcon className="mx-auto text-[#8A4A32]/30 size-12 mb-2" />
                      <p className="text-sm text-[#454545]">
                        No media uploaded yet. Upload an image above or go to Media section.
                      </p>
                    </div>
                  )}
                </div>

                {/* Selected Image Preview */}
                {formData.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[#454545] mb-2">Selected Image:</p>
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-[#8A4A32]">
                      <img
                        src={formData.image}
                        alt="Selected"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Style Name */}
              <div>
                <label className="block text-sm font-medium text-[#454545] mb-2">
                  Style Name
                </label>
                <select
                  value={formData.styleName}
                  onChange={(e) => setFormData({ ...formData, styleName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                  required
                >
                  {styleOptions.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              {/* Length and Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#454545] mb-2">
                    Length
                  </label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full px-4 py-3 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                    required
                  >
                    {lengthOptions.map((length) => (
                      <option key={length} value={length}>
                        {length}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#454545] mb-2">
                    Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                    required
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#454545] mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                  placeholder="Describe this hairstyle..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-[#F7F1EC] text-[#3A241C] rounded-lg hover:bg-[#E7E1DC] transition font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {editingItem ? 'Update' : 'Add'} Gallery Item
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}