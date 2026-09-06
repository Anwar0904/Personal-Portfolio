import { MEDIA_TYPE, CONTENT_STATUS } from "@/enums";

export const IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
];

export const VIDEO_MIME_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

export const DOCUMENT_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_MIME_TYPES = [
    ...IMAGE_MIME_TYPES,
    ...VIDEO_MIME_TYPES,
    ...DOCUMENT_MIME_TYPES,
];

export const DEFAULT_MEDIA_QUERY = {
    page: 1,
    limit: 10,
    status: CONTENT_STATUS.PUBLISHED,
};

export { MEDIA_TYPE, CONTENT_STATUS };