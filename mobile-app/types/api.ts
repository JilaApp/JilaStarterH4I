// This file imports types from the admin-dashboard
// In a real setup, you'd either:
// 1. Share types through a monorepo
// 2. Generate types from the API
// 3. Define them manually here

// For now, we'll manually define the AppRouter type based on the admin-dashboard
import type { inferRouterOutputs } from "@trpc/server";

export enum SocialServiceCategory {
  EMERGENCIA = "EMERGENCIA",
  SHELTERS = "SHELTERS",
  FOOD = "FOOD",
  TRANSPORTATION = "TRANSPORTATION",
  OTHER = "OTHER",
}

export type SocialService = {
  id: number;
  title: string;
  category: SocialServiceCategory;
  phone_number: string;
  address?: string | null;
  description?: string | null;
  url?: string | null;
  titleAudioFilename?: string | null;
  titleAudioFileSize?: number | null;
  titleAudioFile?: string | null;
  descriptionAudioFilename?: string | null;
  descriptionAudioFileSize?: number | null;
  descriptionAudioFile?: string | null;
};

// Define the AppRouter type structure based on the admin-dashboard router
export type AppRouter = {
  socialServices: {
    getAllSocialServices: {
      input: void;
      output: SocialService[];
    };
  };
};

export type RouterOutputs = inferRouterOutputs<AppRouter>;
