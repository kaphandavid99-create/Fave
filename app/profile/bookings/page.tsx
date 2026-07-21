'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Loader2, Search, Trash2 } from 'lucide-react';


type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface BookingRow {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: BookingStatus;
  notes: string | null;
  total_price: number | null;
  created_at: string;
  service?: { name: string; price: number };
  stylist?: { name: string } | null;
  style_name?: string | null;
}

function statusLabel(status: BookingStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusClasses(status: BookingStatus) {
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
}

export default function ProfileBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('ProfileBookingsPage rendered');

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/bookings/my');
      const json = await res.json();

      console.log('Bookings API response:', json);
      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorMessage = json?.error || 'Failed to fetch your bookings';
        const errorDetails = json?.details || '';
        throw new Error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}`);
      }

      setBookings((json?.data ?? []) as BookingRow[]);
    } catch (e) {
      console.error('Error fetching bookings:', e);
      setError(e instanceof Error ? e.message : 'Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return bookings;

    return bookings.filter((b) => {
      const haystack = [
        b.id,
        b.service?.name,
        b.style_name,
        b.stylist?.name,
        b.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [bookings, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#8A4A32] size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl mx-auto">
        <p className="text-red-800 font-medium mb-2">Error loading bookings</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        {error.includes('Database not configured') && (
          <div className="text-xs text-red-500 mb-4 text-left">
            <p className="font-medium mb-2">To view real bookings, you need to:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Set up a Supabase project</li>
              <li>Add these environment variables to your .env.local file:</li>
              <code className="block mt-1 bg-red-100 p-2 rounded">NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</code>
              <code className="block mt-1 bg-red-100 p-2 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key</code>
              <li>Ensure your email matches a customer record in the database</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        )}
        <button
          onClick={fetchMyBookings}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#3A241C]">My Bookings</h1>
          <p className="text-[#454545]">View all your salon appointments and their status.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[#3A241C]/10 bg-[#F7F1EC]/40">
            <Calendar size={14} className="text-[#8A4A32]" />
            Total: {bookings.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A4A32] size-5" />
            <input
              type="text"
              placeholder="Search bookings by service, status, style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto pb-4 md:pb-0 max-h-[60vh] md:max-h-none scrollbar-thin">
          <table className="w-full min-w-[800px] mb-4">
            <thead className="bg-[#F7F1EC]/50">
              <tr className="text-left text-sm font-medium text-[#454545]">
                <th className="px-6 py-4">Booking</th>
                <th className="px-6 py-4">Service / Style</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Stylist</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-[#3A241C]/10 hover:bg-[#F7F1EC]/30 transition"
                >

                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-[#454545]">{b.id.slice(0, 8)}</div>
                    <div className="text-[11px] text-[#454545] opacity-70">{new Date(b.created_at).toLocaleDateString()}</div>
                  </td>

                  <td className="px-6 py-4 text-[#454545]">
                    <div className="font-medium text-[#3A241C]">{b.service?.name || '—'}</div>
                    <div className="text-xs text-[#454545]">{b.style_name || '—'}</div>
                  </td>

                  <td className="px-6 py-4 text-[#454545]">
                    <div className="font-medium text-[#3A241C]">
                      {new Date(b.appointment_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#454545]">
                      <Clock size={14} />
                      {b.appointment_time}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-[#454545]">
                    {b.stylist?.name || 'Unassigned'}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses(
                        b.status
                      )}`}
                    >
                      {statusLabel(b.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-medium text-[#3A241C]">
                    {(b.total_price ?? b.service?.price ?? 0).toLocaleString()} XAF
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (!confirm('Delete this booking?')) return;
                          (async () => {
                            try {
                              const res = await fetch(`/api/bookings/${b.id}`, {
                                method: 'DELETE',
                              });
                              if (!res.ok) {
                                const txt = await res.text().catch(() => '');
                                throw new Error(txt || 'Failed to delete booking');
                              }
                              await fetchMyBookings();
                            } catch (e) {
                              alert(e instanceof Error ? e.message : 'Failed to delete booking');
                            }
                          })();
                        }}
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

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-[#8A4A32] size-12 mb-4" />
            <p className="text-[#454545]">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}

