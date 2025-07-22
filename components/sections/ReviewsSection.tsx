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
import Image from "next/image";

interface Review {
  name: string;
  role: string;
  avatar: string;
  comment: string;
}

// Data reviews dari kode Anda
const reviews: Review[] = [
    { name: "Dimas", role: "Pemilik Coffee Nusantara", avatar: "/adams.gif", comment: "Alat analisis ini mengubah cara saya melihat bisnis. Laporan keuangannya sangat mudah dipahami dan membantu saya mengambil keputusan yang lebih cerdas!" },
    { name: "Januario", role: "Pengrajin Beautiful Batik", avatar: "/cabul.gif", comment: "Awalnya saya ragu, tapi platform ini benar-benar game-changer. Saya sekarang bisa melihat margin keuntungan setiap produk dengan jelas." },
    { name: "Farhan", role: "Founder Jaya Crisps", avatar: "/adams.gif", comment: "Sangat direkomendasikan untuk UMKM! Tidak perlu lagi pusing dengan spreadsheet yang rumit. Semuanya otomatis dan akurat." },
    { name: "Falih", role: "Owner Toko Kelontong", avatar: "/cabul.gif", comment: "Fitur prediksi penjualannya luar biasa. Membantu saya mengatur stok barang dengan lebih efisien. Terima kasih!" },
    { name: "Baud", role: "Penyedia Jasa Katering", avatar: "/adams.gif", comment: "Saya bisa fokus pada kualitas masakan karena urusan finansial sudah di-handle oleh platform ini. Sangat membantu!" },
];

export const ReviewsSection = () => {
  return (
    <section id="testimonials" className="w-full py-20 my-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Apa Kata Para <span className="text-[#8F87F1]">Pengguna Kami?</span>
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Dengarkan cerita sukses dari para pemilik UMKM yang telah merasakan manfaat dari platform kami.
        </p>
        <div className="mt-12">
          <Carousel
            opts={{ align: "start", loop: true, }}
            plugins={[ Autoplay({ delay: 5000, stopOnInteraction: false }), ]}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <Card className="h-full flex flex-col justify-between bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl transition-all duration-300 [filter:drop-shadow(0_8px_10px_rgba(0,0,0,0.1))] hover:[filter:drop-shadow(0_10px_15px_rgba(143,135,241,0.2))] hover:-translate-y-1">
                    <CardContent className="p-6">
                      <p className="text-gray-800 italic">&quot;{review.comment}&quot;</p>
                    </CardContent>
                    <div className="p-6 flex items-center gap-4 border-t border-white/30">
                      <Image
                        src={review.avatar}
                        alt={`Avatar of ${review.name}`}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <p className="text-sm text-gray-600">{review.role}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex bg-[#8F87F1]/50 hover:bg-[#8F87F1] text-white border-none" />
            <CarouselNext className="hidden sm:flex bg-[#8F87F1]/50 hover:bg-[#8F87F1] text-white border-none" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
