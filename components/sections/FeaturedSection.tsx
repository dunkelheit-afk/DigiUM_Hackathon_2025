// components/sections/FeaturedSection.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart, BookUser, Cpu } from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
    { icon: Cpu, title: 'Analisis Cepat & Akurat', description: 'Manfaatkan AI untuk menganalisis data keuangan Anda dalam hitungan detik dan dapatkan status kesehatan bisnis yang jelas.' },
    { icon: BarChart, title: 'Visualisasi Data Intuitif', description: 'Lihat performa bisnis melalui grafik dan bagan yang mudah dibaca, dari margin laba hingga perputaran aset.' },
    { icon: BookUser, title: 'Rekomendasi Terpersonalisasi', description: 'Dapatkan saran konkret berbasis data untuk meningkatkan profitabilitas, efisiensi, dan pertumbuhan bisnis Anda.' },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  // PERBAIKAN: useInView dipanggil di level atas komponen
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.2 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} // Animate saat masuk ke view
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-purple-200/50 transition-shadow duration-300 border border-gray-100"
    >
      <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
        <feature.icon className="w-6 h-6" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.title}</h3>
      <p className="mt-2 text-gray-600">{feature.description}</p>
    </motion.div>
  );
};


export const FeaturedSection = () => {
    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Platform Lengkap untuk Pertumbuhan UMKM</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Dari analisis otomatis hingga pencatatan transaksi, semua yang Anda butuhkan dalam satu dasbor.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};