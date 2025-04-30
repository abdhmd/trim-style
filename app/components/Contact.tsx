'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useEffect, useState } from 'react';

interface ContactData {
  id: number;
  address: string;
  phone: string;
  hours: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
}

const ContactSection = () => {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contact data on component mount
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch('/api/contact/1'); // Assuming you have a contact with ID 1
        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }
        const data = await response.json();
        setContact(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (isLoading) {
    return (
      <section id="contact" className="w-full py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">Loading contact information...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="contact" className="w-full py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-red-500">{error}</div>
      </section>
    );
  }

  if (!contact) {
    return (
      <section id="contact" className="w-full py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">No contact information found</div>
      </section>
    );
  }

  return (
    <section id="contact" className="w-full py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نرحب بأسئلتك واستفساراتك. فريقنا جاهز لمساعدتك في أي وقت
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center gap-2">
                <span className="p-2 bg-primary-100 text-primary-600 rounded-full">
                  <FaPhoneAlt className="text-lg" />
                </span>
                معلومات التواصل
              </h3>

              <div className="space-y-8">
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full mt-1">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 mb-1 block">العنوان</span>
                    <p className="text-gray-800 text-lg">{contact.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-green-100 text-green-600 rounded-full mt-1">
                    <FaPhoneAlt className="text-lg" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 mb-1 block">الهاتف</span>
                    <a href={`tel:${contact.phone}`} className="text-primary-600 hover:text-primary-700 text-lg transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-full mt-1">
                    <FaClock className="text-lg" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 mb-1 block">ساعات العمل</span>
                    <p className="text-gray-800 text-lg">{contact.hours}</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-6 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                    وسائل التواصل الاجتماعي
                  </span>
                  <div className="flex gap-3">
                    {[
                      { 
                        name: 'فيسبوك', 
                        icon: <FaFacebookF />, 
                        url: contact.facebook || '#', 
                        bg: 'bg-blue-600 hover:bg-blue-700' 
                      },
                      { 
                        name: 'إنستغرام', 
                        icon: <FaInstagram />, 
                        url: contact.instagram || '#', 
                        bg: 'bg-pink-600 hover:bg-pink-700' 
                      },
                      { 
                        name: 'واتساب', 
                        icon: <FaWhatsapp />, 
                        url: contact.whatsapp || '#', 
                        bg: 'bg-green-600 hover:bg-green-700' 
                      }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className={`${social.bg} text-white p-3 rounded-full transition-colors flex items-center justify-center`}
                        aria-label={social.name}
                        title={social.name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.icon}
                        <span className="sr-only">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2 h-full"
          >
            <div className="bg-white p-1 rounded-xl shadow-md border border-gray-100 h-full">
              <div className="relative h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.783213142056!2d46.67227631500289!3d24.8138375840766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee3b9b8b8b8b9%3A0x3e2ee3b9b8b8b8b9!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  className="min-h-[400px] rounded-lg"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
                <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md">
                  <FaMapMarkerAlt className="text-red-500 text-xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;