'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader2, CheckCircle } from 'lucide-react';

interface StylistFormProps {
  stylist?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function StylistForm({ stylist, onSubmit, onCancel }: StylistFormProps) {
  const [formData, setFormData] = useState({
    name: stylist?.name || '',
    bio: stylist?.bio || '',
    specialties: stylist?.specialties || [],
    rating: stylist?.rating || 5,
    is_active: stylist?.is_active !== false,
  });

  const [imageUrl, setImageUrl] = useState(stylist?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'stylists');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setImageUrl(result.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...formData.specialties];
    newSpecialties[index] = value;
    setFormData({ ...formData, specialties: newSpecialties });
  };

  const addSpecialty = () => {
    setFormData({ ...formData, specialties: [...formData.specialties, ''] });
  };

  const removeSpecialty = (index: number) => {
    const newSpecialties = formData.specialties.filter((_: string, i: number) => i !== index);
    setFormData({ ...formData, specialties: newSpecialties });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      image_url: imageUrl || null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#3A241C]/10 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[#3A241C]">
            {stylist ? 'Edit Stylist' : 'Add New Stylist'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#F7F1EC] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#454545] mb-2">
              Profile Image
            </label>
            <div className="border-2 border-dashed border-[#3A241C]/20 rounded-lg p-6 text-center hover:border-[#8A4A32] transition">
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Stylist preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    id="stylist-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="stylist-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="p-4 bg-[#F7F1EC] rounded-full mb-2">
                      {uploading ? (
                        <Loader2 className="animate-spin text-[#8A4A32] size-6" />
                      ) : (
                        <Upload className="text-[#8A4A32] size-6" />
                      )}
                    </div>
                    <p className="text-sm text-[#454545]">
                      {uploading ? 'Uploading...' : 'Click to upload profile image'}
                    </p>
                  </label>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
            {uploadSuccess && (
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <CheckCircle size={14} /> Upload successful
              </p>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="Stylist name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="Tell us about this stylist..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Specialties
              </label>
              {formData.specialties.map((specialty: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                    placeholder="e.g., Braiding, Coloring"
                  />
                  {formData.specialties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecialty}
                className="text-sm text-[#8A4A32] hover:text-[#6A3A22] transition"
              >
                + Add Specialty
              </button>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-[#3A241C]/20 text-[#8A4A32] focus:ring-[#8A4A32]"
              />
              <span className="text-sm font-medium text-[#454545]">Active Stylist</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#3A241C]/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-[#3A241C]/20 rounded-lg hover:bg-[#F7F1EC] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition"
            >
              {stylist ? 'Update Stylist' : 'Add Stylist'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
