import CallToActionSection from "@/components/home/CallToActionSection";
import FaqSection from "@/components/home/FaqSection";
import { Hero } from "@/components/home/hero";
import LatestBlogsSection from "@/components/home/LatestBlogsSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import ProcessSection from "@/components/home/ProcessSection";
import ServicesSection from "@/components/home/services";
import StatsSection from "@/components/home/stats";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedCompanies from "@/components/home/trusted";


export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedCompanies />
      <ServicesSection />
      <StatsSection />
      <ProcessSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FaqSection />
      <LatestBlogsSection />
      <CallToActionSection />
    </>
  );
}