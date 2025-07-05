// components/sections/SupportedBySection.tsx
'use client';

import Image from 'next/image';

export default function SupportedBySection() {
  // Array partners hanya berisi 2 logo unik
  const partners = [
    { src: '/bii.png', alt: 'Bank Indonesia Logo', customWidth: 150, customHeight: 70 },
    { src: '/ojk.png', alt: 'Otoritas Jasa Keuangan (OJK) Logo', customWidth: 120, customHeight: 60 },
  ];

  // Duplikasi daftar partners untuk menciptakan efek looping yang mulus
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners];

  return (
    // Menambahkan shadow-lg pada section untuk efek pemisahan
    <section id = "supported-by" className="w-full py-12 bg-gray-50 text-center shadow-lg"> {/* Menambahkan shadow-lg di sini */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-12">
          Supported <span className='text-purple-600'>By</span>
        </h2>
        {/* Wrapper untuk efek scrolling */}
        <div className="relative w-full overflow-hidden py-4 group">
          {/* Container yang akan di-scroll */}
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
          {/* Overlay untuk efek fading di ujung */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* CSS Kustom untuk Animasi Scrolling */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-12.5%);
          }
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
