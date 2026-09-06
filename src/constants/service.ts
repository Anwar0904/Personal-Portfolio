import { PERMISSIONS } from "@/constants/permissions";

export const SERVICE_MESSAGES = {
    FETCHED:
        "Services fetched successfully.",

    FETCHED_ONE:
        "Service fetched successfully.",

    CREATED:
        "Service created successfully.",

    UPDATED:
        "Service updated successfully.",

    DELETED:
        "Service deleted successfully.",

    RESTORED:
        "Service restored successfully.",

    STATUS_UPDATED:
        "Service status updated successfully.",

    FEATURED_UPDATED:
        "Service featured status updated successfully.",
} as const;

export const SERVICE_PERMISSIONS = {
    READ: PERMISSIONS.SERVICE_READ,

    CREATE: PERMISSIONS.SERVICE_CREATE,

    UPDATE: PERMISSIONS.SERVICE_UPDATE,

    DELETE: PERMISSIONS.SERVICE_DELETE,
} as const;