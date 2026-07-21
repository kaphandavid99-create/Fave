'use client';

import { useState } from 'react';
import { FaBars, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';
import ClerkUserButtonClientOnly from '@/components/admin/ClerkUserButtonClientOnly';
import NotificationBell from '@/components/NotificationBell';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

function NavbarAuthControls() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // Prevent Clerk mount timing issues during hydration
    return <div className="flex items-center justify-center" aria-hidden="true" />;
  }

  if (!isSignedIn) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SignInButton mode="modal">
            <button
              className="px-5 py-2 text-sm font-semibold text-[#5A3A2C] border-2 border-[#5A3A2C] rounded-full hover:bg-[#5A3A2C] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}
            >
              Sign In
            </button>
          </SignInButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SignUpButton mode="modal">
            <button
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#8A4A32] to-[#5A3A2C] rounded-full hover:from-[#6B3A24] hover:to-[#4A2A1C] transition-all duration-300 shadow-md hover:shadow-lg"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}
            >
              Sign Up
            </button>
          </SignUpButton>
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <ClerkUserButtonClientOnly />
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlistCount } = useWishlist();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Book', path: '/book' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#F7F1EC] z-50 max-w-7xl mx-auto flex justify-between items-center py-0 md:py-0 px-4 md:px-8 border-b border-[#5A3A2C]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-32 h-32 md:w-40 md:h-40 -my-8 md:-my-12"
        >
          <Link href="/">
            <img
              src="/logo-img.png"
              alt="Fave's Touch Logo"
              className="w-full h-full object-contain"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <ul
          className="hidden md:flex gap-6 lg:gap-8 text-xs md:text-sm uppercase flex-1 justify-center"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}
        >
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`hover:text-[#8A4A32] transition ${
                  isActive(item.path) ? 'border-b-2 border-[#5A3A2C] pb-1' : ''
                }`}
                style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href="https://wa.me/237671641680"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#25D366] hover:text-[#128C7E] transition-colors"
              aria-label="Contact via WhatsApp"
            >
              <FaWhatsapp size={24} />
            </motion.a>




            {/* Wishlist (heart + count) */}


            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative text-[#C4705B] hover:text-[#8A4A32] transition-colors"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C4705B] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Notification Bell (always visible) */}
            <div className="relative">
              <NotificationBell />
            </div>

            {/* Clerk Auth Controls (hydration-safe) */}
            <NavbarAuthControls />
          </div>

          {/* Mobile Menu Button + Notification */}
          <div className="md:hidden flex items-center gap-2">
            <motion.a
              href="https://wa.me/237671641680"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="text-[#25D366] p-2"
              aria-label="Contact via WhatsApp"
            >
              <FaWhatsapp size={20} />
            </motion.a>

            {/* Mobile Wishlist Heart */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative text-[#C4705B] hover:text-[#8A4A32] transition-colors p-2"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C4705B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <NotificationBell />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#5A3A2C] p-2"
            >
              {mobileMenuOpen ? (
                <span className="text-2xl font-bold">✕</span>
              ) : (
                <FaBars size={20} />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
            aria-hidden={!mobileMenuOpen}
          >
            <motion.button
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close menu"
            />

            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="absolute right-0 top-0 h-full w-[85vw] max-w-[420px] bg-[#F7F1EC] border-l border-[#5A3A2C] shadow-2xl overflow-y-auto"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm uppercase tracking-[0.2em] text-[#8A4A32] font-semibold">
                    Menu
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-[#F3D5D8] transition"
                    aria-label="Close menu"
                  >
                    <span className="text-[#5A3A2C] font-bold">✕</span>
                  </motion.button>
                </div>

                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.path}
                      className={`block py-3 text-sm uppercase hover:text-[#8A4A32] transition ${
                        isActive(item.path) ? 'text-[#8A4A32] font-semibold' : ''
                      }`}
                      style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="pt-4 border-t border-[#5A3A2C]/30 space-y-3"
                >
                  <motion.a
                    href="https://wa.me/237671641680"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-[#25D366] border-2 border-[#25D366] rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300"
                    style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaWhatsapp size={18} />
                    Contact on WhatsApp
                  </motion.a>

                  <div className="flex items-center justify-center">
                    <NavbarAuthControls />
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

