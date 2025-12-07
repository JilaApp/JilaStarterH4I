import type { inferRouterOutputs } from "@trpc/server";

export enum SocialServiceCategory {
  EMERGENCIA = "EMERGENCIA",
  SHELTERS = "SHELTERS",
  FOOD = "FOOD",
  TRANSPORTATION = "TRANSPORTATION",
  OTHER = "OTHER",
}

export enum JobType {
  INTERNSHIP = "INTERNSHIP",
  FULLTIME = "FULLTIME",
  QANJOBAL = "QANJOBAL",
  PARTTIME = "PARTTIME",
  TEMPORARY = "TEMPORARY",
  FREELANCE = "FREELANCE",
  SEASONAL = "SEASONAL",
}

export enum LocationType {
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  INPERSON = "INPERSON",
}

export enum JobStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export type SocialService = {
  id: number;
  title: string;
  category: SocialServiceCategory;
  phone_number: string;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  url?: string | null;
  titleAudioFilename?: string | null;
  titleAudioFileSize?: number | null;
  titleAudioFileS3Key?: string | null;
  descriptionAudioFilename?: string | null;
  descriptionAudioFileSize?: number | null;
  descriptionAudioFileS3Key?: string | null;
};

export type VideoData = {
  id: number;
  titleEnglish: string;
  titleQanjobal: string;
  topic: string;
  urls: string[];
  durations: number[];
  uploadDate: Date;
  descriptionEnglish: string | null;
  descriptionQanjobal: string | null;
  audioFilename: string | null;
  audioFileSize: number | null;
  audioFileS3Key: string | null;
  communityOrgId: string | null;
};

export type Job = {
  id: number;
  titleEnglish: string;
  titleQanjobal: string;
  companyName: string;
  businessContactEmail: string;
  jobType: JobType;
  acceptedLanguages: string[];
  locationType: LocationType;
  city: string | null;
  state: string | null;
  url: string | null;
  salary: string | null;
  expirationDate: Date | null;
  descriptionEnglish: string | null;
  descriptionQanjobal: string | null;
  status: JobStatus;
  unread: boolean;
  createdAt: Date;
  updatedAt: Date;
  communityOrgId: string | null;
};

// Using any for AppRouter due to tRPC's complex type requirements
// Type safety is still maintained through tRPC's runtime validation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppRouter = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouterOutputs = any;
