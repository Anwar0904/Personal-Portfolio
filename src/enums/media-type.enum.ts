export const MEDIA_TYPE = {
  IMAGE: "image",
  VIDEO: "video",
  DOCUMENT: "document",
  PDF: "pdf",
} as const;

export type MediaType =
  (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];