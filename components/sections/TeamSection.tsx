// components/sections/TeamSection.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import { animate } from 'framer-motion';

const cn = (...inputs: (string | boolean | undefined | null)[]) => {
  return inputs.filter(Boolean).join(' ');
};

interface TeamMember {
  name: string;
  role: string;
  jobDescription: string;
  image: string;
  alt: string;
}

const TeamMemberCard = ({ member, animationClasses }: { member: TeamMember; animationClasses: string; }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    if (isHovered) {
      element.style.setProperty("--active", "1");

      const controls = animate(0, 360, {
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          onUpdate: (latestValue) => {
            element.style.setProperty("--start", String(latestValue));
          }
        }
      );

      return () => {
        controls.stop();
      };
    } else {
      element.style.setProperty("--active", "0");
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative transition-transform duration-300 ease-out hover:-translate-y-2 ${animationClasses}`}
      style={
        {
          "--spread": 120,
          "--start": "0",
          "--active": "0",
          "--glowingeffect-border-width": `3px`,
          "--repeating-conic-gradient-times": "3",
          "--gradient": `repeating-conic-gradient(
            from 236.84deg at 50% 50%,
            #8F87F1 0%,
            #C68EFD calc(33.33% / var(--repeating-conic-gradient-times)),
            #E9A5F1 calc(66.66% / var(--repeating-conic-gradient-times)),
            #8F87F1 calc(100% / var(--repeating-conic-gradient-times))
          )`,
        } as React.CSSProperties
      }
    >
      <div className="relative h-full shadow-2xl shadow-purple-300 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-px">
        {/* Efek glowing sekarang menjadi bagian dari kartu ini */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit]">
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-500",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>

        {/* Konten kartu */}
        <div className="relative flex flex-col items-center text-center p-8 h-full bg-transparent rounded-[15px]">
          <div className="relative w-36 h-36 mb-6 rounded-full overflow-hidden border-2 border-white/30">
            <Image
              src={member.image}
              alt={member.alt}
              fill
              className="object-cover"
              unoptimized={true}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
          <p className="text-[#8F87F1] font-semibold mb-3">{member.role}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{member.jobDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default function TeamSection() {
  const teamMembers: TeamMember[] = [
    {
      name: "Adam Monhardi",
      role: "Front-end Engineer",
      jobDescription: "Menciptakan antarmuka pengguna yang intuitif dan memastikan pengalaman pengguna yang mulus.",
      image: "/adams.GIF",
      alt: "Adam Monhardi - Front-end",
    },
    {
      name: "Arsyad Fatturahman",
      role: "Backend Engineer",
      jobDescription: "Membangun logika sisi server yang kuat dan mengelola sistem basis data untuk kinerja optimal.",
      image: "/cabul.GIF",
      alt: "Arsyad Fatturahman - Backend",
    },
    {
      name: "Ariq Faishal Hanif",
      role: "AI/ML Engineer",
      jobDescription: "Mengembangkan algoritma cerdas dan model machine learning untuk analisis data dan wawasan.",
      image: "/dodo.GIF",
      alt: "Ariq Faishal Hanif - AI/ML",
    },
  ];

  const [sectionRef, isSectionInView] = useInView({ threshold: 0.1 });

  const getAnimationClasses = (delay: number) =>
    isSectionInView
      ? `animate-in fade-in slide-in-from-bottom duration-700 ease-out delay-${delay}`
      : 'opacity-0';

  return (
    <section id="team" ref={sectionRef} className="w-full py-24 my-24">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 text-gray-900">
          Temui <span className="text-[#8F87F1]">Tim Kami</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              member={member}
              animationClasses={getAnimationClasses(index * 150)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
