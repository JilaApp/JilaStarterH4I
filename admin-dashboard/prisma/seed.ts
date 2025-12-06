import {
  PrismaClient,
  VideoTopic,
  SocialServiceCategory,
  JobType,
  LocationType,
  JobStatus,
} from "@prisma/client";
import fs from "fs";
import path from "path";
import { videosData } from "./mock-data/videos";
import { socialServicesData } from "./mock-data/social-services";
import { jobsData } from "./mock-data/jobs";
import { communityOrgsData } from "./mock-data/community-orgs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting the seeding process...");

  console.log("Seeding community organizations...");
  const communityOrgs: { id: string; name: string }[] = [];
  for (const org of communityOrgsData) {
    const created = await prisma.communityOrg.upsert({
      where: { name: org.name },
      update: { ...org },
      create: org,
    });
    communityOrgs.push(created);
  }
  console.log(
    `Successfully seeded ${communityOrgs.length} community organizations.`,
  );

  console.log("Seeding videos...");
  const audioPath = path.join(__dirname, "sample.mp3");

  const audioBuffer = fs.readFileSync(audioPath);

  for (let i = 0; i < videosData.length; i++) {
    const video = videosData[i];
    const existingVideo = await prisma.videos.findFirst({
      where: { urls: { has: video.urls[0] } },
    });

    const communityOrgId = communityOrgs[i % communityOrgs.length].id;

    if (existingVideo) {
      await prisma.videos.update({
        where: { id: existingVideo.id },
        data: {
          ...video,
          audioFileS3Key: "CA138clip.mp3",
          audioFilename: "CA138clip.mp3",
          audioFileSize: 512000,
          communityOrgId,
        },
      });
    } else {
      await prisma.videos.create({
        data: {
          ...video,
          audioFileS3Key: "CA138clip.mp3",
          audioFilename: "CA138clip.mp3",
          audioFileSize: 512000,
          communityOrgId,
        },
      });
    }
  }
  console.log("Successfully seeded 25 videos.");

  console.log("Seeding social services...");
  for (let i = 0; i < socialServicesData.length; i++) {
    const service = socialServicesData[i];
    const communityOrgId = communityOrgs[i % communityOrgs.length].id;
    await prisma.socialServices.upsert({
      where: { phone_number: service.phone_number },
      update: {
        ...service,
        communityOrgId,
        titleAudioFileS3Key: "CA138clip.mp3",
        titleAudioFilename: "CA138clip.mp3",
        titleAudioFileSize: 512000,
        descriptionAudioFileS3Key: "CA138clip.mp3",
        descriptionAudioFilename: "CA138clip.mp3",
        descriptionAudioFileSize: 512000,
      },
      create: {
        ...service,
        communityOrgId,
        titleAudioFileS3Key: "CA138clip.mp3",
        titleAudioFilename: "CA138clip.mp3",
        titleAudioFileSize: 512000,
        descriptionAudioFileS3Key: "CA138clip.mp3",
        descriptionAudioFilename: "CA138clip.mp3",
        descriptionAudioFileSize: 512000,
      },
    });
  }
  console.log("Successfully seeded 25 social services.");

  console.log("Seeding job postings...");
  for (let i = 0; i < jobsData.length; i++) {
    const job = jobsData[i];
    const communityOrgId = communityOrgs[i % communityOrgs.length].id;
    await prisma.jobs.upsert({
      where: { url: job.url },
      update: {},
      create: { ...job, communityOrgId },
    });
  }
  console.log("Successfully seeded 25 job postings.");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
