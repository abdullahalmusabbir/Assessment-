
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <WhyChooseUs />
      <CTASection />
    </main>
  );
}
