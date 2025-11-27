import { VideoTopic, SocialServiceCategory } from "@/lib/types";
import type { TopicVariant } from "@/lib/types";

// File size limits (in MB)
export const FILE_SIZE_LIMITS = {
  AUDIO: 30,
  IMAGE: 5,
  VIDEO: 100,
} as const;

// Z-index scale for layering
export const Z_INDEX = {
  DROPDOWN: 10,
  CONTEXT_MENU: 30,
  MODAL: 50,
  NOTIFICATION: 9999,
} as const;

// Timing constants (in milliseconds)
export const TIMINGS = {
  NOTIFICATION_AUTO_CLOSE: 3000,
  REDIRECT_DELAY: 2000,
  DEBOUNCE_SEARCH: 300,
} as const;

// Supported languages
export const LANGUAGES = {
  ENGLISH: "English",
  SPANISH: "Spanish",
  QANJOBAL: "Qanjobal",
} as const;

export const LANGUAGE_OPTIONS = Object.values(LANGUAGES);

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

// Topic colors for UI display
export const TOPIC_COLORS: Record<TopicVariant, string> = {
  Career: "#CDE6B9",
  Legal: "#D4928F",
  Medical: "#FBE2B6",
  Transport: "#BDD0E2",
  Other: "#F3CAAD",
  Shelters: "#FBE2B6",
  Food: "#CDE6B9",
  Emergencia: "#D4928F",
  Transportation: "#BDD0E2",
};

// Video topic options for dropdowns
export const VIDEO_TOPIC_OPTIONS = Object.keys(VideoTopic) as Array<string>;

export const VIDEO_TOPIC_DISPLAY_OPTIONS = [
  "Transport",
  "Legal",
  "Medical",
  "Career",
  "Education",
  "Other",
] as const;

export const SOCIAL_SERVICE_CATEGORY_ENUM_MAP: Record<string, string> = {
  Emergency: "EMERGENCIA",
  Shelters: "SHELTERS",
  Food: "FOOD",
  Transportation: "TRANSPORTATION",
  Other: "OTHER",
};

// Social service category options for dropdowns
export const SOCIAL_SERVICE_CATEGORY_OPTIONS = Object.keys(
  SocialServiceCategory,
) as Array<keyof typeof SocialServiceCategory>;

export const SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS = [
  "Emergencia",
  "Shelters",
  "Food",
  "Transportation",
  "Other",
] as const;

// US States
export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

// Topic mapping from enum values to display variants
export const TOPIC_MAP: Record<string, TopicVariant> = {
  TRANSPORT: "Transport",
  TRANSPORTATION: "Transportation",
  LEGAL: "Legal",
  MEDICAL: "Medical",
  CAREER: "Career",
  EDUCATION: "Other",
  OTHER: "Other",
  EMERGENCIA: "Emergencia",
  SHELTERS: "Shelters",
  FOOD: "Food",
};
