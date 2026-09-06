import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/config/site";

import Hero from "@/components/service-detail/Hero";
import { RelatedServices } from "@/components/service-detail/related-services";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";

interface Props {
  params: Promise<{ slug: string }>;
}

function deepPlain(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => deepPlain(item));
  }

  if (value && typeof value === "object") {
    if (typeof (value as { toJSON?: () => unknown }).toJSON === "function") {
      return deepPlain((value as { toJSON: () => unknown }).toJSON());
    }

    if (
      typeof (value as { _bsontype?: string })._bsontype === "string" &&
      (value as { _bsontype: string })._bsontype === "ObjectId"
    ) {
      return (value as { toString: () => string }).toString();
    }

    const result: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      result[key] = deepPlain(nested);
    }

    return result;
  }

  return value;
}

function resolveMediaUrl(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const media = value as {
      url?: string | null;
      path?: string | null;
      secureUrl?: string | null;
    };

    return media.url ?? media.path ?? media.secureUrl ?? null;
  }

  return null;
}

function normalizeService(service: any): any {
  if (!service) return null;

  const plain = deepPlain(service) as Record<string, any>;
  const gallery = Array.isArray(plain.gallery) ? plain.gallery : [];
  const firstImage = resolveMediaUrl(plain.featuredImage) ?? gallery.map(resolveMediaUrl).find(Boolean) ?? null;

  const normalized: Record<string, any> = {
    ...plain,
    image: firstImage,
    featureList: Array.isArray(plain.features) ? plain.features : [],
    faqList: Array.isArray(plain.faqs) ? plain.faqs : [],
    gallery: gallery
      .map((item: unknown) => resolveMediaUrl(item))
      .filter((item: string | null): item is string => typeof item === "string" && Boolean(item)),
  };

  return normalized;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  await connectDB();

  try {
    const record = await PublicContentService.getServiceBySlug(slug);
    const service = normalizeService(record);

    if (!service) {
      return { title: "Service Not Found" };
    }

    const url = `${SITE_URL}/services/${service.slug}`;

    return {
      title: service.seo?.metaTitle || service.title || "Service",
      description: service.seo?.metaDescription || service.shortDescription || "Service details",
      keywords: service.seo?.keywords || [],
      openGraph: {
        type: "website",
        title: service.title,
        description: service.seo?.metaDescription || service.shortDescription || "Service details",
        url: url,
        images: service.image ? [
          {
            url: service.image,
            width: 1200,
            height: 630,
            alt: service.title,
          }
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: service.title,
        description: service.seo?.metaDescription || service.shortDescription || "Service details",
        images: service.image ? [service.image] : [],
      },
    };
  } catch {
    return { title: "Service Not Found" };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  await connectDB();

  let service;

  try {
    service = await PublicContentService.getServiceBySlug(slug);
  } catch {
    notFound();
  }

  const currentService = normalizeService(service);

  if (!currentService) {
    notFound();
  }

  const relatedResult = await PublicContentService.getServices({ page: 1, limit: 4 });
  const related = (relatedResult.services ?? [])
    .map((item) => normalizeService(item))
    .filter((item) => item && item.slug !== slug)
    .slice(0, 3) as Array<{ slug: string; title: string; shortDescription?: string; featuredImage?: unknown; image?: string | null }>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Hero service={currentService} />

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.5)] backdrop-blur-sm">
              <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                Service Overview
              </span>

              <div
                className="mt-8 space-y-5 text-base leading-8 text-slate-300"
                dangerouslySetInnerHTML={{ __html: currentService.content || "<p>We deliver tailored digital solutions designed for growth and performance.</p>" }}
              />
            </div>

            <div className="rounded-[28px] border border-blue-500/20 bg-linear-to-br from-blue-600/15 via-slate-900/80 to-cyan-500/10 p-8 shadow-[0_30px_80px_rgba(37,99,235,0.12)]">
              <h2 className="text-2xl font-black text-white">What you get</h2>

              <div className="mt-7 space-y-4">
                {(currentService.featureList.length ? currentService.featureList : [
                  { title: "Strategy & planning", description: "Clear roadmap aligned to your goals" },
                  { title: "Design & experience", description: "Modern user journeys and scalable interfaces" },
                  { title: "Delivery & support", description: "Launch-ready implementation and ongoing optimization" },
                ]).map((feature: { title: string; description?: string }, index: number) => (
                  <div key={`${feature.title}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-cyan-300">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                        {feature.description ? <p className="mt-1 text-sm leading-6 text-slate-300">{feature.description}</p> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {currentService.gallery?.length ? (
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Gallery
                </span>
                <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">A closer look</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {currentService.gallery.slice(0, 6).map((item: string, index: number) => (
                <div key={`${item}-${index}`} className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/70">
                  <img src={item} alt={`${currentService.title} gallery ${index + 1}`} className="h-72 w-full object-cover transition duration-500 hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {currentService.faqList.length ? (
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                FAQ
              </span>
              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Frequently asked questions</h2>
            </div>

            <div className="space-y-4">
              {currentService.faqList.map((faq: { question: string; answer: string }, index: number) => (
                <div key={`${faq.question}-${index}`} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <RelatedServices services={related} />
    </main>
  );
}