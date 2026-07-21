'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  Download,
  Loader2,
} from 'lucide-react';

interface Booking {
  id: string;
  customer: { name: string; email: string; phone: string | null };
  service: { name: string; price: number };
  // User-chosen style stored with the booking
  style_name?: string | null;
  stylist: { name: string } | null;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  total_price: number | null;
  created_at: string;
}

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch bookings');
      }

      setBookings(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRespond = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'Failed to update booking status');
      }

      await fetchBookings();
    } catch {
      alert('Failed to update booking status');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete booking');
      await fetchBookings();
    } catch {
      alert('Failed to delete booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
        <button onClick={fetchBookings} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
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
          <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Bookings Management</h1>
          <p className="text-[#454545]">Manage all your salon bookings and appointments</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium">
          <Plus size={20} />
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          {/* Clear all */}
          <div>
            <button
              onClick={async () => {
                if (!confirm('Clear ALL bookings? This cannot be undone.')) return;

                try {
                  const res = await fetch('/api/bookings/clear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}),
                  });

                  if (!res.ok) {
                    const txt = await res.text().catch(() => '');
                    throw new Error(txt || 'Failed to clear bookings');
                  }

                  await fetchBookings();
                } catch (e) {
                  alert(e instanceof Error ? e.message : 'Failed to clear bookings');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition text-xs font-medium"
              title="Delete all bookings"
            >
              <Trash2 size={16} />
              Clear All Bookings
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A4A32] size-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-[#3A241C]/20 rounded-lg hover:bg-[#F7F1EC] transition">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Redesigned Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: totals */}
        <div className="md:col-span-8 bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif text-[#3A241C]">Overview</h2>
              <p className="text-sm text-[#454545] mt-1">Bookings + status breakdown for your salon.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[#3A241C]/10 bg-[#F7F1EC]/40">
                <Calendar size={14} className="text-[#8A4A32]" />
                Total: {bookings.length}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[#3A241C]/10 bg-[#F7F1EC]/40">
                <CheckCircle size={14} className="text-green-600" />
                Confirmed: {bookings.filter((b) => b.status === 'confirmed').length}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[#3A241C]/10 bg-[#F7F1EC]/40">
                <Clock size={14} className="text-yellow-600" />
                Pending: {bookings.filter((b) => b.status === 'pending').length}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-[#3A241C]/10 bg-gradient-to-br from-[#8A4A32]/5 to-transparent p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#454545]">Revenue (non-cancelled)</p>
                  <p className="text-3xl font-bold text-[#3A241C] mt-1">
                    {bookings
                      .filter((b) => b.status !== 'cancelled')
                      .reduce((sum, b) => sum + (b.total_price || b.service.price || 0), 0)
                      .toLocaleString()}{' '}
                    <span className="text-base font-semibold">XAF</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#8A4A32] flex items-center justify-center">
                  <span className="text-white text-xl">₣</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#3A241C]/10 bg-gradient-to-br from-[#3A241C]/5 to-transparent p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#454545]">Cancellation rate</p>
                  <p className="text-3xl font-bold text-[#3A241C] mt-1">
                    {bookings.length === 0
                      ? '0%'
                      : `${Math.round((bookings.filter((b) => b.status === 'cancelled').length / bookings.length) * 100)}%`}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#3A241C] flex items-center justify-center">
                  <span className="text-white text-xl">%</span>
                </div>
              </div>
              <p className="text-xs text-[#454545] mt-2">
                Helps track quality and availability.
              </p>
            </div>
          </div>
        </div>

        {/* Right: quick tiles */}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#454545]">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{bookings.filter((b) => b.status === 'completed').length}</p>
              </div>
              <span className="text-blue-600">✓</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#454545]">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{bookings.filter((b) => b.status === 'cancelled').length}</p>
              </div>
              <span className="text-red-600">✕</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-4 sm:col-span-2">
            <p className="text-sm text-[#454545]">Next action</p>
            <p className="text-lg font-semibold text-[#3A241C] mt-1">
              {bookings.some((b) => b.status === 'pending')
                ? 'Review pending bookings'
                : 'All caught up'}
            </p>
            <p className="text-xs text-[#454545] mt-2">
              Confirm or reject pending requests to keep the schedule updated.
            </p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden"
      >
        <div className="overflow-x-auto overscroll-contain max-h-[75vh] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#F7F1EC]/50">
              <tr className="text-left text-sm font-medium text-[#454545]">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Style</th>
                <th className="px-6 py-4">Stylist</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-[#3A241C]/10 hover:bg-[#F7F1EC]/30 transition">
                  <td className="px-6 py-4 font-mono text-xs text-[#454545]">{booking.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#3A241C]">{booking.customer.name}</div>
                    <div className="text-xs text-[#454545]">{booking.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 text-[#454545]">{booking.service.name}</td>
                  <td className="px-6 py-4 text-[#454545]">{booking.style_name || '—'}</td>
                  <td className="px-6 py-4 text-[#454545]">{booking.stylist?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#3A241C]">{new Date(booking.appointment_date).toLocaleDateString()}</div>
                    <div className="text-xs text-[#454545]">{booking.appointment_time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#3A241C]">{(booking.total_price || booking.service.price).toLocaleString()} XAF</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition" title="View Details">
                        <Eye size={16} className="text-[#8A4A32]" />
                      </button>
                      <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition" title="Edit">
                        <Edit size={16} className="text-[#8A4A32]" />
                      </button>

                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleRespond(booking.id, 'confirmed')}
                            className="px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition text-xs font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleRespond(booking.id, 'cancelled')}
                            className="px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition text-xs font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-[#8A4A32] size-12 mb-4" />
            <p className="text-[#454545]">No bookings found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

