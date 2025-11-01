import fs from "fs";
import prisma from "../lib/prisma";
import path from "path";

async function main() {
  const audioPath = path.join(__dirname, "audio", "sample.mp3"); // your audio file
  const audioBuffer = fs.readFileSync(audioPath);
  const audioBytes = new Uint8Array(audioBuffer); // Prisma Bytes
  const response = await Promise.all([
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
