'use client';

import { useEffect, useState } from 'react';
import { FaCut, FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';

// Define TypeScript interface for Service
interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        setError('Failed to fetch services. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred while fetching services.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.price.toString().includes(searchTerm)
  );

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setError('Please provide both name and price.');
      return;
    }

    const endpoint = editingId ? `/api/services/${editingId}` : '/api/services';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          description
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (editingId) {
          setServices(services.map(s => (s.id === editingId ? result : s)));
        } else {
          setServices([...services, result]);
        }
        setError(null);
        resetForm();
      } else {
        setError('Failed to save service. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred while saving the service.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setServices(services.filter(s => s.id !== id));
          setError(null);
        } else {
          setError('Failed to delete service. Please try again.');
        }
      } catch {
        setError('An unexpected error occurred while deleting the service.');
      }
    }
  };

  const handleEdit = (service: Service) => {
    setName(service.name);
    setPrice(service.price.toString());
    setDescription(service.description);
    setEditingId(service.id);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setEditingId(null);
    setError(null);
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
          <h1 className="text-2xl font-bold text-gray-800">إدارة الخدمات</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة وتعديل خدمات الصالون</p>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="بحث عن خدمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Dashboard Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Form and Stats Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Add/Edit Service Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaCut /> {editingId ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
            </h2>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">اسم الخدمة</label>
                <input
                  type="text"
                  placeholder="اسم الخدمة"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">السعر (دج)</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">دج</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full p-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">وصف الخدمة (اختياري)</label>
                <textarea
                  placeholder="أدخل وصف الخدمة"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg transition"
                >
                  <FaPlus /> {editingId ? 'حفظ التعديلات' : 'إضافة'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition"
                  >
                    <FaTimes /> إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stats Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">إحصائيات الخدمات</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">عدد الخدمات</span>
                <span className="font-medium">{services.length}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">قيد التعديل</span>
                <span className="font-medium">{editingId ? 1 : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">نتائج البحث</span>
                <span className="font-medium">{filteredServices.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services List Column */}
        <div className="xl:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaCut /> قائمة الخدمات
              </h2>
              <div className="text-sm text-gray-500">
                عرض {filteredServices.length} من {services.length}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-400">جاري تحميل بيانات الخدمات...</div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FaCut className="mx-auto text-4xl text-gray-300 mb-3" />
                {searchTerm ? 'لا توجد نتائج بحث' : 'لا يوجد خدمات مسجلة بعد'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الخدمة
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        السعر
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{service.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{service.price} دج</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(service)} className="text-blue-500 hover:text-primary-700">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700">
                              <FaTrash />
                            </button>
                          </div>
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
    </div>
  );
}