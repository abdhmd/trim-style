'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FaCalendarAlt, FaUserTie, FaCut, FaChartLine, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface Booking {
  id: number;
  customer: string;
  date: string;
  barber?: { name: string };
  service?: { name: string; price: number };
}

const Home = () => {
  const router = useRouter();

  const [stats, setStats] = useState<Stat[]>([
    { title: 'الحجوزات اليوم', value: '0', icon: <FaCalendarAlt className="text-3xl" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'الحلاقين', value: '0', icon: <FaUserTie className="text-3xl" />, color: 'bg-green-100 text-green-600' },
    { title: 'الخدمات', value: '0', icon: <FaCut className="text-3xl" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'الإيرادات اليوم', value: '0 SAR', icon: <FaMoneyBillWave className="text-3xl" />, color: 'bg-orange-100 text-orange-600' },
  ]);

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const [bookingsRes, barbersRes, servicesRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/barbers'),
        fetch('/api/services'),
      ]);

      const [bookings, barbers, services] = await Promise.all([
        bookingsRes.json(),
        barbersRes.json(),
        servicesRes.json(),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todaysBookings = bookings.filter((booking: Booking) =>
        new Date(booking.date).toISOString().split('T')[0] === today
      );

      const todayRevenue = todaysBookings.reduce((sum: number, booking: Booking) => {
        return sum + (booking.service?.price || 0);
      }, 0);

      setStats([
        { ...stats[0], value: todaysBookings.length.toString() },
        { ...stats[1], value: barbers.length.toString() },
        { ...stats[2], value: services.length.toString() },
        { ...stats[3], value: `SAR ${todayRevenue.toLocaleString('en-US', { numberingSystem: 'latn' })}` },
      ]);

      const sortedBookings = [...bookings]
        .sort((a: Booking, b: Booking) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentBookings(sortedBookings);
    } catch {
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setStats, setRecentBookings, stats]);

  useEffect(() => {
    const isAuth = localStorage.getItem('auth');
    if (isAuth !== 'true') {
      router.push('/login');
    } else {
      fetchDashboardData();
    }
  }, [fetchDashboardData, router]);

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      numberingSystem: 'latn',
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      numberingSystem: 'latn',
    });
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartLine /> نظرة عامة
          </h1>
          <p className="text-gray-500 text-sm mt-1">نظرة عامة على أداء الصالون</p>
        </div>
      </div>

      {/* Dashboard Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stats and Quick Actions */}
        <div className="xl:col-span-1 space-y-6">
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaChartLine /> الإحصائيات
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-lg font-bold text-primary-600">
                      {isLoading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaChartLine /> إجراءات سريعة
            </h2>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-between p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition"
                onClick={() => router.push('/dashboard/bookings')}
              >
                <span>إضافة حجز جديد</span>
                <FaCalendarAlt />
              </button>
              <button
                className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition"
                onClick={() => router.push('/dashboard/barbers')}
              >
                <span>إدارة الحلاقين</span>
                <FaUserTie />
              </button>
              <button
                className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition"
                onClick={() => router.push('/dashboard/services')}
              >
                <span>إدارة الخدمات</span>
                <FaCut />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Bookings and Today's Schedule */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaCalendarAlt /> آخر الحجوزات
            </h2>
            <button
              className="text-primary-600 hover:text-primary-800 text-sm"
              onClick={() => router.push('/dashboard/bookings')}
            >
              عرض الكل
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-400">جاري تحميل بيانات الحجوزات...</div>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-3" />
              لا توجد حجوزات
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ والوقت
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحلاق والخدمة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/dashboard/bookings')}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div>{formatDate(booking.date)}</div>
                          <div className="flex items-center mt-1">
                            <FaClock className="ml-1 text-gray-400 text-xs" />
                            {formatTime(booking.date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaUserTie className="ml-1 text-gray-400 text-xs" />
                            {booking.barber?.name || 'غير محدد'}
                          </div>
                          <div className="flex items-center mt-1">
                            <FaCut className="ml-1 text-gray-400 text-xs" />
                            {booking.service?.name || 'غير محدد'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Today's Schedule */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaCalendarAlt /> جدول اليوم
            </h2>
            {isLoading ? (
              <div className="animate-pulse bg-gray-100 h-40 rounded-xl"></div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-center text-gray-500 mb-4">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    numberingSystem: 'latn',
                  })}
                </p>
                <div className="space-y-2" role="list" aria-label="Today's bookings">
                  {(() => {
                    const today = new Date();
                    const todayBookings = recentBookings
                      .filter((booking) => {
                        const bookingDate = new Date(booking.date);
                        return (
                          bookingDate.getFullYear() === today.getFullYear() &&
                          bookingDate.getMonth() === today.getMonth() &&
                          bookingDate.getDate() === today.getDate()
                        );
                      })
                      .slice(0, 3);

                    if (todayBookings.length === 0) {
                      return (
                        <p className="text-center text-gray-400 text-sm py-2">
                          لا توجد حجوزات لهذا اليوم
                        </p>
                      );
                    }

                    return todayBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition"
                      >
                        <span className="text-sm font-medium">{booking.customer}</span>
                        <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                          {formatTime(booking.date)}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;