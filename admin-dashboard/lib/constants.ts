import { VideoTopic, SocialServiceCategory } from "@/lib/types";
import type { TopicVariant } from "@/lib/types";
import { JobType, LocationType } from "@prisma/client";

// File upload limits
export const MAX_AUDIO_FILE_SIZE_MB = 30;
export const MAX_AUDIO_FILE_SIZE_BYTES = MAX_AUDIO_FILE_SIZE_MB * 1024 * 1024;

// Salary filter defaults
export const DEFAULT_MIN_SALARY = 10000;
export const DEFAULT_MAX_SALARY = 100000;

// UI timing constants (in milliseconds)
export const NOTIFICATION_AUTO_DISMISS_MS = 3000;
export const NAVIGATION_DELAY_MS = 1000;

// Validation constants
export const MIN_PASSWORD_LENGTH = 8;
export const ADDRESS_PARTS_COUNT = 3;

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

// Job type options for dropdowns
export const JOB_TYPE_OPTIONS = [
  "Internship",
  "Full-time",
  "Part-time",
  "Temporary",
  "Freelance",
  "Seasonal",
] as const;

export const JOB_TYPE_TO_ENUM: Record<string, JobType> = {
  Internship: JobType.INTERNSHIP,
  "Full-time": JobType.FULLTIME,
  "Part-time": JobType.PARTTIME,
  Temporary: JobType.TEMPORARY,
  Freelance: JobType.FREELANCE,
  Seasonal: JobType.SEASONAL,
};

export const JOB_TYPE_FROM_ENUM: Record<JobType, string> = {
  [JobType.INTERNSHIP]: "Internship",
  [JobType.FULLTIME]: "Full-time",
  [JobType.PARTTIME]: "Part-time",
  [JobType.TEMPORARY]: "Temporary",
  [JobType.FREELANCE]: "Freelance",
  [JobType.SEASONAL]: "Seasonal",
  [JobType.QANJOBAL]: "Q'anjob'al",
};

// Location type options for dropdowns
export const LOCATION_TYPE_OPTIONS = ["Remote", "Hybrid", "In person"] as const;

export const LOCATION_TYPE_TO_ENUM: Record<string, LocationType> = {
  Remote: LocationType.REMOTE,
  Hybrid: LocationType.HYBRID,
  "In person": LocationType.INPERSON,
};

export const LOCATION_TYPE_FROM_ENUM: Record<LocationType, string> = {
  [LocationType.REMOTE]: "Remote",
  [LocationType.HYBRID]: "Hybrid",
  [LocationType.INPERSON]: "In person",
};

// Language options for job postings
export const LANGUAGE_OPTIONS = [
  { name: "Non-English", disabled: false },
  { name: "Spanish", disabled: false },
  { name: "Q'anjob'al", disabled: false },
];
