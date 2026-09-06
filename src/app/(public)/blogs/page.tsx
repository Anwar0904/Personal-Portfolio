import AuthorSpotlightSection from "@/components/blog/AuthorSpotlightSection";
import BlogFAQSection from "@/components/blog/BlogFAQSection";
import BlogFinalCTASection from "@/components/blog/BlogFinalCTASection";
import BlogHeroSection from "@/components/blog/BlogHeroSection";
import FeaturedArticlesSection from "@/components/blog/FeaturedArticlesSection";
import LatestArticlesSection from "@/components/blog/LatestArticlesSection";
import NewsletterCTASection from "@/components/blog/NewsletterCTASection";
import ReadingTopicsSection from "@/components/blog/ReadingTopicsSection";
import TrendingArticlesSection from "@/components/blog/TrendingArticlesSection";

export default function BlogPage() {
    return (
        <>
            <BlogHeroSection />
            <FeaturedArticlesSection />
            <TrendingArticlesSection />
            <LatestArticlesSection />
            <NewsletterCTASection />
            <ReadingTopicsSection />
            <AuthorSpotlightSection />
            <BlogFAQSection />
            <BlogFinalCTASection />
        </>
    )
}