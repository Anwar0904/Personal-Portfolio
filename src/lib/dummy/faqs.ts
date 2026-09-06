export interface FAQCategory {
    id: string;
    title: string;
}

export const faqCategories: FAQCategory[] = [
    {
        id: "general",
        title: "General",
    },
    {
        id: "services",
        title: "Services",
    },
    {
        id: "development",
        title: "Development",
    },
    {
        id: "pricing",
        title: "Pricing",
    },
    {
        id: "support",
        title: "Support",
    },
];

export interface FAQ {
    id: string;
    category: string;
    question: string;
    answer: string;
}

export const faqs: FAQ[] = [
    {
        id: "1",
        category: "general",
        question: "What does ADM specialize in?",
        answer:
            "ADM specializes in AI solutions, custom software development, web applications, mobile apps, cloud platforms, UI/UX design, and digital transformation services.",
    },

    {
        id: "2",
        category: "general",
        question: "Who do you work with?",
        answer:
            "We work with startups, SMEs, enterprises, government organizations, and international clients across multiple industries.",
    },

    {
        id: "3",
        category: "services",
        question: "What services do you provide?",
        answer:
            "Our services include AI development, custom software, websites, mobile applications, cloud solutions, DevOps, branding, UI/UX, and ongoing technical support.",
    },

    {
        id: "4",
        category: "development",
        question: "How long does a project usually take?",
        answer:
            "Project timelines depend on complexity. Small projects may take 2–4 weeks, while enterprise solutions typically require several months.",
    },

    {
        id: "5",
        category: "pricing",
        question: "How is pricing calculated?",
        answer:
            "Pricing depends on project scope, timeline, required technologies, integrations, and long-term maintenance requirements.",
    },

    {
        id: "6",
        category: "support",
        question: "Do you provide maintenance after delivery?",
        answer:
            "Yes. We provide continuous maintenance, monitoring, updates, security patches, and long-term technical support.",
    },

    {
        id: "7",
        category: "support",
        question: "Can I request future enhancements?",
        answer:
            "Absolutely. Every solution is built to scale, making future improvements and feature additions straightforward.",
    },

    {
        id: "8",
        category: "pricing",
        question: "Do you offer free consultation?",
        answer:
            "Yes. Every client receives an initial consultation to discuss requirements, goals, timelines, and the best technical approach.",
    },
];