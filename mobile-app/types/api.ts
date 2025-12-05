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
  titleAudioFileS3Key?: string | null;
  descriptionAudioFilename?: string | null;
  descriptionAudioFileSize?: number | null;
  descriptionAudioFileS3Key?: string | null;
};

export type VideoData = {
  id: string | number;
  titleEnglish: string;
  titleQanjobal: string;
  topic: string;
  urls: string[];
  descriptionEnglish: string | null;
  descriptionQanjobal: string | null;
  audioFilename: string | null;
  audioFileSize: number | null;
  audioFileS3Key: string | null;
};

export type AppRouter = {
  socialServices: {
    getAllSocialServices: {
      input: void;
      output: SocialService[];
    };
  };
};

export type RouterOutputs = inferRouterOutputs<AppRouter>;
