// components/sections/ReviewsSection.tsx
'use client';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image"; // Impor komponen Image

interface Review {
  name: string;
  role: string;
  avatar: string;
  comment: string;
}

const reviews: Review[] = [
  // ... (data reviews tetap sama)
];

export const ReviewsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Apa Kata Para Pengguna Kami?
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Dengarkan cerita sukses dari para pemilik UMKM yang telah merasakan manfaat dari platform kami.
        </p>
        <div className="mt-12">
          <Carousel
            opts={{ align: "start", loop: true, }}
            plugins={[ Autoplay({ delay: 5000, }), ]}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <Card className="h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      {/* PERBAIKAN: " diganti menjadi &quot; */}
                      <p className="text-gray-700 italic">&quot;{review.comment}&quot;</p>
                    </CardContent>
                    <div className="p-6 bg-gray-50 flex items-center gap-4">
                      {/* PERBAIKAN: <img> diganti dengan <Image> */}
                      <Image
                        src={review.avatar}
                        alt={`Avatar of ${review.name}`}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <p className="text-sm text-gray-500">{review.role}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};