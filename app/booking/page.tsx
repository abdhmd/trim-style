'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { FaUser, FaPhone, FaCalendarAlt, FaUserTie, FaCut, FaCheck, FaMapMarkerAlt, FaClock, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

interface BookingForm {
  customer: string;
  phone: string;
  date: string;
  barberId: string;
  serviceId: string;
}

interface Barber {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

const Booking = () => {
  const [formData, setFormData] = useState<BookingForm>({
    customer: '',
    phone: '',
    date: '',
    barberId: '',
    serviceId: '',
  });

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersRes, servicesRes] = await Promise.all([
          fetch('/api/barbers'),
          fetch('/api/services'),
        ]);

        const barbersData = await barbersRes.json();
        const servicesData = await servicesRes.json();

        setBarbers(barbersData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({type: 'error', message: 'حدث خطأ أثناء جلب البيانات'});
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { customer, phone, date, barberId, serviceId } = formData;

    if (!customer || !phone || !date || !barberId || !serviceId) {
      setNotification({type: 'error', message: 'الرجاء ملء جميع الحقول المطلوبة'});
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setNotification({type: 'success', message: 'تم تأكيد الحجز بنجاح! شكراً لاختيارك صالوننا'});
        setFormData({
          customer: '',
          phone: '',
          date: '',
          barberId: '',
          serviceId: '',
        });
      } else {
        const error = await response.json();
        setNotification({type: 'error', message: error.error || 'حدث خطأ أثناء الحجز'});
      }
    } catch (error) {
      console.error('Error during booking:', error);
      setNotification({type: 'error', message: 'حدث خطأ أثناء الحجز'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="booking" className="w-full py-20 bg-white relative">
      {/* Notification Card */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <FaCheck className="text-lg" />
                ) : (
                  <FaTimes className="text-lg" />
                )}
                <p>{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-lg font-bold"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">حجز موعد</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احجز موعدك الآن واستمتع بأفضل خدمات الحلاقة والتزيين
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-primary-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">احجز موعدك</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-600 mb-1">
                    <FaUser className="inline ml-2" /> الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="customer"
                    name="customer"
                    className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="أدخل اسمك"
                    value={formData.customer}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
                    <FaPhone className="inline ml-2" /> رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="أدخل رقم هاتفك"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="serviceId" className="block text-sm font-medium text-gray-600 mb-1">
                    <FaCut className="inline ml-2" /> الخدمة المطلوبة
                  </label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.serviceId}
                    onChange={handleChange}
                  >
                    <option value="">اختر الخدمة</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price} ر.س
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">
                    <FaCalendarAlt className="inline ml-2" /> التاريخ والوقت
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="barberId" className="block text-sm font-medium text-gray-600 mb-1">
                    <FaUserTie className="inline ml-2" /> اختر الحلاق
                  </label>
                  <select
                    id="barberId"
                    name="barberId"
                    className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.barberId}
                    onChange={handleChange}
                  >
                    <option value="">اختر الحلاق</option>
                    {barbers.map((barber) => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaCheck /> {isLoading ? 'جاري التحميل...' : 'تأكيد الحجز'}
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-primary-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">معلومات الصالون</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-primary-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">العنوان</h4>
                    <p className="text-gray-600">شارع الملك عبدالعزيز، الرياض</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaPhone className="text-primary-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">الهاتف</h4>
                    <p className="text-gray-600">+966 12 345 6789</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FaClock className="text-primary-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">ساعات العمل</h4>
                    <p className="text-gray-600">
                      الأحد - الخميس: 9 صباحاً - 10 مساءً
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium text-gray-800 mb-3">تابعنا على</h4>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="bg-primary-100 hover:bg-primary-200 text-primary-800 p-3 rounded-full transition-colors"
                    >
                      <FiFacebook className="text-xl" />
                    </a>
                    <a
                      href="#"
                      className="bg-primary-100 hover:bg-primary-200 text-primary-800 p-3 rounded-full transition-colors"
                    >
                      <FiInstagram className="text-xl" />
                    </a>
                    <a
                      href="#"
                      className="bg-primary-100 hover:bg-primary-200 text-primary-800 p-3 rounded-full transition-colors"
                    >
                      <BsWhatsapp className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Booking;