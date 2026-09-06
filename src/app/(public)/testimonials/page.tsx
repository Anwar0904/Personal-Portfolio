import FeaturedSuccessStory from "@/components/testimonials/featured-success-story";
import TestimonialsCTA from "@/components/testimonials/testimonials-cta";
import TestimonialsGrid from "@/components/testimonials/testimonials-grid";
import TestimonialsHero from "@/components/testimonials/testimonials-hero";
import TrustSection from "@/components/testimonials/trust-section";


export default function TestimonialsPage() {
    return (
        <>
            <TestimonialsHero />
            <FeaturedSuccessStory />
            <TestimonialsGrid />
            <TrustSection />
            <TestimonialsCTA />
        </>
    );
}