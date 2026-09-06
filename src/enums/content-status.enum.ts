export const CONTENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type ContentStatus =
  (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];


export const TEAM_MEMBER_TEMPLATES = {
  DEFAULT: "default",

  MINIMAL: "minimal",

  MODERN: "modern",
} as const;

export type TeamMemberTemplate =
  (typeof TEAM_MEMBER_TEMPLATES)[keyof typeof TEAM_MEMBER_TEMPLATES];