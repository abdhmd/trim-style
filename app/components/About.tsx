'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUserTie, FaRegStar } from 'react-icons/fa';
import { GiRazor } from 'react-icons/gi';

// Define the Barber interface
interface Barber {
  id: string;
  name: string;
  bio: string;
}

const AboutSection = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await fetch('/api/barbers');
        if (response.ok) {
          const data = await response.json();
          setBarbers(data);
        } else {
          setError('Failed to fetch barbers. Please try again later.');
        }
      } catch {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-8 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="about" className="w-full py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">عن متجرنا</h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            TrimStyle - حيث تلتقي الحرفة التقليدية بالأناقة الحديثة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full h-full"
          >
            <div className="bg-primary-50 p-8 rounded-xl flex h-full items-center justify-center">
              <GiRazor className="text-6xl text-primary-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaAward className="text-primary-600" />
              قصتنا ورسالتنا
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              منذ تأسيسنا عام 2010، كنا نهدف إلى إعادة تعريف تجربة الحلاقة الرجالية من خلال الجمع بين الحرفية الموروثة وأحدث تقنيات العناية بالشعر.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-full mt-1">
                  <FaUserTie className="text-lg" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">خبراء في مجالهم</h4>
                  <p className="text-gray-600">فريقنا من الحلاقين المحترفين يخضع لتدريب مستمر لضمان أعلى معايير الجودة.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-full mt-1">
                  <FaRegStar className="text-lg" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">منتجات مميزة</h4>
                  <p className="text-gray-600">نستخدم فقط المنتجات العالمية المختارة بعناية لضمان راحة وصحة عملائنا.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">فريق الخبراء لدينا</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">تعرف على الحرفيين الذين يجعلون تجربتك استثنائية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barbers.map((barber, index) => (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center"
              >
                <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUserTie className="text-2xl text-primary-600" />
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-2">{barber.name}</h4>
                <p className="text-gray-600 mb-4">{barber.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;