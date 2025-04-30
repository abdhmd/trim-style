'use client';

import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaTrash, FaSearch } from 'react-icons/fa';

interface Booking {
  id: number;
  customer: string;
  phone: string;
  date: string;
  barber?: { name: string };
  service?: { name: string };
}

interface Barber {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
}

interface FormState {
  customer: string;
  phone: string;
  date: string;
  time: string;
  barberId: string;
  serviceId: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<FormState>({
    customer: '',
    phone: '',
    date: '',
    time: '09:00',
    barberId: '',
    serviceId: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, barbersRes, servicesRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/barbers'),
        fetch('/api/services'),
      ]);

      const [bookingsData, barbersData, servicesData] = await Promise.all([
        bookingsRes.json(),
        barbersRes.json(),
        servicesRes.json(),
      ]);

      setBookings(bookingsData);
      setBarbers(barbersData);
      setServices(servicesData);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.phone.includes(searchTerm) ||
    booking.barber?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const dateTime = new Date(`${form.date}T${form.time}`);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form.customer,
          phone: form.phone,
          date: dateTime.toISOString(),
          barberId: form.barberId,
          serviceId: form.serviceId,
        }),
      });

      if (res.ok) {
        setForm({ customer: '', phone: '', date: '', time: '09:00', barberId: '', serviceId: '' });
        fetchAllData();
      } else {
        setError('حدث خطأ أثناء إنشاء الحجز.');
      }
    } catch{}
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      try {
        const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setBookings(bookings.filter((b) => b.id !== id));
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const timeSlots: string[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      numberingSystem: 'latn',
    });
  };

  const formatBookingTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      numberingSystem: 'latn',
    });
  };

  return (
    <div className="p-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الحجوزات</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة وتعديل حجوزات العملاء</p>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="بحث عن حجز بالاسم أو الجوال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <FaCalendarAlt /> إضافة حجز جديد
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">اسم العميل</label>
              <input
                type="text"
                placeholder="اسم العميل"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">رقم الجوال</label>
              <input
                type="text"
                placeholder="رقم الجوال"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">التاريخ</label>
                <input
                  type="date"
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">الوقت</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">الحلاق</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none"
                value={form.barberId}
                onChange={(e) => setForm({ ...form, barberId: e.target.value })}
                required
              >
                <option value="">اختر الحلاق</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">الخدمة</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none"
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                required
              >
                <option value="">اختر الخدمة</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg transition mt-4"
            >
              تأكيد الحجز
            </button>
          </form>
        </div>

        {/* Bookings */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-6">
            <FaCalendarAlt /> قائمة الحجوزات
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-400">جاري تحميل بيانات الحجوزات...</div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FaCalendarAlt className="mx-auto text-4xl mb-3" />
              {searchTerm ? 'لا توجد نتائج بحث' : 'لا يوجد حجوزات بعد'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الجوال</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ والوقت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحلاق والخدمة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{booking.customer}</td>
                      <td className="px-6 py-4">{booking.phone}</td>
                      <td className="px-6 py-4">
                        <div>{formatBookingDate(booking.date)}</div>
                        <div className="text-sm text-gray-500">{formatBookingTime(booking.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{booking.barber?.name || 'غير محدد'}</div>
                        <div className="text-sm text-gray-500">{booking.service?.name || 'غير محدد'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-100 transition"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
