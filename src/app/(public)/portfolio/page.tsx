import ClientSuccessMetrics from "@/components/portfolio/ClientSuccessMetrics";
import FeaturedProjectsGrid from "@/components/portfolio/featured-projects-grid";
import PortfolioHero from "@/components/portfolio/hero";
import IndustriesShowcase from "@/components/portfolio/IndustriesShowcase";
import PortfolioMasonry from "@/components/portfolio/portfolio-masonry";
import PortfolioFAQ from "@/components/portfolio/PortfolioFAQ";
import PortfolioFilter from "@/components/portfolio/PortfolioFilter";
import PortfolioFinalCTA from "@/components/portfolio/PortfolioFinalCTA";
import PortfolioTestimonials from "@/components/portfolio/PortfolioTestimonials";
import ProjectProcess from "@/components/portfolio/ProjectProcess";

export default function PortfolioPage() {
    return (
        <>
            <PortfolioHero />
            <PortfolioFilter />
            <PortfolioMasonry />
            <IndustriesShowcase />
            <ClientSuccessMetrics />
            <ProjectProcess />
            <PortfolioTestimonials />
            <PortfolioFAQ />
            <PortfolioFinalCTA />
        </>
    )
}