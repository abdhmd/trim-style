'use client'

import { GiScissors } from 'react-icons/gi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const navLinks = [
    { name: 'الرئيسية', href: '/#home' },
    { name: 'الخدمات', href: '/#services' },
    { name: 'عن المحل', href: '/#about' },
    { name: 'اتصل بنا', href: '/#contact' },
  ];
  const pathname = usePathname(); // Get the current route path

  // Hide footer on the dashboard | login route
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/#home" className="flex items-center gap-2 mb-4">
              <GiScissors className="text-2xl text-primary-400" />
              <span className="text-xl font-bold">TrimStyle</span>
            </Link>
            <p className="text-gray-400 text-center md:text-left max-w-md">
              حلاقة احترافية بمعايير عالمية. نحن نقدم أفضل الخدمات لعملائنا الكرام.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-primary-300">روابط سريعة</h3>
            <ul className="flex flex-col items-center md:items-start gap-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-primary-300">تواصل معنا</h3>
            <p className="text-gray-400 mb-2">شارع الملك عبدالعزيز، الرياض</p>
            <p className="text-gray-400 mb-2">+966 12 345 6789</p>
            <p className="text-gray-400">info@trimstyle.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TrimStyle. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;