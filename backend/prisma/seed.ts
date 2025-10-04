import prisma from "../lib/prisma";

async function main() {
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
