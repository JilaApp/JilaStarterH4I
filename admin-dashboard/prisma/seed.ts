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

const prisma = new PrismaClient();

async function main() {
  console.log("Starting the seeding process...");

  console.log("Seeding videos...");
  const audioPath = path.join(__dirname, "sample.mp3");

  const audioBuffer = fs.readFileSync(audioPath);

  const videosData = [
    {
      titleEnglish: "How to Use the City Bus System",
      titleQanjobal: "Yalel B'eyb'al Yet' Autobus Yet' Konob'",
      topic: VideoTopic.TRANSPORT,
      url: "https://www.youtube.com/watch?v=video1_transport",
      uploadDate: new Date("2025-01-15T10:00:00Z"),
      descriptionEnglish:
        "A step-by-step guide to reading bus schedules and paying fares.",
      descriptionQanjobal:
        "Jun b'eyb'al yet' yalel sk'exel horario yet' autobús yet' stojol.",
    },
    {
      titleEnglish: "Know Your Tenant Rights",
      titleQanjobal: "Yojtakk'ulal A B'aq'il Yet' Naj",
      topic: VideoTopic.LEGAL,
      url: "https://www.youtube.com/watch?v=video2_legal",
      uploadDate: new Date("2025-02-20T11:30:00Z"),
      descriptionEnglish:
        "Learn about your rights as a renter and where to find legal help.",
      descriptionQanjobal:
        "Yojtakk'ulal a b'aq'il yet' naj yet' b'ar oj a cha' a colpal legal.",
    },
    {
      titleEnglish: "Scheduling a Doctor's Appointment",
      titleQanjobal: "Yalel Jun Cita Yet' Unin",
      topic: VideoTopic.MEDICAL,
      url: "https://www.youtube.com/watch?v=video3_medical",
      uploadDate: new Date("2025-03-10T09:00:00Z"),
      descriptionEnglish:
        "A simple guide on how to call and schedule a medical appointment.",
      descriptionQanjobal:
        "Jun b'eyb'al sencillo yet' yalel jun cita yet' unin.",
    },
    {
      titleEnglish: "How to Write a Resume",
      titleQanjobal: "Yalel Tz'ib'anel Jun Curriculum",
      topic: VideoTopic.CAREER,
      url: "https://www.youtube.com/watch?v=video4_career",
      uploadDate: new Date("2025-04-05T14:00:00Z"),
      descriptionEnglish:
        "Tips and tricks for creating a professional resume to land a job.",
      descriptionQanjobal:
        "Consejos yet' trucos yet' tz'ib'anel jun curriculum profesional yet' a cha' a mulnaj.",
    },
    {
      titleEnglish: "Enrolling Your Child in School",
      titleQanjobal: "Yalel Sk'exel Unin Ti' Escuela",
      topic: VideoTopic.EDUCATION,
      url: "https://www.youtube.com/watch?v=video5_education",
      uploadDate: new Date("2025-05-22T08:45:00Z"),
      descriptionEnglish:
        "A guide to the documents and steps needed for school enrollment.",
      descriptionQanjobal:
        "Jun b'eyb'al yet' documentos yet' b'eyb'al sk'exel unin ti' escuela.",
    },
    {
      titleEnglish: "Interview Preparation Tips",
      titleQanjobal: "Consejos Yet' Preparación Yet' Entrevista",
      topic: VideoTopic.CAREER,
      url: "https://www.youtube.com/watch?v=video6_career_prep",
      uploadDate: new Date("2025-06-18T16:00:00Z"),
      descriptionEnglish:
        "How to prepare for common interview questions and make a good impression.",
      descriptionQanjobal:
        "Yalel a b'a yet' preguntas comunes yet' entrevista yet' a watx' k'ulal.",
    },
    {
      titleEnglish: "Community Resources Overview",
      titleQanjobal: "Slolonej Slak'olal Recursos Yet' Komon",
      topic: VideoTopic.OTHER,
      url: "https://www.youtube.com/watch?v=video7_other",
      uploadDate: new Date("2025-07-02T13:15:00Z"),
      descriptionEnglish:
        "An overview of various community support programs available to you.",
      descriptionQanjobal:
        "Jun slolonej slak'olal programas yet' komon yul a disposición.",
    },
  ];

  for (const video of videosData) {
    await prisma.videos.upsert({
      where: { url: video.url },
      update: {},
      create: {
        ...video,
        audioFile: audioBuffer,
        audioFilename: "sample.mp3",
        audioFileSize: audioBuffer.length,
      },
    });
  }
  console.log("Successfully seeded 7 videos.");

  console.log("Seeding social services...");
  const socialServicesData = [
    {
      title: "City Emergency Services",
      category: SocialServiceCategory.EMERGENCIA,
      phone_number: "911",
      address: "N/A",
      description:
        "Emergency services for immediate police, fire, or medical needs.",
      url: "https://www.911.gov",
    },
    {
      title: "Hope House Family Shelter",
      category: SocialServiceCategory.SHELTERS,
      phone_number: "212-555-0101",
      address: "123 Charity Lane, Metro City",
      description:
        "Overnight shelter and support for families experiencing homelessness.",
      url: "https://www.hopehouse.org",
    },
    {
      title: "The Community Food Pantry",
      category: SocialServiceCategory.FOOD,
      phone_number: "212-555-0102",
      address: "456 Giving Street, Metro City",
      description:
        "Provides weekly grocery packages for low-income individuals and families.",
      url: "https://www.metrofoodpantry.org",
    },
    {
      title: "Metro City Transit Authority",
      category: SocialServiceCategory.TRANSPORTATION,
      phone_number: "212-555-0103",
      address: "789 Station Road, Metro City",
      description:
        "Public transportation services including buses and subways.",
      url: "https://www.metrocitytransit.com",
    },
    {
      title: "United Migrant Support Services",
      category: SocialServiceCategory.OTHER,
      phone_number: "212-555-0104",
      address: "101 Unity Plaza, Metro City",
      description:
        "Comprehensive support including legal aid and language classes for migrants.",
      url: "https://www.unitedmigrants.org",
    },
    {
      title: "Downtown Soup Kitchen",
      category: SocialServiceCategory.FOOD,
      phone_number: "212-555-0105",
      address: "22 Warmth Ave, Metro City",
      description:
        "Serves hot meals daily for lunch and dinner, no questions asked.",
      url: "https://www.downtownsoup.org",
    },
    {
      title: "Youth Haven Center",
      category: SocialServiceCategory.SHELTERS,
      phone_number: "212-555-0106",
      address: "33 Safe Place, Metro City",
      description:
        "A dedicated shelter for at-risk youth and young adults aged 16-24.",
      url: "https://www.youthhaven.org",
    },
    {
      title: "Non-Emergency Help Line",
      category: SocialServiceCategory.EMERGENCIA,
      phone_number: "311",
      address: "N/A",
      description: "For non-emergency city services and information.",
      url: "https://www.metrocity.gov/311",
    },
  ];

  for (const service of socialServicesData) {
    await prisma.socialServices.upsert({
      where: { phone_number: service.phone_number },
      update: {},
      create: service,
    });
  }
  console.log("Successfully seeded 8 social services.");

  console.log("Seeding job postings...");
  const jobsData = [
    {
      titleEnglish: "Software Engineer",
      titleQanjobal: "Ingeniero de Software",
      companyName: "Tech Solutions Inc.",
      businessContactEmail: "hiring@techsolutions.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.HYBRID,
      city: "San Francisco",
      state: "California",
      url: "https://techsolutions.com/jobs/software-engineer-1",
      salary: 120000,
      expirationDate: new Date("2025-12-31"),
      descriptionEnglish:
        "We are looking for a talented software engineer to join our team. Experience with React and Node.js required.",
      descriptionQanjobal:
        "Kaẍi q'omal jun ingeniero de software yul ka department. K'ulal yul React yet' Node.js.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Restaurant Server",
      titleQanjobal: "Mesero/a de Restaurante",
      companyName: "The Golden Plate",
      businessContactEmail: "jobs@goldenplate.com",
      jobType: JobType.PARTTIME,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Los Angeles",
      state: "California",
      url: "https://goldenplate.com/careers/server",
      salary: 35000,
      expirationDate: new Date("2025-06-30"),
      descriptionEnglish:
        "Join our friendly team as a part-time server. No experience necessary, we will train. Bilingual speakers encouraged to apply.",
      descriptionQanjobal:
        "Chex yul ka equipo. Man k'ulal mulnaj, oj ka colonab'il. K'ulal yul kab' k'anel.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Construction Worker",
      titleQanjobal: "Trabajador de Construcción",
      companyName: "Metro Builders LLC",
      businessContactEmail: "careers@metrobuilders.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Austin",
      state: "Texas",
      url: "https://metrobuilders.com/jobs/construction-worker",
      salary: 45000,
      expirationDate: new Date("2025-08-15"),
      descriptionEnglish:
        "Seeking experienced construction workers for residential projects. Must be able to work outdoors and lift heavy materials.",
      descriptionQanjobal:
        "Kaẍi q'omal trabajadores yet' construcción. K'ulal mulnaj yul construcción.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Data Entry Clerk",
      titleQanjobal: "Oficinista de Entrada de Datos",
      companyName: "AdminPro Services",
      businessContactEmail: "hr@adminpro.com",
      jobType: JobType.TEMPORARY,
      acceptedLanguages: ["Non-English"],
      locationType: LocationType.REMOTE,
      city: "New York",
      state: "New York",
      url: "https://adminpro.com/jobs/data-entry-temp",
      salary: 38000,
      expirationDate: new Date("2025-05-01"),
      descriptionEnglish:
        "Temporary position for data entry work. 3-month contract with possibility of extension. Work from home.",
      descriptionQanjobal:
        "Mulnaj temporal yet' entrada de datos. 3 mes yet' contrato.",
      status: JobStatus.ARCHIVED,
    },
    {
      titleEnglish: "Marketing Intern",
      titleQanjobal: "Practicante de Marketing",
      companyName: "Bright Future Marketing",
      businessContactEmail: "internships@brightfuture.com",
      jobType: JobType.INTERNSHIP,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.HYBRID,
      city: "Chicago",
      state: "Illinois",
      url: "https://brightfuture.com/careers/marketing-intern",
      salary: 25000,
      expirationDate: new Date("2025-09-30"),
      descriptionEnglish:
        "Paid internship opportunity for students interested in digital marketing. Flexible schedule.",
      descriptionQanjobal:
        "Oportunidad yet' práctica yet' estudiantes. Horario flexible.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Freelance Graphic Designer",
      titleQanjobal: "Diseñador Gráfico Independiente",
      companyName: "Creative Studio Co.",
      businessContactEmail: "projects@creativestudio.com",
      jobType: JobType.FREELANCE,
      acceptedLanguages: ["Non-English"],
      locationType: LocationType.REMOTE,
      city: "Seattle",
      state: "Washington",
      url: "https://creativestudio.com/freelance/graphic-designer",
      salary: 60000,
      expirationDate: new Date("2025-07-20"),
      descriptionEnglish:
        "Looking for talented freelance graphic designers for ongoing projects. Portfolio required.",
      descriptionQanjobal:
        "Kaẍi diseñadores gráficos yet' proyectos. Portfolio k'ulal.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Warehouse Associate",
      titleQanjobal: "Asociado de Almacén",
      companyName: "QuickShip Logistics",
      businessContactEmail: "jobs@quickship.com",
      jobType: JobType.SEASONAL,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Phoenix",
      state: "Arizona",
      url: "https://quickship.com/jobs/warehouse-seasonal",
      salary: 32000,
      expirationDate: new Date("2025-12-25"),
      descriptionEnglish:
        "Seasonal warehouse position for holiday season. Training provided. Evening and weekend shifts available.",
      descriptionQanjobal:
        "Mulnaj temporal yet' almacén. Oj ka colonab'il. Turnos yet' noche yet' fin de semana.",
      status: JobStatus.ARCHIVED,
    },
  ];

  for (const job of jobsData) {
    await prisma.jobs.upsert({
      where: { url: job.url },
      update: {},
      create: job,
    });
  }
  console.log("Successfully seeded 7 job postings.");

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
