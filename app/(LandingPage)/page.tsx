// app/page.tsx
import FeaturesSection from "@/components/sections/FeaturedSection";
import HeroSection from "@/components/sections/HeroSection";
import SupportedBySection from "@/components/sections/SupportedBySection";
import ReviewSection from "@/components/sections/ReviewsSection";
import Footer from "@/components/sections/Footer"
import TeamSection from "@/components/sections/TeamSection"
import UmkmSection from "@/components/sections/UmkmSection";

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <SupportedBySection />
      <UmkmSection />
      <FeaturesSection />
      <ReviewSection />
      <TeamSection />
      <Footer /> {/* Tambahkan komponen SupportedBySection di sini */}
    </>
  );
}
