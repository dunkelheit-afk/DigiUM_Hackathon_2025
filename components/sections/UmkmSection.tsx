// components/sections/UmkmSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, Variants } from 'framer-motion';

// Menambahkan interface untuk tipe data yang jelas
interface FeaturedUmkm {
  name: string;
  tagline: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

export default function UmkmSection() {
  // Data UMKM dalam Bahasa Indonesia
  const featuredUmkms: FeaturedUmkm[] = [
    {
      name: "Kopi Nusantara",
      tagline: "Cita Rasa Kopi Tradisional Premium",
      description: "Menghadirkan biji kopi pilihan dari berbagai pelosok Indonesia, diolah dengan metode tradisional untuk rasa otentik dan aroma yang memikat.",
      image: "/kopi.jpg",
      alt: "Produk Kopi Nusantara",
      link: "#",
    },
    {
      name: "Batik Indah",
      tagline: "Warisan Budaya dengan Sentuhan Modern",
      description: "Koleksi batik tulis dan cap dengan desain kontemporer yang tetap mempertahankan keindahan dan filosofi tradisional Indonesia.",
      image: "/batik.jpg",
      alt: "Produk Batik Indah",
      link: "#",
    },
    {
      name: "Keripik Jaya",
      tagline: "Camilan Renyah Penuh Inovasi Rasa",
      description: "Berbagai varian camilan renyah dari bahan alami pilihan, dengan inovasi rasa unik yang siap menggugah selera Anda.",
      image: "/kripik.jpg",
      alt: "Produk Keripik Jaya",
      link: "#",
    },
  ];

  // Varian animasi untuk container (grid) dan item (kartu)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Memberi jeda animasi antar kartu
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // PERBAIKAN: Menggunakan cubic-bezier array untuk 'easeOut'
      },
    },
  };

  return (
    <section id="umkm-showcase" className="w-full py-20 my-24 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 space-y-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={cardVariants} // Menggunakan varian yang sama dengan kartu
          viewport={{ once: true, amount: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Showcase <span className="text-[#8F87F1]">UMKM Unggulan</span>
          </h2>
        </motion.div>

        {/* Container animasi untuk grid kartu */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20"
        >
          {featuredUmkms.map((umkm, index) => (
            // Setiap kartu sekarang memiliki animasi munculnya sendiri
            <motion.div key={index} variants={cardVariants}>
              <Card
                className="
                  h-full bg-gray-300/20 backdrop-blur-lg border border-white/30
                  rounded-2xl shadow-2xl
                  transition-all duration-300 ease-out
                  hover:scale-[1.03] hover:-translate-y-2 hover:shadow-fuchsia-400/20
                  will-change-transform will-change-shadow
                  hover:border-white/50
                "
              >
                <CardHeader className="p-0 mb-4">
                  <Link href={umkm.link} className="block relative h-48 w-full overflow-hidden rounded-t-2xl group">
                    <Image
                      src={umkm.image}
                      alt={umkm.alt}
                      fill
                      quality={100}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#8F87F1] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </Link>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {umkm.name}
                  </CardTitle>
                  <p className="text-[#8F87F1] font-semibold text-base mb-3">
                    {umkm.tagline}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {umkm.description}
                  </p>
                  <Link href={umkm.link} className="mt-4 inline-block text-[#8F87F1] hover:text-[#C68EFD] font-semibold transition-colors duration-200">
                    Lihat Detail &rarr;
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
