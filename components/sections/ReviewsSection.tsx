// components/sections/ReviewsSection.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Impor komponen Card dari shadcn/ui
import { useInView } from '@/hooks/useInView'; // Impor hook useInView
import { Star } from 'lucide-react'; // Impor ikon bintang dari lucide-react

export default function ReviewsSection() {
  // Hanya 3 ulasan yang ditampilkan
  const reviews = [
    {
      quote: "DigiUM benar-benar mengubah cara kami mengelola keuangan. Pembukuan jadi lebih rapi dan laporan mudah diakses. Sangat membantu UMKM seperti kami!",
      author: "Budi Santoso",
      umkm: "Kopi Nusantara",
      rating: 5,
    },
    {
      quote: "Fitur showcase produknya luar biasa! Kami berhasil menjangkau pasar baru dan meningkatkan penjualan setelah bergabung dengan DigiUM. Terima kasih!",
      author: "Siti Aminah",
      umkm: "Batik Cantik",
      rating: 5,
    },
    {
    quote: "Akses pendanaan yang ditawarkan DigiUM sangat transparan dan cepat. Kami mendapatkan modal yang dibutuhkan untuk mengembangkan usaha. Rekomendasi sekali!",
      author: "Joko Susilo",
      umkm: "Keripik Jaya",
      rating: 4,
    },
  ];

  const [sectionRef, isSectionInView] = useInView({ threshold: 0.1 }); // Observer untuk seluruh section

  const getCardAnimationClasses = (delay: number) =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-bottom duration-700 ease-out delay-${delay}`
      : 'opacity-0';

  const getTextAnimationClasses = (baseDelay: number, staggerDelay: number) =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-bottom duration-500 ease-out delay-${baseDelay + staggerDelay}`
      : 'opacity-0';

  return (
    <section id = "reviews" ref={sectionRef} className="w-full py-24 bg-white text-gray-900 shadow-xl"> {/* py-32 diubah menjadi py-24 */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Judul diubah ke Bahasa Inggris */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">
          What Our <span className="text-purple-600">MSMEs Say?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className={`
                shadow-lg
                transition-all duration-300 ease-out
                hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl
                will-change-transform will-change-shadow
                hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-white
                ${getCardAnimationClasses(index * 100)}
              `}
            >
              <CardHeader>
                <div className={`flex items-center mb-2 ${getTextAnimationClasses(index * 100, 0)}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <CardTitle className={`text-lg font-semibold text-gray-800 ${getTextAnimationClasses(index * 100, 50)}`}>
                  "{review.quote}" {/* Kutipan tetap dalam Bahasa Indonesia */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm text-gray-700 font-medium mt-4 ${getTextAnimationClasses(index * 100, 100)}`}>
                  - {review.author}
                </p>
                <p className={`text-xs text-gray-500 ${getTextAnimationClasses(index * 100, 150)}`}>
                  {review.umkm}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
