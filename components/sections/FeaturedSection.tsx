// components/sections/FeaturedSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { BookCheck, Bot, Store } from 'lucide-react';

// Mendefinisikan tipe data untuk setiap fitur
interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  image: string;
}

// Data untuk tiga fitur utama Anda
const features: Feature[] = [
  {
    icon: BookCheck,
    title: "Pembukuan Digital",
    description: "Catat setiap pemasukan dan pengeluaran dengan antarmuka yang intuitif. Lupakan kerumitan pencatatan manual dan dapatkan laporan laba rugi otomatis.",
    image: "/fitur-pembukuan.png",
  },
  {
    icon: Bot,
    title: "Analisis Performa Bisnis",
    description: "Manfaatkan kekuatan machine learning untuk memahami kesehatan finansial bisnis Anda. Dapatkan rekomendasi strategis untuk meningkatkan profitabilitas.",
    image: "/fitur-analisis.png",
  },
  {
    icon: Store,
    title: "UMKM Showcase",
    description: "Tingkatkan visibilitas bisnis Anda dengan menampilkannya di platform kami. Jangkau pelanggan baru dan bangun citra merek yang kuat.",
    image: "/fitur-showcase.png",
  },
];

const StaticPerspectiveImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center [perspective:1000px]">
      <div className="transition-transform duration-500 drop-shadow-lg shadow-purple-300 ease-out [transform-style:preserve-3d] hover:[transform:rotateY(-10deg)_rotateX(5deg)] [transform:rotateY(-20deg)_rotateX(10deg)]">
        <Image
          src={src}
          alt={alt}
          width={1000} 
          height={700}
          quality={100}
          priority
          className="rounded-2xl object-contain [filter:drop-shadow(0_30px_35px_rgba(143,135,241,0.25))]"
        />
      </div>
    </div>
  );
};

export const FeaturedSection = () => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  return (
    <section id="features" className="w-full py-20 my-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Platform Lengkap untuk <span className="text-[#8F87F1]">Pertumbuhan UMKM</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Dari analisis otomatis hingga pencatatan transaksi, semua yang Anda butuhkan untuk membawa bisnis Anda ke level selanjutnya ada di sini.
          </p>
        </div>

        <div className="relative lg:h-[450px]">
          
          <div className="relative z-10 lg:w-1/2">
            <div className="flex flex-col">
              {features.map((feature, index) => {
                const isActive = activeFeatureIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => setActiveFeatureIndex(index)}
                    className={`cursor-pointer p-6 transition-all duration-300 ${isActive ? 'bg-white/50 backdrop-blur-sm border-2 border-[#8F87F1] rounded-2xl' : 'border-b border-gray-200/70'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? 'bg-[#8F87F1]' : 'bg-gray-200'}`}>
                        <feature.icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <h3 className={`text-xl font-bold transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{feature.title}</h3>
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="text-gray-600"
                        >
                          {feature.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-7/12">
            <StaticPerspectiveImage
              src={features[activeFeatureIndex].image}
              alt={features[activeFeatureIndex].title}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
