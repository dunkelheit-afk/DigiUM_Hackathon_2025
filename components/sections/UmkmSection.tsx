// components/sections/UmkmSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UmkmSection() {
  const featuredUmkms = [
    {
      name: "Coffee Nusantara",
      tagline: "Premium Traditional Coffee Flavor",
      description: "Presenting selected coffee beans from various parts of Indonesia, processed with traditional methods for an authentic taste and captivating aroma.",
      image: "/kopi.jpg",
      alt: "Coffee Nusantara Product",
      link: "#",
    },
    {
      name: "Beautiful Batik",
      tagline: "Cultural Heritage with a Modern Touch",
      description: "A collection of hand-drawn and stamped batik with contemporary designs that retain the traditional beauty and philosophy of Indonesia.",
      image: "/batik.jpg",
      alt: "Beautiful Batik Product",
      link: "#",
    },
    {
      name: "Jaya Crisps",
      tagline: "Crispy Snacks Full of Flavor Innovation",
      description: "Various variants of crispy snacks made from selected natural ingredients, with unique flavor innovations ready to tantalize your taste buds.",
      image: "/kripik.jpg",
      alt: "Jaya Crisps Product",
      link: "#",
    },
  ];

  const [sectionRef, isSectionInView] = useInView({ threshold: 0.1 });

  const getAnimationClasses = (delay: number) =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-bottom duration-700 ease-out delay-${delay}`
      : 'opacity-0';

  return (
    <section id="umkm-showcase" ref={sectionRef} className="w-full py-20 bg-white text-gray-900 shadow-xl">
      <div className="max-w-6xl mx-auto px-6 space-y-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">
          Showcase <span className="text-purple-600">Top MSMEs</span>
        </h2>

        {/* Mengubah grid-cols-1 menjadi grid-cols-3 agar selalu berjejer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Adjusted grid-cols-1 to sm:grid-cols-2 */}
          {featuredUmkms.map((umkm, index) => (
            <Card
              key={index}
              className={`
                shadow-lg
                transition-all duration-300 ease-out
                hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl
                will-change-transform will-change-shadow
                hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-white
                ${getAnimationClasses(index * 100)}
              `}
            >
              <CardHeader className="p-0 mb-4">
                <Link href={umkm.link} className="block relative h-24 w-full overflow-hidden rounded-t-lg group">
                  <Image
                    src={umkm.image}
                    alt={umkm.alt}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-purple-600 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </Link>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {umkm.name}
                </CardTitle>
                <p className="text-purple-600 font-semibold text-base mb-3">
                  {umkm.tagline}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {umkm.description}
                </p>
                <Link href={umkm.link} className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200">
                  View Details &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
