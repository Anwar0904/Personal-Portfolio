import CallToActionSection from "@/components/home/CallToActionSection";
import { Hero } from "@/components/home/hero";
import LatestBlogsSection from "@/components/home/LatestBlogsSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import ProcessSection from "@/components/home/ProcessSection";
import ServicesSection from "@/components/home/services";


export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <LatestBlogsSection />
      <CallToActionSection />
    </>
  );
}