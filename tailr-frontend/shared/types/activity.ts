export type ActivityEventType =
  | "APPLICATION_CREATED"
  | "STATUS_CHANGED"
  | "RESUME_TAILORED"
  | "INTERVIEW_SCHEDULED"
  | "OFFER_RECEIVED"
  | "NOTE_ADDED";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  timestamp: string;
  companyName: string;
  positionTitle: string;
  period: "today" | "yesterday" | "this_week";
}
