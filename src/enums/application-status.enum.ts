export const APPLICATION_STATUS = {
  APPLIED: "applied",
  REVIEWING: "reviewing",
  SHORTLISTED: "shortlisted",
  INTERVIEW: "interview",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];