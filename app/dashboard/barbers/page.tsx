'use client';
import { useEffect, useState } from 'react';
import { FaUserTie, FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';

interface Barber {
  id: number;
  name: string;
  bio: string;
}

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/barbers');
      const data: Barber[] = await res.json();
      setBarbers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBarbers: Barber[] = barbers.filter((barber) =>
    barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barber.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !bio) return;

    const endpoint = editingId ? `/api/barbers/${editingId}` : '/api/barbers';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      });

      if (res.ok) {
        const result: Barber = await res.json();
        if (editingId) {
          setBarbers(barbers.map((b) => (b.id === editingId ? result : b)));
        } else {
          setBarbers([...barbers, result]);
        }
        resetForm();
      }
    } catch (error) {
      console.error('Error saving barber:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الحلاق؟')) {
      try {
        const res = await fetch(`/api/barbers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setBarbers(barbers.filter((b) => b.id !== id));
        }
      } catch (error) {
        console.error('Error deleting barber:', error);
      }
    }
  };

  const handleEdit = (barber: Barber) => {
    setName(barber.name);
    setBio(barber.bio);
    setEditingId(barber.id);
  };

  const resetForm = () => {
    setName('');
    setBio('');
    setEditingId(null);
  };

  return (
    <div className="p-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            إدارة الحلاقين <span className="text-sm text-gray-500">({barbers.length})</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">إدارة وتعديل بيانات الحلاقين في الصالون</p>
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="بحث عن حلاق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Dashboard Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Stats Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Add/Edit Barber Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaUserTie /> {editingId ? 'تعديل الحلاق' : 'إضافة حلاق جديد'}
            </h2>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">اسم الحلاق</label>
                <input
                  type="text"
                  placeholder="اسم الحلاق"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">نبذة عن الحلاق</label>
                <textarea
                  placeholder="وصف مختصر"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
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
            <h2 className="text-lg font-semibold mb-4 text-gray-700">إحصائيات الحلاقين</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">عدد الحلاقين</span>
                <span className="font-medium">{barbers.length}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">قيد التعديل</span>
                <span className="font-medium">{editingId ? 1 : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">نتائج البحث</span>
                <span className="font-medium">{filteredBarbers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barbers List Column */}
        <div className="xl:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaUserTie /> قائمة الحلاقين
              </h2>
              <div className="text-sm text-gray-500">
                عرض {filteredBarbers.length} من {barbers.length}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-400">جاري تحميل بيانات الحلاقين...</div>
              </div>
            ) : filteredBarbers.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FaUserTie className="mx-auto text-4xl text-gray-300 mb-3" />
                {searchTerm ? 'لا توجد نتائج بحث' : 'لا يوجد حلاقين مسجلين بعد'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBarbers.map((barber) => (
                      <tr key={barber.id} className={editingId === barber.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2">
                              <FaUserTie />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">{barber.name}</div>
                              {editingId === barber.id && <div className="text-xs text-blue-600">قيد التعديل</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2">{barber.bio}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(barber)}
                              className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-100 transition"
                              title="تعديل"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(barber.id)}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-100 transition"
                              title="حذف"
                            >
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
