// components/sections/PricingSection.tsx
'use client';

import React from 'react';
import { useInView } from '@/hooks/useInView';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingPlan {
  title: string;
  description: string;
  price: string;
  period: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  cardBgClass: string; 
  titleColorClass: string;
  buttonClass: string;
  isFeatured?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    title: "Free",
    description: "Untuk UMKM yang baru memulai",
    price: "Rp 0",
    period: "/bulan",
    features: [
      { text: "Pembukuan Digital Dasar", included: true },
      { text: "Laporan Laba/Rugi Sederhana", included: true },
      { text: "Skor Kredit Dasar (Internal)", included: true },
      { text: "Dasbor Analitik", included: false },
      { text: "Analisis AI Perkembangan Usaha", included: false },
    ],
    buttonText: "Mulai Gratis",
    cardBgClass: "bg-[#F1F0FF]", 
    titleColorClass: "text-[#8F87F1]",
    buttonClass: "bg-white text-[#8F87F1] hover:bg-gray-100",
  },
  {
    title: "Premium",
    description: "Untuk UMKM & Investor bertumbuh",
    price: "Rp 50K",
    period: "/bulan",
    features: [
      { text: "Semua fitur di paket Free", included: true },
      { text: "Laporan Lengkap & Analisis AI", included: true },
      { text: "Skor Kredit Detail & Historis", included: true },
      { text: "Dasbor Analitik & Penyaringan Investor", included: true },
      { text: "Akses API & Integrasi Sistem", included: false },
    ],
    buttonText: "Pilih Premium",
    cardBgClass: "bg-[#F8F1FF]", 
    titleColorClass: "text-[#C68EFD]",
    buttonClass: "bg-[#C68EFD] text-white hover:bg-[#b37ee8]",
    isFeatured: true,
  },
  {
    title: "Enterprise",
    description: "Untuk Lembaga Keuangan & Koperasi",
    price: "Kustom",
    period: "",
    features: [
      { text: "Semua fitur di paket Premium", included: true },
      { text: "Akses API ke Data Skor Kredit", included: true },
      { text: "Dasbor Manajemen Portofolio", included: true },
      { text: "Integrasi dengan Sistem Internal", included: true },
      { text: "Manajer Akun & Dukungan Teknis", included: true },
    ],
    buttonText: "Hubungi Kami",
    cardBgClass: "bg-[#FFF0F5]", 
    titleColorClass: "text-[#E9A5F1]",
    buttonClass: "bg-white text-[#E9A5F1] hover:bg-gray-100",
  },
];

const PricingCard = ({ plan, animationClasses }: { plan: PricingPlan; animationClasses: string; }) => {
  return (
    <div
      className={`
        transition-transform duration-300 ease-out
        hover:-translate-y-2
        ${plan.isFeatured ? 'transform scale-105' : ''}
        ${animationClasses}
      `}
    >

      <div className={`
        relative flex flex-col h-full rounded-2xl px-8 pt-8 pb-12 
        ${plan.cardBgClass}
        transition-all duration-300
        [filter:drop-shadow(0_8px_10px_rgba(0,0,0,0.07))] 
        hover:[filter:drop-shadow(0px_10px_20px_rgba(143,135,241,0.2))]
      `}>
        {plan.isFeatured && (
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[#C68EFD] text-white text-xs font-bold px-4 py-1 rounded-full">
            Paling Populer
          </div>
        )}
        <h3 className={`text-2xl font-bold ${plan.titleColorClass}`}>{plan.title}</h3>
        <p className="text-gray-600 mt-2 h-12">{plan.description}</p>
        <div className="my-8">
          <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
          <span className="text-gray-500">{plan.period}</span>
        </div>
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, fIndex) => (
            <li key={fIndex} className="flex items-center gap-3">
              {feature.included ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className={!feature.included ? 'text-gray-400 line-through' : 'text-gray-700'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Button className={`w-full shadow-md ${plan.buttonClass}`}>
            {plan.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};


export default function PricingSection() {
  const [sectionRef, isSectionInView] = useInView({ threshold: 0.1 });

  const getAnimationClasses = (delay: number) =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-bottom duration-700 ease-out delay-${delay}`
      : 'opacity-0';

  return (
    // Menghapus padding vertikal (py-20)
    <section id="pricing" ref={sectionRef} className="w-full my-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          Paket Harga yang <span className="text-[#8F87F1]">Fleksibel</span>
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto mb-16">
          Pilih paket yang paling sesuai dengan skala dan kebutuhan bisnis Anda saat ini.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              animationClasses={getAnimationClasses(index * 150)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
