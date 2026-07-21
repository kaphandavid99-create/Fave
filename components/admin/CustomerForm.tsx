'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckCircle } from 'lucide-react';

interface CustomerFormProps {
  customer?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    preferences: customer?.preferences || {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#3A241C]/10 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[#3A241C]">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#F7F1EC] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                placeholder="Customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="customer@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#454545] mb-2">
                Address
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] bg-[#F7F1EC]/50"
                placeholder="Customer address"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#3A241C]/10">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border border-[#3A241C]/20 rounded-lg hover:bg-[#F7F1EC] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                customer ? 'Update Customer' : 'Add Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
