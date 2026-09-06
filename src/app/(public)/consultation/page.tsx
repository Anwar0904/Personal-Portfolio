import ConsultationFaqSection from "@/components/consultation/consultation-faq-section";
import ConsultationFinalCTASection from "@/components/consultation/consultation-final-cta-section";
import ConsultationProcessSection from "@/components/consultation/consultation-process-section";
import ConsultationRequestSection from "@/components/consultation/consultation-request-section";
import ConsultationHero from "@/components/consultation/ConsultationHero";

export default function ConsultationPage() {
    return (
        <>
            <ConsultationHero />
            <ConsultationRequestSection />
            <ConsultationProcessSection />
            <ConsultationFaqSection />
            <ConsultationFinalCTASection />
        </>
    )
}