


import FAQPreviewSection from "@/components/services/faq-preview-section";
import ServicesHeroSection from "@/components/services/hero-section";
import ProcessSection from "@/components/services/process-section";
import ServicesCTASection from "@/components/services/services-cta-section";
import ServicesGridSection from "@/components/services/services-grid-section";
import TechnologiesSection from "@/components/services/technologies-section";
import WhyADMSection from "@/components/services/why-adm-section";

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <ServicesHeroSection />
      <ServicesGridSection />
      <WhyADMSection />
      <ProcessSection />
      <TechnologiesSection />
      <FAQPreviewSection />
      <ServicesCTASection />
    </main>
  );
}