// components/sections/SupportedBySection.tsx
'use client';

import Image from 'next/image';

export default function SupportedBySection() {
  const partners = [
    { src: '/bii.png', alt: 'Bank Indonesia Logo', customWidth: 150, customHeight: 70 },
    { src: '/ojk.png', alt: 'Otoritas Jasa Keuangan (OJK) Logo', customWidth: 120, customHeight: 60 },
  ];

  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners];

  return (
    // Anda bisa menghapus shadow-lg jika ingin menyatu sepenuhnya atau membiarkannya untuk efek lapisan
    <section id="supported-by" className="w-full py-12 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-12">
          Supported <span className='text-purple-600'>By</span>
        </h2>
        <div className="relative w-full overflow-hidden py-4 group">
          <div className="flex w-max animate-scroll-left group-hover:paused">
            {duplicatedPartners.map((partner, index) => (
              <div key={index} className="flex-shrink-0 flex items-center justify-center h-20 w-32 mx-6 grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.customWidth || 120}
                  height={partner.customHeight || 60}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            ))}
          </div>
          {/* ▼▼▼ KEDUA DIV DI BAWAH INI TELAH DIHAPUS ▼▼▼ */}
          {/* <div className="absolute inset-y-0 left-0 ..."></div> */}
          {/* <div className="absolute inset-y-0 right-0 ..."></div> */}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-12.5%); }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .group-hover\\:paused:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}