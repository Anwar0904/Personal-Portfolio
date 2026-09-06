export const TESTIMONIAL_SORT_FIELDS = [
    "createdAt",
    "updatedAt",
    "clientName",
    "rating",
    "sortOrder",
] as const;

export const DEFAULT_TESTIMONIAL_SORT =
    "-createdAt";

export const TESTIMONIAL_POPULATE = [
    {
        path: "avatar",
    },
    {
        path: "service",
        select: "title slug",
    },
    {
        path: "portfolio",
        select: "title slug",
    },
    {
        path: "industry",
        select: "title slug",
    },
    {
        path: "author",
        select: "name email",
    },
    {
        path: "createdBy",
        select: "name email",
    },
    {
        path: "updatedBy",
        select: "name email",
    },
] as const;