'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GiScissors } from 'react-icons/gi';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="home"
      className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100"
    >
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={itemVariants}>
            <GiScissors className="mx-auto text-5xl text-primary-600 mb-6" />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            <span className="text-primary-600">Trim</span>Style
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mb-8"
          >
            خبرة تفوق العقد في تقديم أفضل خدمات الحلاقة والتزيين للرجال، حيث الجودة والأناقة تلتقيان.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md transition-colors text-lg"
            >
              احجز الآن
            </Link>
            <Link
              href="/booking/check"
              className="border border-primary-600 text-primary-600 hover:bg-blue-50 px-6 py-3 rounded-md transition-colors text-lg"
            >
              تفاصيل الحجز السابق
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;