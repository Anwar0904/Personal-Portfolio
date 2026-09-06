import { PERMISSIONS } from "./permissions";

export const PAGE_MESSAGES = {
    CREATED: "Page created successfully.",
    UPDATED: "Page updated successfully.",
    DELETED: "Page deleted successfully.",
    RESTORED: "Page restored successfully.",

    FETCHED: "Page fetched successfully.",
    FETCHED_ALL: "Pages fetched successfully.",

    STATUS_UPDATED:
        "Page status updated successfully.",

    HOME_UPDATED:
        "Homepage updated successfully.",

    NOT_FOUND: "Page not found.",

    SLUG_EXISTS:
        "Page slug already exists.",
} as const;

export const PAGE_PERMISSIONS = {
    READ: PERMISSIONS.BLOG_READ,
    CREATE: PERMISSIONS.BLOG_CREATE,
    UPDATE: PERMISSIONS.BLOG_UPDATE,
    DELETE: PERMISSIONS.BLOG_DELETE,
} as const;

export const PAGE_TEMPLATES = [
    "default",
    "about",
    "contact",
    "privacy",
    "terms",
] as const;