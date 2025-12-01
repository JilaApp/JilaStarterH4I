import type React from "react";
import { JobType, LocationType, JobStatus, Jobs } from "@prisma/client";

export { VideoTopic, SocialServiceCategory } from "@prisma/client";

export type FullJobType = Jobs;

export type FormInputState = "default" | "error" | "pending" | "complete";

export type UploadedFile = {
  fileName: string;
  fileSizeMB: number;
};

export interface DataRow {
  id: number;
  [key: string]: unknown;
}

export interface ColumnDefinition<
  T extends DataRow,
  K extends keyof T = keyof T,
> {
  header: string;
  accessorKey: K;
  cell?: (value: T[K]) => React.ReactNode;
}

export type TopicVariant =
  | "Career"
  | "Legal"
  | "Medical"
  | "Transport"
  | "Other"
  | "Shelters"
  | "Food"
  | "Emergencia"
  | "Transportation";

export interface JobFilters {
  speakerTags?: string[];
  locationTypes?: string[];
  jobTypes?: string[];
  minSalary?: number;
  maxSalary?: number;
  locationSearch?: string;
}

export interface JobData {
  id: number;
  titleEnglish: string;
  titleQanjobal: string;
  companyName: string;
  businessContactEmail: string;
  jobType: JobType;
  acceptedLanguages: string[];
  locationType: LocationType;
  city: string;
  state: string;
  url: string;
  salary: number;
  expirationDate: Date;
  descriptionEnglish: string;
  descriptionQanjobal: string;
  status: JobStatus;
}
