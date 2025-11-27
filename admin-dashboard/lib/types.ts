import type React from "react";

export {
  VideoTopic,
  SocialServiceCategory,
  JobType,
  LocationType,
  JobStatus,
} from "@prisma/client";
export type { Videos, SocialServices, Jobs } from "@prisma/client";

export type FormInputState = "default" | "error" | "pending" | "complete";

export type UploadedFile = {
  fileName: string;
  fileSizeMB: number;
};

export interface DataRow {
  id: number | string;
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
