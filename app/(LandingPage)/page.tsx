// app/(LandingPage)/page.tsx

import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { HeroSection } from "@/components/sections/HeroSection";
import SupportedBySection from "@/components/sections/SupportedBySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import Footer from "@/components/sections/Footer";
import TeamSection from "@/components/sections/TeamSection";
import UmkmSection from "@/components/sections/UmkmSection";
import PricingSection from "@/components/sections/PricingSection";
export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <SupportedBySection />
      <UmkmSection />
      <FeaturedSection />
      <ReviewsSection />
      <PricingSection />
      <TeamSection />
      <Footer />
    </>
  );
}
