import prisma from "../lib/prisma";

async function main() {
  const response = await Promise.all([
    prisma.videos.upsert({
      where: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      update: {},
      create: {
        title: "A great video",
        category: "PROFESSIONAL_DEVELOPMENT",
        source: "YOUTUBE",
        length: 6767,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        uploadDate: new Date("2025-06-07T12:00:00Z"),
        description:
          "An introduction to the intricacies of american culture. a delightful viewing for the entire family.",
        likes: 100000,
        dislikes: 0,
        language: "English",
      },
    }),
    prisma.videos.upsert({
      where: { url: "https://www.youtube.com/watch?v=VLeEX489tXE" },
      update: {},
      create: {
        title: "some jila intro or something",
        category: "TRANSPORTATION",
        source: "YOUTUBE",
        length: 101,
        url: "https://www.youtube.com/watch?v=VLeEX489tXE",
        uploadDate: new Date("2025-06-07T12:00:00Z"),
        description: "a demonstration of the app thats really cool",
        likes: 5,
        dislikes: 0,
        language: "Qʼanjobʼal",
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
