'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaUser, FaPhone, FaCalendarAlt, FaEdit, FaArrowRight, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Define the Booking interface
interface Booking {
  id: string;
  customer: string;
  phone: string;
  date: string;
}

const CheckBooking = () => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const checkBooking = async () => {
    setIsLoading(true);
    setError(null);
    setNotification(null);

    try {
      const res = await fetch(`/api/bookings/check?name=${customerName}&phone=${phone}`);
      const data = await res.json();

      if (data.booking) {
        setBooking(data.booking);
        setNewDate(new Date(data.booking.date).toISOString().slice(0, 16));
      } else {
        setBooking(null);
        setNotification({
          type: 'info',
          message: 'لم يتم العثور على حجز بهذه البيانات'
        });
      }
    } catch {
      setNotification({
        type: 'error',
        message: 'حدث خطأ أثناء البحث عن الحجز. حاول مرة أخرى.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBooking = async () => {
    if (!newDate) {
      setError('يجب تحديد تاريخ جديد');
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${booking?.id}`, {
        method: 'PUT',
        body: JSON.stringify({ date: newDate }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedBooking = await res.json();

      if (res.ok) {
        setBooking(updatedBooking);
        setError(null);
        setNotification({
          type: 'success',
          message: 'تم تحديث الحجز بنجاح!'
        });
      } else {
        setError('حدث خطأ أثناء تحديث الحجز.');
        setNotification({
          type: 'error',
          message: 'حدث خطأ أثناء تحديث الحجز.'
        });
      }
    } catch {
      setError('حدث خطأ غير متوقع أثناء تحديث الحجز.');
      setNotification({
        type: 'error',
        message: 'حدث خطأ غير متوقع أثناء تحديث الحجز.'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Notification Cards */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 left-4 sm:left-auto max-w-md mx-auto p-4 rounded-lg shadow-lg z-50 ${notification.type === 'success' ? 'bg-green-100 text-green-800' :
              notification.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <FaCheck className="text-xl" />
              ) : notification.type === 'error' ? (
                <FaExclamationTriangle className="text-xl" />
              ) : (
                <FaExclamationTriangle className="text-xl" />
              )}
              <p>{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-lg font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">التحقق من الحجز</h2>
            <p className="mt-2 text-gray-600">أدخل بياناتك للعثور على حجزك</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              API Response
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              onClick={checkBooking}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaSearch />
              {isLoading ? 'جارٍ البحث...' : 'البحث عن الحجز'}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-100 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {booking ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">تفاصيل الحجز</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <FaUser className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">الزبون</p>
                      <p className="font-medium">{booking.customer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <FaPhone className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">رقم الهاتف</p>
                      <p className="font-medium">{booking.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <FaCalendarAlt className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">موعد الحجز</p>
                      <p className="font-medium">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <FaEdit /> تعديل الموعد
                  </h4>
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={updateBooking}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center p-6 bg-gray-50 rounded-lg"
              >
                <p className="text-gray-600 mb-4">أدخل بياناتك للبحث عن حجزك</p>
                <Link href="/booking" passHref>
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    احجز موعد جديد <FaArrowRight />
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckBooking;