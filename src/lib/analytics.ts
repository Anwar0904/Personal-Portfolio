import { track } from "@vercel/analytics";

export type AnalyticsPropertyValue = string | number | boolean | null;

export function formatLeadAnalytics(data: {
    source?: string;
    interestedServices?: string[];
    budget?: string | null;
    hasFiles?: boolean;
}) {
    return {
        source: data.source ?? "website",
        service_count: data.interestedServices?.length ?? 0,
        has_budget: Boolean(data.budget),
        has_files: Boolean(data.hasFiles),
        budget: data.budget ?? "not_specified",
    } satisfies Record<string, AnalyticsPropertyValue | number>;
}

export function formatConsultationAnalytics(data: {
    projectType?: string;
    budget?: string | null;
    timeline?: string | null;
    preferredContact?: string;
    hasFiles?: boolean;
}) {
    return {
        project_type: data.projectType ?? "not_specified",
        budget: data.budget ?? "not_specified",
        timeline: data.timeline ?? "not_specified",
        preferred_contact: data.preferredContact ?? "email",
        has_files: Boolean(data.hasFiles),
    } satisfies Record<string, AnalyticsPropertyValue>;
}

export function trackPageView(
    eventName: string,
    properties: Record<string, AnalyticsPropertyValue> = {}
) {
    if (typeof window === "undefined") {
        return;
    }

    track(eventName, properties);
}
