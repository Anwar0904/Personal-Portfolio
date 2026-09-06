export const MEETING_TYPE = {
  GOOGLE_MEET: "google-meet",
  ZOOM: "zoom",
  MICROSOFT_TEAMS: "microsoft-teams",
  PHONE: "phone",
  IN_PERSON: "in-person",
} as const;

export type MeetingType =
  (typeof MEETING_TYPE)[keyof typeof MEETING_TYPE];