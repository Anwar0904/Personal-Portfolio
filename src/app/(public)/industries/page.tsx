import DeliveryProcess from "@/components/industries/DeliveryProcess";
import IndustriesGrid from "@/components/industries/IndustriesGrid";
import IndustriesHero from "@/components/industries/IndustriesHero";
import IndustryCaseStudies from "@/components/industries/IndustryCaseStudies";
import IndustryCTA from "@/components/industries/IndustryCTA";
import IndustryFaq from "@/components/industries/IndustryFaq";
import TechnologyExpertise from "@/components/industries/TechnologyExpertise";
import IndustriesShowcase from "@/components/portfolio/IndustriesShowcase";

export default function IndustriesPage() {
    return (
        <>
            <IndustriesHero />
            <IndustriesGrid />
            <IndustriesShowcase />
            <IndustryCaseStudies />
            <TechnologyExpertise />
            <DeliveryProcess />
            <IndustryFaq />
            <IndustryCTA />
        </>
    )
}