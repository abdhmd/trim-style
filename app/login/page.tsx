'use client';

import { useState, useContext, useEffect } from 'react';
import { FaLock, FaSignInAlt } from 'react-icons/fa';
import { GiScissors } from 'react-icons/gi';
import { ThemeContext } from '@/app/context/ThemeContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }
  const { theme: selectedTheme } = context;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
  
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'فشل تسجيل الدخول');
        setIsLoading(false);
        return;
      }
  
      // استبدال router.push بـ window.location للتأكد من أن الإعادة التوجيه تعمل
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      setError('خطأ في الاتصال بالخادم');
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return <div>جاري التحميل...</div>; // عرض placeholder بدلاً من null
  }

  return (
    <div
      dir="rtl"
      data-theme={selectedTheme}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-6"
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      {/* Logo Section */}
      <div className="mb-8 flex items-center gap-2">
        <GiScissors className="text-4xl text-primary-600" />
        <span className="text-3xl font-bold text-gray-800">TrimStyle</span>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center">
            <FaSignInAlt className="text-primary-600" /> تسجيل الدخول
          </h2>
          <p className="text-gray-500 mt-1">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
            <div className="relative">
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <FaLock />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري التحميل...
              </>
            ) : (
              <>
                <FaLock /> دخول
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TrimStyle. جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
}