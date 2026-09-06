import FAQAccordion from "@/components/faqs/faq-accordion";
import FAQCategories from "@/components/faqs/faq-categories";
import FAQCTA from "@/components/faqs/faq-cta";
import FAQHero from "@/components/faqs/faq-hero";


export default function FAQsPage() {
    return (
        <>
            <FAQHero />
            <FAQCategories />
            <FAQAccordion />
            <FAQCTA />
        </>
    );
}