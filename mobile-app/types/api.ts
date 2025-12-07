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

export type VideoData = { //this component is 1 video topic and there are multiple urls attached to it
  id: string | number;
  titleEnglish: string;
  titleQanjobal: string;
  topic: string;
  urls: string[]; 
  descriptionEnglish: string | null;
  descriptionQanjobal: string | null;
  audioFilename: string | null; //not sure how this plays into multiple urls
  audioFileSize: number | null; //not sure how this plays into multiple urls
  audioFileS3Key: string | null; //not sure how this plays into multiple urls
  youtube_url: Boolean[]; //true means youtube, false means google drive
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
