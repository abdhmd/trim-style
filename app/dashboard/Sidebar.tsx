'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'

import {
    FaHome,
    FaCut,
    FaCalendarAlt,
    FaUserTie,
    FaSignOutAlt,
    FaTimes,
    FaCog,
} from 'react-icons/fa';

const links = [
    { href: '/dashboard', label: 'الرئيسية', icon: <FaHome className="text-xl" /> },
    { href: '/dashboard/bookings', label: 'الحجوزات', icon: <FaCalendarAlt className="text-xl" /> },
    { href: '/dashboard/barbers', label: 'الحلاقين', icon: <FaUserTie className="text-xl" /> },
    { href: '/dashboard/services', label: 'الخدمات', icon: <FaCut className="text-xl" /> }, 
    { href: '/dashboard/settings', label: 'الاعدادات', icon: <FaCog className="text-xl" /> },

];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);


    const router = useRouter()
    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        router.push('/login') // التوجيه إلى صفحة تسجيل الدخول بعد الخروج
    }

    return (
        <div>
            {/* زر القائمة الجانبية للموبايل */}
            {!isOpen && (
                <button
                    className="lg:hidden p-4 text-white bg-primary-800 fixed top-4 right-4 z-50 rounded-full"
                    onClick={toggleSidebar}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`lg:w-64 w-64 bg-primary-800 text-white p-6 h-screen fixed top-0 right-0 transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } lg:translate-x-0`}
            >
                {/* زر إغلاق للموبايل */}
                <div className="flex justify-end lg:hidden">
                    <button onClick={toggleSidebar} className="text-white mb-4">
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-8 text-primary-100">لوحة التحكم</h2>
                <nav className="space-y-4">
                    {links.map(({ href, label, icon }) => (
                        <Link
                            onClick={toggleSidebar}
                            key={href}
                            href={href}
                            className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-primary-700 ${pathname === href ? 'bg-primary-600 font-semibold' : 'text-primary-100'
                                }`}
                        >
                            <span className="ml-3">{icon}</span>
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-8">
                    <button onClick={handleLogout} className="cursor-pointer w-full flex items-center justify-start p-3 text-primary-100 hover:bg-primary-700 rounded-lg transition">
                        <span className="ml-3 ">
                            <FaSignOutAlt className="text-xl" />
                        </span>
                        <span >تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black opacity-50 z-30"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}
