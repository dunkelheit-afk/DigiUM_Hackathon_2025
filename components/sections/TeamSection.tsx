// components/sections/TeamSection.tsx
'use client';

import Image from 'next/image';
import { useInView } from '@/hooks/useInView'; // Impor hook useInView

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Adam Monhardi",
      role: "Front-end Engineer",
      jobDescription: "Crafting intuitive user interfaces and ensuring seamless user experiences.",
      image: "/adams.GIF", // Ganti dengan path GIF Adam di public/adams.GIF
      alt: "Adam Monhardi - Front-end Engineer",
    },
    {
      name: "Arsyad Fatturahman",
      role: "Backend Engineer",
      jobDescription: "Building robust server-side logic and managing database systems for optimal performance.",
      image: "/cabul.GIF", // Ganti dengan path GIF Arsyad di public/cabul.GIF
      alt: "Arsyad Fatturahman - Backend Engineer",
    },
    {
      name: "Ariq Faishal Hanif",
      role: "AI/ML Engineer",
      jobDescription: "Developing intelligent algorithms and machine learning models for data analysis and insights.",
      image: "/dodo.GIF", // Ganti dengan path GIF Ariq di public/dodo.GIF
      alt: "Ariq Faishal Hanif - AI/ML Engineer",
    },
  ];

  const [sectionRef, isSectionInView] = useInView({ threshold: 0.1 }); // Observer untuk seluruh section

  // Fungsi helper untuk kelas animasi
  const getAnimationClasses = (delay: number) =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-bottom duration-700 ease-out delay-${delay}`
      : 'opacity-0';

  return (
    <section id = "team" ref={sectionRef} className="w-full py-20 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">
          Meet Our <span className="text-purple-600">Team</span>
        </h2>

        {/* Mengatur grid agar hanya 3 kolom di desktop jika hanya ada 3 anggota */}
        {/* Mengubah gap dari gap-8 menjadi gap-12 untuk jarak antar board yang lebih besar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-6 rounded-lg bg-gray-50
                          transition-all duration-300 ease-out
                          hover:scale-[1.04] hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-gray-50 {/* Menyesuaikan scale, translateY, dan shadow untuk efek timbul yang lebih modern */}
                          will-change-transform will-change-shadow will-change-filter
                          ${getAnimationClasses(index * 100)}`} // Animasi dengan delay berurutan
            >
              <Image
                src={member.image}
                alt={member.alt}
                width={150}
                height={150}
                className="rounded-full mb-4 object-cover border-4 border-purple-300 h-auto" // Menambahkan h-auto untuk konsistensi gambar
                unoptimized={true} // PENTING: Tambahkan ini untuk GIF
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-purple-600 font-semibold mb-2">{member.role}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{member.jobDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
