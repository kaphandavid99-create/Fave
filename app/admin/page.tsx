'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Calendar, DollarSign, Loader2, Scissors, Users, Eye, TrendingUp } from 'lucide-react';
import AdminHeroThreeAnimation from '@/components/admin/AdminHeroThreeAnimation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    totalServices: 0,
    totalSubscribers: 0,
  });
  const [visitorStats, setVisitorStats] = useState({
    today: { totalVisits: 0, uniqueVisitors: 0, authenticatedUsers: 0 },
    month: { totalVisits: 0, uniqueVisitors: 0, authenticatedUsers: 0 },
    year: { totalVisits: 0, uniqueVisitors: 0, authenticatedUsers: 0 },
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const bookingsResponse = await fetch('/api/bookings');
      const bookingsText = await bookingsResponse.text();
      const bookingsData = bookingsResponse.ok ? JSON.parse(bookingsText) : { error: bookingsText };


      const customersResponse = await fetch('/api/customers');
      const customersText = await customersResponse.text();
      const customersData = customersResponse.ok ? JSON.parse(customersText) : { error: customersText };


      const servicesResponse = await fetch('/api/services');
      const servicesText = await servicesResponse.text();
      const servicesData = servicesResponse.ok ? JSON.parse(servicesText) : { error: servicesText };


      const subscribersResponse = await fetch('/api/subscribers');
      const subscribersText = await subscribersResponse.text();
      const subscribersData = subscribersResponse.ok ? JSON.parse(subscribersText) : { error: subscribersText };

      const visitsResponse = await fetch('/api/visits/statistics');
      const visitsText = await visitsResponse.text();
      const visitsData = visitsResponse.ok ? JSON.parse(visitsText) : { error: visitsText };

      if (bookingsResponse.ok) {
        const bookings = bookingsData.data || [];
        const revenue = bookings
          .filter((b: any) => b.status !== 'cancelled')
          .reduce((sum: number, b: any) => sum + (b.total_price || b.service?.price || 0), 0);

        setRecentBookings(bookings.slice(0, 7));
        setStats((prev) => ({ ...prev, totalBookings: bookings.length, totalRevenue: revenue }));
      }

      if (customersResponse.ok) {
        const customers = customersData.data || [];
        setStats((prev) => ({ ...prev, activeCustomers: customers.length }));
      }

      if (servicesResponse.ok) {
        const services = servicesData.data || [];
        setStats((prev) => ({ ...prev, totalServices: services.length }));
      }

      if (subscribersResponse.ok) {
        const subscribers = subscribersData.data || [];
        setStats((prev) => ({ ...prev, totalSubscribers: subscribers.length }));
      }

      if (visitsResponse.ok && visitsData.data) {
        setVisitorStats({
          today: visitsData.data.today || { totalVisits: 0, uniqueVisitors: 0, authenticatedUsers: 0 },
          month: visitsData.data.month || { totalVisits: 0, uniqueVisitors: 0, authenticatedUsers: 0 },
          year: visitsData.data.year || { totalVisits: 0, uniqueVisitors: 0, authenticatedUsers: 0 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = useMemo(
    () => [
      {
        name: 'Total Bookings',
        value: stats.totalBookings.toString(),
        change: '+12.5%',
        icon: Calendar,
        color: 'from-[#8A4A32] to-[#C4705B]',
        pill: 'text-green-700 bg-green-100',
      },
      {
        name: 'Active Customers',
        value: stats.activeCustomers.toString(),
        change: '+8.2%',
        icon: Users,
        color: 'from-[#5C241E] to-[#C4705B]',
        pill: 'text-green-700 bg-green-100',
      },
      {
        name: 'Total Revenue',
        value: `${stats.totalRevenue.toLocaleString()} XAF`,
        change: '+15.3%',
        icon: DollarSign,
        color: 'from-[#3A241C] to-[#8A4A32]',
        pill: 'text-green-700 bg-green-100',
      },
      {
        name: 'Services Offered',
        value: stats.totalServices.toString(),
        change: '+2',
        icon: Scissors,
        color: 'from-[#6A3A2C] to-[#C4705B]',
        pill: 'text-green-700 bg-green-100',
      },
      {
        name: "Today's Visitors",
        value: visitorStats.today.uniqueVisitors.toString(),
        change: `${visitorStats.today.totalVisits} visits`,
        icon: Eye,
        color: 'from-[#4A7C59] to-[#8A4A32]',
        pill: 'text-blue-700 bg-blue-100',
      },
      {
        name: 'Monthly Visitors',
        value: visitorStats.month.uniqueVisitors.toString(),
        change: `${visitorStats.month.totalVisits} visits`,
        icon: TrendingUp,
        color: 'from-[#5C6B8A] to-[#8A4A32]',
        pill: 'text-blue-700 bg-blue-100',
      },
      {
        name: 'Yearly Visitors',
        value: visitorStats.year.uniqueVisitors.toString(),
        change: `${visitorStats.year.totalVisits} visits`,
        icon: Users,
        color: 'from-[#6A5A4A] to-[#C4705B]',
        pill: 'text-blue-700 bg-blue-100',
      },
      {
        name: 'Total Subscribers',
        value: stats.totalSubscribers?.toString?.() ?? '0',
        change: '+0%',
        icon: DollarSign,
        color: 'from-[#5C241E] to-[#C4705B]',
        pill: 'text-green-700 bg-green-100',
      },
    ],
    [stats, visitorStats]
  );

  const statusClass = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="text-[#8A4A32] size-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#3A241C]/10 bg-white/70 shadow-sm backdrop-blur">
        <AdminHeroThreeAnimation />

        <div className="relative p-5 sm:p-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#8A4A32]">ADMIN DASHBOARD</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#3A241C] mt-1">
                Dashboard Overview
              </h1>
              <p className="text-sm sm:text-base text-[#454545] mt-2">
                Welcome back — here’s what’s happening in your salon right now.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-[#3A241C]/10 bg-white/60 px-4 py-3">
                <p className="text-xs sm:text-sm text-[#454545]">Today’s focus</p>
                <p className="font-semibold text-[#3A241C]">Bookings + Revenue</p>
              </div>
              <div className="hidden sm:block rounded-2xl bg-gradient-to-r from-[#8A4A32] to-[#C4705B] px-4 py-3 text-white shadow">
                <p className="text-xs">Performance</p>
                <p className="font-semibold">Strong momentum</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6"
          >
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.name}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group rounded-2xl border border-[#3A241C]/10 bg-white/65 backdrop-blur px-4 py-4 shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#454545]">{stat.name}</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#3A241C] mt-1">{stat.value}</p>
                    </div>

                    <div className={`shrink-0 rounded-2xl bg-gradient-to-br ${stat.color} p-3 shadow-sm`}>
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="rounded-full p-[6px] bg-[#F7F1EC]/70 border border-[#3A241C]/10">
                      <ArrowUp size={14} className="text-green-700" />
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold ${stat.pill}`}>{stat.change}</span>
                    <span className="hidden sm:inline text-xs text-[#7A665B]">vs last month</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Recent Bookings */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="mt-5 sm:mt-7 rounded-3xl border border-[#3A241C]/10 bg-white/80 backdrop-blur shadow-sm"
      >
        <div className="px-5 sm:px-7 py-5 border-b border-[#3A241C]/10">
          <h2 className="text-lg sm:text-xl font-serif text-[#3A241C]">Recent Bookings</h2>
          <p className="text-xs sm:text-sm text-[#6E5E52] mt-1">Latest customer activity across your services.</p>
        </div>

        <div className="p-5 sm:p-7">
          {recentBookings.length ? (
            <div className="space-y-3">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate" style={{ borderSpacing: '0 8px' }}>
                  <thead>
                    <tr className="text-left text-xs sm:text-sm font-medium text-[#6E5E52]">
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Service</th>
                      <th className="pb-2">Date & Time</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking, idx) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="bg-[#F7F1EC]/60 hover:bg-[#F7F1EC]/90 transition-colors"
                      >
                        <td className="py-3 px-3 rounded-l-2xl font-semibold text-[#3A241C]">
                          {booking.customer?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-[#5A4A3F]">{booking.service?.name || 'N/A'}</td>
                        <td className="py-3 px-3 text-[#5A4A3F] whitespace-nowrap">
                          <div>{new Date(booking.appointment_date).toLocaleDateString()}</div>
                          <div className="text-xs">{booking.appointment_time}</div>
                        </td>
                        <td className="py-3 px-3 rounded-r-2xl">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(booking.status)}`}
                          >
                            {booking.status || 'N/A'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden grid gap-3">
                {recentBookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="rounded-2xl border border-[#3A241C]/10 bg-[#F7F1EC]/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#6E5E52]">Customer</p>
                        <p className="font-semibold text-[#3A241C] mt-1">{booking.customer?.name || 'N/A'}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(booking.status)}`}
                      >
                        {booking.status || 'N/A'}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-[#6E5E52]">Service</p>
                      <p className="text-sm font-semibold text-[#5A4A3F] mt-1">{booking.service?.name || 'N/A'}</p>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-[#6E5E52]">Date & Time</p>
                      <p className="text-sm font-semibold text-[#5A4A3F] mt-1">
                        {new Date(booking.appointment_date).toLocaleDateString()} · {booking.appointment_time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#6E5E52]">
              <Calendar className="mx-auto mb-4 text-[#8A4A32] size-12" />
              <p>No bookings yet</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Visitor Statistics */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.45 }}
        className="mt-5 sm:mt-7 rounded-3xl border border-[#3A241C]/10 bg-white/80 backdrop-blur shadow-sm"
      >
        <div className="px-5 sm:px-7 py-5 border-b border-[#3A241C]/10">
          <h2 className="text-lg sm:text-xl font-serif text-[#3A241C]">Visitor Statistics</h2>
          <p className="text-xs sm:text-sm text-[#6E5E52] mt-1">Track your website traffic and visitor engagement.</p>
        </div>

        <div className="p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Today's Stats */}
            <div className="rounded-2xl border border-[#3A241C]/10 bg-[#F7F1EC]/60 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-gradient-to-br from-[#4A7C59] to-[#8A4A32] p-2">
                  <Eye size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#6E5E52]">Today</p>
                  <p className="font-semibold text-[#3A241C]">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Total Visits</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.today.totalVisits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Unique Visitors</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.today.uniqueVisitors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Authenticated Users</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.today.authenticatedUsers}</span>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="rounded-2xl border border-[#3A241C]/10 bg-[#F7F1EC]/60 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-gradient-to-br from-[#5C6B8A] to-[#8A4A32] p-2">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#6E5E52]">This Month</p>
                  <p className="font-semibold text-[#3A241C]">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Total Visits</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.month.totalVisits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Unique Visitors</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.month.uniqueVisitors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Authenticated Users</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.month.authenticatedUsers}</span>
                </div>
              </div>
            </div>

            {/* Yearly Stats */}
            <div className="rounded-2xl border border-[#3A241C]/10 bg-[#F7F1EC]/60 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-gradient-to-br from-[#6A5A4A] to-[#C4705B] p-2">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#6E5E52]">This Year</p>
                  <p className="font-semibold text-[#3A241C]">{new Date().getFullYear()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Total Visits</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.year.totalVisits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Unique Visitors</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.year.uniqueVisitors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5A4A3F]">Authenticated Users</span>
                  <span className="font-bold text-[#3A241C]">{visitorStats.year.authenticatedUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

