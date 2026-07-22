'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight
} from 'lucide-react';

import FooterThreeAnimation from '@/components/FooterThreeAnimation';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-linear-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] relative z-10 overflow-hidden">
      {/* Elegant decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#C4705B]/30 to-transparent" />
      
      {/* Subtle decorative Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#C4705B]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#8A4A32]/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative">
      
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 md:gap-12 mb-16">
          
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-[#C4705B]/20 to-[#8A4A32]/20 rounded-full blur-xl" />
                <Image 
                  src="/logo-img.png" 
                  alt="Fave's Touch Logo" 
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain relative"
                />
              </div>
            </div>
            
            <p className="text-white/60 text-sm leading-relaxed text-center lg:text-left font-light tracking-wide">
              Crafting elegance through artistic hair braiding. Where tradition meets contemporary sophistication.
            </p>

            <div className="flex gap-3 justify-center lg:justify-start">
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:border-[#C4705B]/50 hover:bg-[#C4705B]/10 group transition-all duration-300"
              >
                <Mail className="text-white/60 group-hover:text-[#C4705B] w-4 h-4 transition-colors" />
              </motion.a>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 sm:col-span-2 lg:contents">
            {/* Quick Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <h4 className="text-sm font-medium text-white/90 tracking-widest uppercase letter-spacing-wide">
                Explore
              </h4>
              <ul className="space-y-4">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Services', href: '/services' },
                  { name: 'Gallery', href: '/gallery' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'Book Now', href: '/book' },
                  { name: 'About Us', href: '/about' }
                ].map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <a 
                      href={link.href} 
                      className="text-white/50 hover:text-[#C4705B] transition-colors duration-300 flex items-center gap-3 text-sm group"
                    >
                      <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#C4705B] transition-colors" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-6"
            >
              <h4 className="text-sm font-medium text-white/90 tracking-widest uppercase letter-spacing-wide">
                Contact
              </h4>
              <ul className="space-y-5">
                {[
                  { icon: MapPin, label: 'Address', value: '123 Beauty Lane, Style City, SC 12345' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: Mail, label: 'Email', value: 'hello@pejah.com' }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-sm">
                    <div className="w-10 h-10 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                      <item.icon className="text-[#C4705B] w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-white/90">{item.label}</p>
                      <p className="text-white/50">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Business Hours & Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <h4 className="text-sm font-medium text-white/90 tracking-widest uppercase letter-spacing-wide">
              Hours
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { days: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
                { days: 'Saturday', hours: '10:00 AM - 6:00 PM' },
                { days: 'Sunday', hours: 'Closed', highlight: true }
              ].map((item, index) => (
                <li key={index} className="flex justify-between text-white/50">
                  <span>{item.days}</span>
                  <span className={`font-medium ${item.highlight ? 'text-[#C4705B]' : 'text-white/90'}`}>
                    {item.hours}
                  </span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="pt-6 border-t border-white/10">
              <h5 className="font-medium text-white/90 mb-4 text-sm tracking-wide">Stay Connected</h5>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:outline-none focus:border-[#C4705B]/50 focus:bg-white/10 text-sm text-white placeholder-white/30 transition-all duration-300"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-4 py-3 bg-linear-to-r from-[#C4705B] to-[#8A4A32] text-white rounded-lg hover:shadow-lg hover:shadow-[#C4705B]/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium tracking-wide"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Elegant divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Footer 3D animation */}
        <FooterThreeAnimation />
        <div className="absolute inset-0 pointer-events-none" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm text-center md:text-left font-light">
            © {new Date().getFullYear()} Fave&apos;s Touch. Crafted with elegance.
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
              <a 
                key={index}
                href="#" 
                className="text-white/40 hover:text-[#C4705B] transition-colors duration-300 font-light"
              >
                {item}
              </a>
            ))}
          </div>

          <motion.div
            className="flex items-center gap-2 text-white/30 text-xs font-light tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Designed by DaveTech
          </motion.div>
        </div>
      </div>
    </footer>
  );
}