'use client';

import { motion } from 'framer-motion';
import { GiScissors } from 'react-icons/gi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const pathname = usePathname(); // Get the current route path
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on the dashboard | login route
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return null;
  }

  const navLinks = [
    { name: 'الرئيسية', href: '/#home' },
    { name: 'الخدمات', href: '/#services' },
    { name: 'عن المحل', href: '/#about' },
    { name: 'اتصل بنا', href: '/#contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-md"
    >
      <div className="container mx-auto p-5 flex justify-between items-center">
        <Link href="/#home" className="flex items-center gap-2">
          <GiScissors className="text-2xl text-primary-600" />
          <span className="text-xl font-bold text-gray-800">TrimStyle</span>
        </Link>

        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <FiX className="text-2xl" />
          ) : (
            <FiMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white"
        >
          <div className="container mx-auto px-4 py-2 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-3 text-gray-700 hover:text-primary-600 transition-colors border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;