-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('JILA_ADMIN', 'COMMUNITY_ORG_ADMIN');

-- CreateEnum
CREATE TYPE "VideoTopic" AS ENUM ('TRANSPORT', 'LEGAL', 'MEDICAL', 'CAREER', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "SocialServiceCategory" AS ENUM ('EMERGENCIA', 'SHELTERS', 'FOOD', 'TRANSPORTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('INTERNSHIP', 'FULLTIME', 'QANJOBAL', 'PARTTIME', 'TEMPORARY', 'FREELANCE', 'SEASONAL');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('REMOTE', 'HYBRID', 'INPERSON');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "CommunityOrg" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Champaign',
    "state" TEXT NOT NULL DEFAULT 'Illinois',

    CONSTRAINT "CommunityOrg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'COMMUNITY_ORG_ADMIN',
    "communityOrgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "communityOrg" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT NOT NULL,
    "ttsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Videos" (
    "id" SERIAL NOT NULL,
    "titleEnglish" TEXT NOT NULL,
    "titleQanjobal" TEXT NOT NULL,
    "audioFileS3Key" TEXT,
    "audioFilename" TEXT,
    "audioFileSize" INTEGER,
    "topic" "VideoTopic" NOT NULL,
    "urls" TEXT[],
    "durations" INTEGER[],
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "descriptionEnglish" TEXT,
    "descriptionQanjobal" TEXT,
    "communityOrgId" TEXT,

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialServices" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" "SocialServiceCategory" NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "addressLine" TEXT,
    "city" TEXT,
    "state" TEXT,
    "description" TEXT,
    "url" TEXT,
    "titleAudioFilename" TEXT,
    "titleAudioFileSize" INTEGER,
    "titleAudioFileS3Key" TEXT,
    "descriptionAudioFilename" TEXT,
    "descriptionAudioFileSize" INTEGER,
    "descriptionAudioFileS3Key" TEXT,
    "communityOrgId" TEXT,

    CONSTRAINT "SocialServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" SERIAL NOT NULL,
    "titleEnglish" TEXT NOT NULL,
    "titleQanjobal" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessContactEmail" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "acceptedLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "locationType" "LocationType" NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "descriptionEnglish" TEXT NOT NULL,
    "descriptionQanjobal" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "communityOrgId" TEXT,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityOrg_name_key" ON "CommunityOrg"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_clerkId_key" ON "AdminUser"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_clerkId_key" ON "AppUser"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_username_key" ON "AppUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SocialServices_phone_number_key" ON "SocialServices"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "SocialServices_url_key" ON "SocialServices"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Jobs_url_key" ON "Jobs"("url");

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_communityOrgId_fkey" FOREIGN KEY ("communityOrgId") REFERENCES "CommunityOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_communityOrgId_fkey" FOREIGN KEY ("communityOrgId") REFERENCES "CommunityOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialServices" ADD CONSTRAINT "SocialServices_communityOrgId_fkey" FOREIGN KEY ("communityOrgId") REFERENCES "CommunityOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_communityOrgId_fkey" FOREIGN KEY ("communityOrgId") REFERENCES "CommunityOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;
