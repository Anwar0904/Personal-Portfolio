export const LEAD_STATUS = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  CONVERTED: "converted",
  PROPOSAL_SENT: "proposal_sent",
  WON: "won",
  LOST: "lost",
} as const;

export type LeadStatus =
  (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];