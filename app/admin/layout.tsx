'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ClerkUserButtonClientOnly from '@/components/admin/ClerkUserButtonClientOnly';

// Admin pages should not show the global marketing Navbar/Footer.
// This layout is meant to be fully admin-only.

import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  UserCog, 
  Clock, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  Image as ImageIcon,
  Image,
  Video
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Services', href: '/admin/services', icon: Scissors },
    { name: 'Stylists', href: '/admin/stylists', icon: UserCog },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Media', href: '/admin/media', icon: ImageIcon },
    { name: 'Reels', href: '/admin/reels', icon: Video },
    { name: 'Availability', href: '/admin/availability', icon: Clock },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F1EC]">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full bg-[#3A241C] text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-[#8A4A32]/30">
          {sidebarOpen && (
            <h1 className="text-2xl font-serif text-[#F7F1EC]">Fave's Touch Admin</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#8A4A32]/20 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#8A4A32] text-white shadow-lg'
                    : 'text-[#F7F1EC]/80 hover:bg-[#8A4A32]/30 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#8A4A32]/30">
            <ClerkUserButtonClientOnly />
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-[#3A241C]/10 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A4A32] size-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent bg-[#F7F1EC]/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition relative">
                <Bell size={20} className="text-[#3A241C]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#8A4A32] rounded-full"></span>
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
