import { CONTENT_STATUS } from "@/enums";

export const DEFAULT_INDUSTRY_SORT = "-createdAt";

export const INDUSTRY_POPULATE = {
    LIST: [
        "featuredImage",
        "author",
        "services",
    ],

    DETAIL: [
        "featuredImage",
        "gallery",
        "services",
        "author",
        "createdBy",
        "updatedBy",
    ],
} as const;

export const INDUSTRY_DEFAULTS = {
    STATUS: CONTENT_STATUS.DRAFT,

    FEATURED: false,

    SORT_ORDER: 0,
} as const;