'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useInView } from '@/hooks/useInView'; // Impor hook useInView yang baru dibuat

export default function HeroSection() {
  // Gunakan useInView hook untuk mendeteksi apakah section terlihat
  const [sectionRef, isSectionInView] = useInView({
    threshold: 0.1, // Picu ketika 10% dari section terlihat
  });

  // Fungsi helper untuk mengaplikasikan kelas animasi berdasarkan isSectionInView
  const getAnimationClasses = (delay: number) =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-bottom duration-700 ease-out delay-${delay}`
      : 'opacity-0'; // Sembunyikan elemen jika belum terlihat

  // Fungsi helper untuk animasi gambar (slide-in-from-right)
  const getImageAnimationClasses = () =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-right duration-1000 delay-500 ease-out`
      : 'opacity-0'; // Sembunyikan gambar jika belum terlihat

  return (
    // Tambahkan ref ke section utama
    <section id= "hero" ref={sectionRef} className="w-full pt-16 pb-20 bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center md:justify-between gap-24">
        {/* Kolom Kiri: Tulisan dan Tombol */}
        <div className="md:w-1/2 text-left">
          {/* Judul Utama dengan Animasi */}
          <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight mb-2 ${getAnimationClasses(0)}`}>
            <span className="block text-gray-900">Smarter Finance for</span>
            <span className="block text-purple-600">Growing Businesses.</span>
          </h1>
          {/* Sub-judul dengan Animasi dan Delay */}
          <h2 className={`text-xl md:text-2xl font-semibold text-gray-700 mb-8 ${getAnimationClasses(100)}`}>
            Empowering Indonesia's UMKM.
          </h2>

          {/* Deskripsi dengan Animasi dan Delay */}
          <p className={`text-base md:text-lg text-gray-600 max-w-xl mb-8 leading-normal ${getAnimationClasses(200)}`}>
            Digi<span className="text-purple-700 font-semibold">UM</span> helps you <span className="font-semibold text-purple-700">streamline your finances</span>,
            <span className="font-semibold text-purple-700"> track growth</span>, and
            <span className="font-semibold text-purple-700"> connect with impact-driven investors</span>.
          </p>

          {/* Wadah untuk tombol-tombol aksi dengan Animasi dan Delay */}
          <div className={`flex justify-start mb-16 md:mb-0 ${getAnimationClasses(300)}`}>
            {/* Login Button (Outline Style) */}
            <Button
              size="lg"
              className="
                border border-purple-600
                text-purple-600 bg-white
                hover:bg-purple-600 hover:text-white
                px-10 py-6 rounded-xl shadow-md
                transition-all duration-200 ease-out
                hover:scale-105 hover:-translate-y-1 hover:shadow-xl
              "
              asChild
            >
              <Link href="/register">
                Get Started
              </Link>
            </Button>
          </div>
        </div>

        {/* Kolom Kanan: Gambar dengan Animasi */}
        <div className="md:w-1/2 mt-12 md:mt-0 md:ml-auto">
          <img
            src="/awal.png"
            alt="Dashboard Preview UMKMVerse"
            className={`mx-auto w-full max-w-full ${getImageAnimationClasses()}`}
          />
        </div>
      </div>
    </section>
  );
}
