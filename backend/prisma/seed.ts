import fs from "fs";
import prisma from "../lib/prisma";
import path from "path";

async function main() {
  const audioPath = path.join(__dirname, "audio", "sample.mp3"); // your audio file
  const audioBuffer = fs.readFileSync(audioPath);
  const audioBytes = new Uint8Array(audioBuffer); // Prisma Bytes
  const response = await Promise.all([
    prisma.users.upsert({
      where: { email: "rauchg@vercel.com" },
      update: {},
      create: {
        name: "Guillermo Rauch",
        email: "rauchg@vercel.com",
        image:
          "https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg",
      },
    }),
    prisma.users.upsert({
      where: { email: "lee@vercel.com" },
      update: {},
      create: {
        name: "Lee Robinson",
        email: "lee@vercel.com",
        image:
          "https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg",
      },
    }),
    prisma.users.upsert({
      where: { email: "stey@vercel.com" },
      update: {},
      create: {
        name: "Steven Tey",
        email: "stey@vercel.com",
        image:
          "https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg",
      },
    }),
    prisma.videos.upsert({
      where: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      update: {},
      create: {
        titleEnglish: "A great video",
        titleQanjobal: "sigma",
        audioFile: audioBytes,
        topic: "TRANSPORT",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        uploadDate: new Date("2025-06-07T12:00:00Z"),
        descriptionEnglish:
          "An introduction to the intricacies of american culture. a delightful viewing for the entire family.",
        descriptionQanjobal: "lol",
      },
    }),
    prisma.videos.upsert({
      where: { url: "https://www.youtube.com/watch?v=VLeEX489tXE" },
      update: {},
      create: {
        titleEnglish: "Another great video",
        titleQanjobal: "sigma",
        audioFile: audioBytes,
        topic: "TRANSPORT",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        uploadDate: new Date("2025-06-07T12:00:00Z"),
        descriptionEnglish:
          "An introduction to the intricacies of american culture. a delightful viewing for the entire family.",
        descriptionQanjobal: "lol",
      },
    }),
  ]);
  console.log(response);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
