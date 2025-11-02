import type React from "react";

// Re-export Prisma enums for convenience
export { VideoTopic, SocialServiceCategory } from "@prisma/client";

// Router input types (from routers)
import { z } from "zod";
import { VideoTopic, SocialServiceCategory } from "@prisma/client";

// Video router types
export const addVideoInputSchema = z.object({
  titleEnglish: z.string(),
  titleQanjobal: z.string(),
  audioFile: z.string(),
  audioFilename: z.string(),
  audioFileSize: z.number(),
  topic: z.nativeEnum(VideoTopic),
  url: z.string(),
  descriptionEnglish: z.string(),
  descriptionQanjobal: z.string(),
});

export type AddVideoInput = z.infer<typeof addVideoInputSchema>;

export const removeVideoInputSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export type RemoveVideoInput = z.infer<typeof removeVideoInputSchema>;

export const updateVideoInputSchema = z.object({
  id: z.number(),
  titleEnglish: z.string().optional(),
  titleQanjobal: z.string().optional(),
  topic: z.nativeEnum(VideoTopic).optional(),
  url: z.string().optional(),
  descriptionEnglish: z.string().optional(),
  descriptionQanjobal: z.string().optional(),
  audioFile: z.string().optional(),
  audioFilename: z.string().optional(),
  audioFileSize: z.number().optional(),
});

export type UpdateVideoInput = z.infer<typeof updateVideoInputSchema>;

// Social services router types
export const addSocialServiceInputSchema = z.object({
  title: z.string(),
  category: z.nativeEnum(SocialServiceCategory),
  phone_number: z.string(),
  address: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
});

export type AddSocialServiceInput = z.infer<typeof addSocialServiceInputSchema>;

export const removeSocialServiceInputSchema = z.object({
  id: z.number().int(),
});

export type RemoveSocialServiceInput = z.infer<
  typeof removeSocialServiceInputSchema
>;

export const editSocialServiceInputSchema = z.object({
  id: z.number().int(),
  title: z.string().optional(),
  category: z.nativeEnum(SocialServiceCategory).optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
});

export type EditSocialServiceInput = z.infer<
  typeof editSocialServiceInputSchema
>;

// Component types
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

// Topic variant type for UI display
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
