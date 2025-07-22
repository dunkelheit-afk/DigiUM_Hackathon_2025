// components/sections/HeroSection.tsx
'use client';
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export const HeroSection = () => {
  // ▼▼▼ Menambahkan hook untuk animasi scroll ▼▼▼
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"] // Lacak scroll dari saat bagian atas section bertemu bagian atas viewport
  });

  // Mengubah progress scroll menjadi nilai pergerakan (parallax)
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    // Menambahkan ref dan id pada section
    <section ref={sectionRef} id="hero" className="relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-9 items-center pt-24 lg:pt-32 lg:pb-32">
          
          {/* Kolom Kiri dengan animasi parallax */}
          <motion.div
            style={{ y: yText }} // Terapkan pergerakan vertikal
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Analisis Keuangan <span className="text-[#8F87F1]">Instan</span> untuk UMKM Anda
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Dapatkan wawasan mendalam tentang kesehatan finansial bisnis Anda dengan satu klik. Ubah data mentah menjadi keputusan strategis.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#8F87F1] text-white hover:bg-[#C68EFD] shadow-lg w-full sm:w-auto transition-colors duration-300">
                  Mulai Analisis Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-[#8F87F1] border-[#C68EFD] hover:bg-[#8F87F1] hover:text-white w-full sm:w-auto transition-colors duration-300">
                  Pelajari Fitur
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                <Image className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="/images/avatars/budi.jpg" alt="Pengguna Budi" width={40} height={40} />
                <Image className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="/images/avatars/siti.jpg" alt="Pengguna Siti" width={40} height={40} />
                <Image className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="/images/avatars/eko.jpg" alt="Pengguna Eko" width={40} height={40} />
              </div>
              <div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-sm text-gray-600 font-medium">Dipercaya oleh 1,000+ UMKM di seluruh Indonesia</p>
              </div>
            </div>
          </motion.div>

          {/* Kolom Kanan dengan animasi parallax */}
          <motion.div
            style={{ y: yImage }} // Terapkan pergerakan vertikal
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Image
              src="/awal.png"
              alt="Pratinjau Dashboard Analisis Keuangan"
              width={1200}
              height={800}
              className="rounded-xl drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
