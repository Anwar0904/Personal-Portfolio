import ContactFAQSection from "@/components/contact/contact-faq-section";
import ContactFormSection from "@/components/contact/contact-form-section";
import ContactFinalCTASection from "@/components/contact/ContactFinalCTASection";
import ContactHeroSection from "@/components/contact/ContactHeroSection";
import ContactMethodsSection from "@/components/contact/contactMethods";
import OfficeLocationSection from "@/components/contact/OfficeLocationSection";
import WhyChooseADMSection from "@/components/contact/WhyChooseADMSection";


export default function ContactPage() {
    return (
        <>
            <ContactHeroSection />
            <ContactMethodsSection />
            <ContactFormSection />
            <WhyChooseADMSection />
            <OfficeLocationSection />
            <ContactFinalCTASection />
            <ContactFAQSection />
        </>
    )
}