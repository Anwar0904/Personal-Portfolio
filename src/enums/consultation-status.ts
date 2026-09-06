export const CONSULTATION_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
  RESCHEDULED: "rescheduled",
} as const;

export type ConsultationType =
  (typeof CONSULTATION_STATUS)[keyof typeof CONSULTATION_STATUS];