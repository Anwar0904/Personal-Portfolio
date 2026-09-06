export const LEAD_SOURCE = {
  WEBSITE: "website",
  LINKEDIN: "linkedin",
  REFERRAL: "referral",
  DIRECT: "direct",
  SOCIAL: "social",
  OTHER: "other",
} as const;

export type LeadSource =
  (typeof LEAD_SOURCE)[keyof typeof LEAD_SOURCE];
