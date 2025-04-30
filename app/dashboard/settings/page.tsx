'use client';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/app/context/ThemeContext';
import { FaCog, FaPalette, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

interface Theme {
  name: string;
  value: string;
  color: string;
}

const themes: Theme[] = [
  { name: 'أزرق', value: 'blue', color: '#0ea5e9' },
  { name: 'أخضر', value: 'green', color: '#22c55e' },
  { name: 'بنفسجي', value: 'purple', color: '#8b5cf6' },
  { name: 'أحمر', value: 'red', color: '#ef4444' },
  { name: 'برتقالي', value: 'orange', color: '#f97316' },
  { name: 'وردي', value: 'pink', color: '#ec4899' },
  { name: 'ذهبي', value: 'gold', color: '#facc15' },
  { name: 'رمادي', value: 'gray', color: '#6b7280' },
  { name: 'بني', value: 'brown', color: '#78350f' },
];

interface Contact {
  id: number;
  address: string;
  phone: string;
  hours: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [contact, setContact] = useState<Contact>({
    id: 1,
    address: '',
    phone: '',
    hours: '',
    facebook: '',
    instagram: '',
    whatsapp: ''
  });
  const [contactError, setContactError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(ThemeContext) as ThemeContextType;
  if (!context) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }
  const { theme: selectedTheme, setTheme: setSelectedTheme } = context;

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('/api/contact/1');
        if (res.ok) {
          const data = await res.json();
          setContact(data);
        }
      } catch (err) {
        console.error('Failed to fetch contact:', err);
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('جميع الحقول مطلوبة');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمة السر الجديدة وإعادة كلمة السر غير متطابقتين');
      return;
    }
    setError('');

    const payload = { oldPassword, newPassword, username: 'admin' };

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('تم تغيير كلمة السر، سجل الدخول مجددًا');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.push('/login');
      } else {
        const text = await res.text();
        let data: { error?: string } = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error('استجابة الخادم غير صالحة');
        }
        setError(data.error || `حدث خطأ (رمز الحالة: ${res.status})`);
      }
    } catch (err) {
      setError((err as Error).message || 'حدث خطأ أثناء تغيير كلمة السر');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactError('');
    setIsLoading(true);

    if (!contact.address || !contact.phone || !contact.hours) {
      setContactError('العنوان، الهاتف، وساعات العمل مطلوبة');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      if (res.ok) {
        alert('تم تحديث معلومات الاتصال بنجاح');
      } else {
        const text = await res.text();
        let data: { error?: string } = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error('استجابة الخادم غير صالحة');
        }
        setContactError(data.error || `حدث خطأ (رمز الحالة: ${res.status})`);
      }
    } catch (err) {
      setContactError((err as Error).message || 'حدث خطأ أثناء تحديث معلومات الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  // ⚡ إضافة className ديناميكي حسب اللون المختار
  const themeColor = themes.find(t => t.value === selectedTheme)?.color || '#0ea5e9';

  return (
    <div className="p-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaCog /> إعدادات النظام
          </h1>
          <p className="text-gray-500 text-sm mt-1">تخصيص مظهر النظام وإدارة إعدادات الأمان</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Theme Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaPalette /> اختيار الثيم
            </h2>
            <div className="space-y-3">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition ${selectedTheme === theme.value
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                  </div>
                  {selectedTheme === theme.value && (
                    <span style={{ color: theme.color }} className="text-xs">مُختار</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaLock /> تغيير كلمة السر
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <input
                type="password"
                placeholder="كلمة السر القديمة"
                className="w-full p-2.5 border rounded-lg"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="كلمة السر الجديدة"
                className="w-full p-2.5 border rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="إعادة كلمة السر الجديدة"
                className="w-full p-2.5 border rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition"
                style={{ backgroundColor: themeColor, color: '#fff' }}
              >
                <FaLock /> تغيير كلمة السر
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt /> معلومات الاتصال
            </h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactError && <p className="text-red-500 text-sm">{contactError}</p>}

              <textarea
                name="address"
                placeholder="عنوان المتجر"
                className="w-full p-2.5 border rounded-lg"
                value={contact.address}
                onChange={handleContactChange}
                rows={3}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="رقم الهاتف"
                className="w-full p-2.5 border rounded-lg"
                value={contact.phone}
                onChange={handleContactChange}
                required
              />
              <input
                type="text"
                name="hours"
                placeholder="ساعات العمل"
                className="w-full p-2.5 border rounded-lg"
                value={contact.hours}
                onChange={handleContactChange}
                required
              />

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="url"
                  name="facebook"
                  placeholder="رابط فيسبوك"
                  className="w-full p-2.5 border rounded-lg"
                  value={contact.facebook || ''}
                  onChange={handleContactChange}
                />
                <input
                  type="url"
                  name="instagram"
                  placeholder="رابط إنستغرام"
                  className="w-full p-2.5 border rounded-lg"
                  value={contact.instagram || ''}
                  onChange={handleContactChange}
                />
                <input
                  type="url"
                  name="whatsapp"
                  placeholder="رابط واتساب"
                  className="w-full p-2.5 border rounded-lg"
                  value={contact.whatsapp || ''}
                  onChange={handleContactChange}
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition"
                disabled={isLoading}
                style={{ backgroundColor: themeColor, color: '#fff' }}
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
