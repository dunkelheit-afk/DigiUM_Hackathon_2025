// components/sections/FeaturesSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeaturesSection() {
  const features = [
    {
      title: "Digital Accounting",
      subtitle: "Easy, fast, and accurate digital bookkeeping for MSMEs.",
      description: "Manage your financial records effortlessly. From income and expenses to profit and loss statements, DigiUM automates the complexities of bookkeeping, saving you time and reducing errors. Access real-time financial insights to make informed decisions for your business growth.",
      image: "/akutansi.svg",
      alt: "Digital Accounting Dashboard",
      reverse: false, // Text left, Image right
      id: "digital-accounting" // Added unique ID for this feature
    },
    {
      title: "MSME Showcase",
      subtitle: "Promote your products through exhibitions and collaborative events.",
      description: "Expand your market reach and connect with new customers. DigiUM provides a platform for your products to be featured in virtual exhibitions and collaborative marketing campaigns. Showcase your unique offerings and participate in events designed to boost your brand visibility.",
      image: "/showcase.svg",
      alt: "MSME Product Showcase",
      reverse: true, // Image left, Text right
      id: "msme-showcase-feature" // Added unique ID for this feature
    },
    {
      title: "Funding & Investment",
      subtitle: "Access various funding sources and connect with impact-driven investors.",
      description: "Unlock new opportunities for growth with flexible funding options. DigiUM connects you with a network of investors and financial institutions ready to support UMKM. Get access to tailored financing solutions and expert guidance to secure the capital you need.",
      image: "/inves.svg",
      alt: "Funding and Investment Connection",
      reverse: false, // Text left, Image right
      id: "funding-feature" // Added unique ID for this feature
    },
  ];

  return (
    <section id="features" className="w-full py-20 bg-gray-50 text-gray-900 shadow-xl">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">
          Our <span className="text-purple-600">Services</span>
        </h2>

        <div className="space-y-60"> {/* This space-y-24 sets gap between feature divs */}
          {features.map((feature, index) => {
            // Observer for each feature section to trigger animations
            const [featureRef, isFeatureInView] = useInView({ threshold: 0.01 });

            // Animation classes for text and image
            const textAnimationClasses = isFeatureInView ? "animate-in fade-in slide-in-from-bottom duration-700 ease-out" : "opacity-0";
            const imageAnimationClasses = isFeatureInView ? `animate-in fade-in ${feature.reverse ? 'slide-in-from-left' : 'slide-in-from-right'} duration-1000 ease-out delay-100` : "opacity-0";

            return (
              <div
                key={index}
                id={feature.id} // Added ID to the feature's div
                ref={featureRef} // Ref for Intersection Observer
                // Add mb-24 to each feature div for consistent bottom spacing, except the last one
                className={`flex flex-col items-center gap-12 md:gap-24 ${
                  feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
                } ${index < features.length - 1 ? 'mb-24' : ''}`}
              >
                {/* Text Column */}
                <div className={`md:w-1/2 text-center md:text-left ${textAnimationClasses}`}>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-xl font-semibold text-purple-600 mb-6">
                    {feature.subtitle}
                  </p>
                  <p className="text-base text-gray-600 leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  <Link href={`/features/${feature.id}`} className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200">
                    Learn More &rarr;
                  </Link>
                </div>

                {/* Image Column */}
                <div className={`md:w-1/2 ${imageAnimationClasses}`}>
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    width={600}
                    height={400}
                    className="mx-auto w-full max-w-full h-auto object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
