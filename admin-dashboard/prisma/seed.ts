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
    {
      titleEnglish: "Understanding Health Insurance",
      titleQanjobal: "Yojtakk'ulal Seguro Yet' Unin",
      topic: VideoTopic.MEDICAL,
      url: "https://www.youtube.com/watch?v=video8_medical_insurance",
      uploadDate: new Date("2025-01-20T12:00:00Z"),
      descriptionEnglish:
        "Learn about different types of health insurance and how to apply.",
      descriptionQanjobal:
        "Yojtakk'ulal diferentes tipos yet' seguro yet' unin.",
    },
    {
      titleEnglish: "Filing Your Taxes",
      titleQanjobal: "Yalel A Impuestos",
      topic: VideoTopic.LEGAL,
      url: "https://www.youtube.com/watch?v=video9_legal_taxes",
      uploadDate: new Date("2025-02-01T14:30:00Z"),
      descriptionEnglish:
        "Step-by-step guide to filing your annual tax return.",
      descriptionQanjobal: "B'eyb'al yet' yalel a impuestos anuales.",
    },
    {
      titleEnglish: "Job Search Strategies",
      titleQanjobal: "Estrategias Yet' B'eyal Mulnaj",
      topic: VideoTopic.CAREER,
      url: "https://www.youtube.com/watch?v=video10_career_search",
      uploadDate: new Date("2025-02-15T09:30:00Z"),
      descriptionEnglish:
        "Effective strategies for finding job opportunities in your area.",
      descriptionQanjobal:
        "Estrategias efectivas yet' b'eyal oportunidades yet' mulnaj.",
    },
    {
      titleEnglish: "Applying for Food Assistance",
      titleQanjobal: "Yalel Solicitud Yet' Ayuda Yet' Wa'",
      topic: VideoTopic.OTHER,
      url: "https://www.youtube.com/watch?v=video11_other_food",
      uploadDate: new Date("2025-03-01T10:15:00Z"),
      descriptionEnglish:
        "How to apply for SNAP benefits and other food assistance programs.",
      descriptionQanjobal:
        "Yalel solicitud yet' beneficios SNAP yet' otros programas.",
    },
    {
      titleEnglish: "Getting a Driver's License",
      titleQanjobal: "Yalel Licencia Yet' Manejo",
      topic: VideoTopic.TRANSPORT,
      url: "https://www.youtube.com/watch?v=video12_transport_license",
      uploadDate: new Date("2025-03-15T11:00:00Z"),
      descriptionEnglish:
        "Requirements and steps for obtaining a driver's license.",
      descriptionQanjobal:
        "Requisitos yet' b'eyb'al yet' licencia yet' manejo.",
    },
    {
      titleEnglish: "Understanding Your Rights at Work",
      titleQanjobal: "Yojtakk'ulal A B'aq'il Ti' Mulnaj",
      topic: VideoTopic.LEGAL,
      url: "https://www.youtube.com/watch?v=video13_legal_work",
      uploadDate: new Date("2025-04-01T13:45:00Z"),
      descriptionEnglish:
        "Learn about worker rights and workplace protections.",
      descriptionQanjobal:
        "Yojtakk'ulal b'aq'il yet' trabajadores yet' protecciones.",
    },
    {
      titleEnglish: "Emergency Room vs Urgent Care",
      titleQanjobal: "Sala de Emergencias vs Cuidado Urgente",
      topic: VideoTopic.MEDICAL,
      url: "https://www.youtube.com/watch?v=video14_medical_er",
      uploadDate: new Date("2025-04-20T15:00:00Z"),
      descriptionEnglish:
        "Understanding when to go to the ER versus urgent care.",
      descriptionQanjobal:
        "Yojtakk'ulal b'ar a chi ti' sala de emergencias o cuidado urgente.",
    },
    {
      titleEnglish: "Financial Literacy Basics",
      titleQanjobal: "Fundamentos Yet' Educación Financiera",
      topic: VideoTopic.OTHER,
      url: "https://www.youtube.com/watch?v=video15_other_finance",
      uploadDate: new Date("2025-05-05T08:30:00Z"),
      descriptionEnglish: "Learn basic budgeting and saving strategies.",
      descriptionQanjobal:
        "Yojtakk'ulal presupuesto básico yet' estrategias yet' ahorro.",
    },
    {
      titleEnglish: "College Application Process",
      titleQanjobal: "Proceso Yet' Solicitud Yet' Universidad",
      topic: VideoTopic.EDUCATION,
      url: "https://www.youtube.com/watch?v=video16_education_college",
      uploadDate: new Date("2025-05-25T10:00:00Z"),
      descriptionEnglish:
        "Guide to applying for college including financial aid.",
      descriptionQanjobal:
        "B'eyb'al yet' solicitud yet' universidad yet' ayuda financiera.",
    },
    {
      titleEnglish: "Networking for Career Success",
      titleQanjobal: "Redes Yet' Éxito Profesional",
      topic: VideoTopic.CAREER,
      url: "https://www.youtube.com/watch?v=video17_career_networking",
      uploadDate: new Date("2025-06-10T14:15:00Z"),
      descriptionEnglish:
        "How to build professional connections and network effectively.",
      descriptionQanjobal:
        "Yalel conexiones profesionales yet' redes efectivas.",
    },
    {
      titleEnglish: "Using Public Libraries",
      titleQanjobal: "Yalel Bibliotecas Públicas",
      topic: VideoTopic.EDUCATION,
      url: "https://www.youtube.com/watch?v=video18_education_library",
      uploadDate: new Date("2025-06-25T09:00:00Z"),
      descriptionEnglish:
        "How to get a library card and access free resources.",
      descriptionQanjobal:
        "Yalel tarjeta yet' biblioteca yet' recursos gratuitos.",
    },
    {
      titleEnglish: "Navigating Immigration Services",
      titleQanjobal: "Navegando Servicios de Inmigración",
      topic: VideoTopic.LEGAL,
      url: "https://www.youtube.com/watch?v=video19_legal_immigration",
      uploadDate: new Date("2025-07-10T11:30:00Z"),
      descriptionEnglish:
        "Understanding immigration processes and where to get help.",
      descriptionQanjobal:
        "Yojtakk'ulal procesos yet' inmigración yet' b'ar oj a cha' colpal.",
    },
    {
      titleEnglish: "Mental Health Resources",
      titleQanjobal: "Recursos Yet' Salud Mental",
      topic: VideoTopic.MEDICAL,
      url: "https://www.youtube.com/watch?v=video20_medical_mental",
      uploadDate: new Date("2025-07-25T13:00:00Z"),
      descriptionEnglish:
        "Where to find mental health support and counseling services.",
      descriptionQanjobal:
        "B'ar oj a cha' apoyo yet' salud mental yet' servicios de consejería.",
    },
    {
      titleEnglish: "Opening a Bank Account",
      titleQanjobal: "Yalel Jun Cuenta Bancaria",
      topic: VideoTopic.OTHER,
      url: "https://www.youtube.com/watch?v=video21_other_banking",
      uploadDate: new Date("2025-08-05T10:45:00Z"),
      descriptionEnglish:
        "Steps to open your first bank account and manage your money.",
      descriptionQanjobal:
        "B'eyb'al yet' yalel primera cuenta bancaria yet' manejar a pwaq.",
    },
    {
      titleEnglish: "Car Insurance Basics",
      titleQanjobal: "Fundamentos Yet' Seguro Yet' Carro",
      topic: VideoTopic.TRANSPORT,
      url: "https://www.youtube.com/watch?v=video22_transport_insurance",
      uploadDate: new Date("2025-08-20T12:00:00Z"),
      descriptionEnglish:
        "Understanding car insurance requirements and how to get coverage.",
      descriptionQanjobal:
        "Yojtakk'ulal requisitos yet' seguro yet' carro yet' yalel cobertura.",
    },
    {
      titleEnglish: "Workplace Safety Training",
      titleQanjobal: "Capacitación Yet' Seguridad Ti' Trabajo",
      topic: VideoTopic.CAREER,
      url: "https://www.youtube.com/watch?v=video23_career_safety",
      uploadDate: new Date("2025-09-01T09:15:00Z"),
      descriptionEnglish: "Essential workplace safety practices and protocols.",
      descriptionQanjobal:
        "Prácticas esenciales yet' seguridad ti' trabajo yet' protocolos.",
    },
    {
      titleEnglish: "Understanding Prescription Medications",
      titleQanjobal: "Yojtakk'ulal Medicamentos Con Receta",
      topic: VideoTopic.MEDICAL,
      url: "https://www.youtube.com/watch?v=video24_medical_meds",
      uploadDate: new Date("2025-09-15T14:30:00Z"),
      descriptionEnglish:
        "How to read prescriptions and take medications safely.",
      descriptionQanjobal:
        "Yalel lectura yet' recetas yet' tomar medicamentos con seguridad.",
    },
    {
      titleEnglish: "Finding Affordable Housing",
      titleQanjobal: "B'eyal Vivienda Accesible",
      topic: VideoTopic.OTHER,
      url: "https://www.youtube.com/watch?v=video25_other_housing",
      uploadDate: new Date("2025-09-30T11:00:00Z"),
      descriptionEnglish:
        "Resources and tips for finding affordable rental housing.",
      descriptionQanjobal:
        "Recursos yet' consejos yet' b'eyal vivienda accesible.",
    },
  ];

  for (const video of videosData) {
    await prisma.videos.upsert({
      where: { urls: [video.url] },
      update: {},
      create: {
        ...video,
        audioFile: audioBuffer,
        audioFilename: "sample.mp3",
        audioFileSize: audioBuffer.length,
      },
    });
  }
  console.log("Successfully seeded 25 videos.");

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
    {
      title: "Safe Haven Women's Shelter",
      category: SocialServiceCategory.SHELTERS,
      phone_number: "212-555-0107",
      address: "45 Protection Lane, Metro City",
      description:
        "Emergency shelter for women and children fleeing domestic violence.",
      url: "https://www.safehavenwomen.org",
    },
    {
      title: "Meals on Wheels Metro",
      category: SocialServiceCategory.FOOD,
      phone_number: "212-555-0108",
      address: "67 Care Street, Metro City",
      description:
        "Home-delivered meals for seniors and individuals with disabilities.",
      url: "https://www.mealsonwheelsmetro.org",
    },
    {
      title: "Free Ride Shuttle Service",
      category: SocialServiceCategory.TRANSPORTATION,
      phone_number: "212-555-0109",
      address: "89 Transit Way, Metro City",
      description:
        "Free transportation to medical appointments for low-income residents.",
      url: "https://www.freerideshuttle.org",
    },
    {
      title: "Crisis Text Line",
      category: SocialServiceCategory.EMERGENCIA,
      phone_number: "741741",
      address: "N/A",
      description: "24/7 text-based crisis support. Text HOME to 741741.",
      url: "https://www.crisistextline.org",
    },
    {
      title: "Community Legal Aid Center",
      category: SocialServiceCategory.OTHER,
      phone_number: "212-555-0110",
      address: "12 Justice Avenue, Metro City",
      description:
        "Free legal assistance for housing, family law, and immigration matters.",
      url: "https://www.communitylegal.org",
    },
    {
      title: "Second Harvest Food Bank",
      category: SocialServiceCategory.FOOD,
      phone_number: "212-555-0111",
      address: "34 Harvest Road, Metro City",
      description:
        "Food distribution center serving multiple pantries across the city.",
      url: "https://www.secondharvestmetro.org",
    },
    {
      title: "Veterans' Resource Center",
      category: SocialServiceCategory.SHELTERS,
      phone_number: "212-555-0112",
      address: "56 Honor Boulevard, Metro City",
      description: "Housing, employment, and healthcare support for veterans.",
      url: "https://www.veteransresource.org",
    },
    {
      title: "Bike Share Program",
      category: SocialServiceCategory.TRANSPORTATION,
      phone_number: "212-555-0113",
      address: "Multiple locations citywide",
      description:
        "Affordable bike rental program with discounts for low-income residents.",
      url: "https://www.metrobikeshare.com",
    },
    {
      title: "Domestic Violence Hotline",
      category: SocialServiceCategory.EMERGENCIA,
      phone_number: "1-800-799-7233",
      address: "N/A",
      description: "National domestic violence hotline available 24/7.",
      url: "https://www.thehotline.org",
    },
    {
      title: "Family Promise Shelter Network",
      category: SocialServiceCategory.SHELTERS,
      phone_number: "212-555-0114",
      address: "78 Family Lane, Metro City",
      description: "Rotating shelter program for families with children.",
      url: "https://www.familypromisemetro.org",
    },
    {
      title: "Weekend Breakfast Club",
      category: SocialServiceCategory.FOOD,
      phone_number: "212-555-0115",
      address: "90 Community Center Drive, Metro City",
      description:
        "Free weekend breakfast for children and families every Saturday and Sunday.",
      url: "https://www.weekendbreakfastclub.org",
    },
    {
      title: "Accessible Transit Services",
      category: SocialServiceCategory.TRANSPORTATION,
      phone_number: "212-555-0116",
      address: "11 Access Road, Metro City",
      description:
        "Door-to-door transportation for individuals with disabilities.",
      url: "https://www.accessibletransitmetro.com",
    },
    {
      title: "Poison Control Center",
      category: SocialServiceCategory.EMERGENCIA,
      phone_number: "1-800-222-1222",
      address: "N/A",
      description: "24/7 poison emergency hotline with expert guidance.",
      url: "https://www.poison.org",
    },
    {
      title: "Immigrant Welcome Center",
      category: SocialServiceCategory.OTHER,
      phone_number: "212-555-0117",
      address: "22 Welcome Street, Metro City",
      description:
        "Support services for new immigrants including ESL classes and job placement.",
      url: "https://www.immigrantwelcome.org",
    },
    {
      title: "Children's Lunch Program",
      category: SocialServiceCategory.FOOD,
      phone_number: "212-555-0118",
      address: "44 School Lane, Metro City",
      description: "Free lunch for children during school breaks and summer.",
      url: "https://www.childrenlunchprogram.org",
    },
    {
      title: "Transitional Housing Alliance",
      category: SocialServiceCategory.SHELTERS,
      phone_number: "212-555-0119",
      address: "66 Transition Way, Metro City",
      description:
        "Long-term housing assistance for individuals moving out of homelessness.",
      url: "https://www.transhousingalliance.org",
    },
    {
      title: "Senior Transportation Network",
      category: SocialServiceCategory.TRANSPORTATION,
      phone_number: "212-555-0120",
      address: "88 Senior Circle, Metro City",
      description:
        "Volunteer driver program for seniors needing rides to appointments.",
      url: "https://www.seniortransportnet.org",
    },
  ];

  for (const service of socialServicesData) {
    await prisma.socialServices.upsert({
      where: { phone_number: service.phone_number },
      update: {},
      create: service,
    });
  }
  console.log("Successfully seeded 25 social services.");

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
    {
      titleEnglish: "Customer Service Representative",
      titleQanjobal: "Representante de Servicio al Cliente",
      companyName: "HelpDesk Pro",
      businessContactEmail: "careers@helpdeskpro.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.REMOTE,
      city: "Miami",
      state: "Florida",
      url: "https://helpdeskpro.com/jobs/customer-service-rep-1",
      salary: 42000,
      expirationDate: new Date("2025-10-15"),
      descriptionEnglish:
        "Remote customer service position. Must be bilingual in English and Spanish. Full training provided.",
      descriptionQanjobal:
        "Mulnaj remoto yet' servicio al cliente. K'ulal bilingüe.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Delivery Driver",
      titleQanjobal: "Conductor de Entregas",
      companyName: "QuickDeliver Express",
      businessContactEmail: "hiring@quickdeliver.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Houston",
      state: "Texas",
      url: "https://quickdeliver.com/jobs/delivery-driver-9",
      salary: 40000,
      expirationDate: new Date("2025-11-20"),
      descriptionEnglish:
        "Delivery driver needed for local routes. Valid driver's license required. Flexible schedule.",
      descriptionQanjobal:
        "Conductor yet' entregas. Licencia válida k'ulal. Horario flexible.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Retail Sales Associate",
      titleQanjobal: "Asociado de Ventas al Por Menor",
      companyName: "Fashion Forward",
      businessContactEmail: "jobs@fashionforward.com",
      jobType: JobType.PARTTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.INPERSON,
      city: "New York",
      state: "New York",
      url: "https://fashionforward.com/careers/sales-associate-10",
      salary: 28000,
      expirationDate: new Date("2025-08-30"),
      descriptionEnglish:
        "Part-time retail position in downtown location. Weekend availability required.",
      descriptionQanjobal:
        "Mulnaj medio tiempo yet' ventas. Disponibilidad yet' fin de semana k'ulal.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Administrative Assistant",
      titleQanjobal: "Asistente Administrativo",
      companyName: "Corporate Solutions Inc.",
      businessContactEmail: "hr@corpsolutions.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English"],
      locationType: LocationType.HYBRID,
      city: "Boston",
      state: "Massachusetts",
      url: "https://corpsolutions.com/jobs/admin-assistant-11",
      salary: 48000,
      expirationDate: new Date("2025-09-15"),
      descriptionEnglish:
        "Administrative assistant needed for busy office. Strong organizational skills required.",
      descriptionQanjobal:
        "Asistente administrativo yet' oficina ocupada. Habilidades organizacionales k'ulal.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Landscaping Crew Member",
      titleQanjobal: "Miembro del Equipo de Jardinería",
      companyName: "GreenScape Landscaping",
      businessContactEmail: "jobs@greenscape.com",
      jobType: JobType.SEASONAL,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Portland",
      state: "Oregon",
      url: "https://greenscape.com/jobs/landscaping-crew-12",
      salary: 36000,
      expirationDate: new Date("2025-07-31"),
      descriptionEnglish:
        "Seasonal landscaping position. Experience preferred but will train. Outdoor work.",
      descriptionQanjobal:
        "Mulnaj temporal yet' jardinería. Experiencia preferida pero colonab'il.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Medical Assistant",
      titleQanjobal: "Asistente Médico",
      companyName: "Community Health Clinic",
      businessContactEmail: "careers@communityhealthclinic.org",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.INPERSON,
      city: "San Diego",
      state: "California",
      url: "https://communityhealthclinic.org/jobs/medical-assistant-13",
      salary: 44000,
      expirationDate: new Date("2025-10-30"),
      descriptionEnglish:
        "Medical assistant for community clinic. Certification preferred. Bilingual preferred.",
      descriptionQanjobal:
        "Asistente médico yet' clínica comunitaria. Certificación preferida.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Night Shift Security Guard",
      titleQanjobal: "Guardia de Seguridad Turno Nocturno",
      companyName: "SecureWatch Security",
      businessContactEmail: "hiring@securewatch.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.INPERSON,
      city: "Las Vegas",
      state: "Nevada",
      url: "https://securewatch.com/jobs/night-security-14",
      salary: 38000,
      expirationDate: new Date("2025-11-10"),
      descriptionEnglish:
        "Night shift security guard needed for commercial property. Clean background check required.",
      descriptionQanjobal:
        "Guardia de seguridad turno nocturno. Antecedentes limpios k'ulal.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Cook/Chef",
      titleQanjobal: "Cocinero/Chef",
      companyName: "Bella Cucina Restaurant",
      businessContactEmail: "jobs@bellacucina.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Chicago",
      state: "Illinois",
      url: "https://bellacucina.com/careers/cook-15",
      salary: 46000,
      expirationDate: new Date("2025-09-25"),
      descriptionEnglish:
        "Experienced cook needed for Italian restaurant. Evening shifts. Competitive pay.",
      descriptionQanjobal:
        "Cocinero con experiencia yet' restaurante italiano. Turnos yet' noche.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Hotel Housekeeper",
      titleQanjobal: "Empleado de Limpieza de Hotel",
      companyName: "Grand Plaza Hotel",
      businessContactEmail: "hr@grandplazahotel.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Orlando",
      state: "Florida",
      url: "https://grandplazahotel.com/jobs/housekeeper-16",
      salary: 32000,
      expirationDate: new Date("2025-08-20"),
      descriptionEnglish:
        "Housekeeper for busy hotel. Day shift available. Benefits included.",
      descriptionQanjobal:
        "Empleado de limpieza yet' hotel. Turno de día disponible. Beneficios incluidos.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Childcare Provider",
      titleQanjobal: "Proveedor de Cuidado Infantil",
      companyName: "Little Stars Daycare",
      businessContactEmail: "careers@littlestarsdaycare.com",
      jobType: JobType.PARTTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.INPERSON,
      city: "Denver",
      state: "Colorado",
      url: "https://littlestarsdaycare.com/jobs/childcare-provider-17",
      salary: 30000,
      expirationDate: new Date("2025-10-05"),
      descriptionEnglish:
        "Part-time childcare provider. Experience with young children required. CPR certification preferred.",
      descriptionQanjobal:
        "Proveedor de cuidado infantil medio tiempo. Experiencia con niños k'ulal.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Factory Assembly Worker",
      titleQanjobal: "Trabajador de Ensamblaje de Fábrica",
      companyName: "Precision Manufacturing",
      businessContactEmail: "jobs@precisionmfg.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Detroit",
      state: "Michigan",
      url: "https://precisionmfg.com/jobs/assembly-worker-18",
      salary: 42000,
      expirationDate: new Date("2025-12-15"),
      descriptionEnglish:
        "Assembly line worker for manufacturing facility. Multiple shifts available. Training provided.",
      descriptionQanjobal:
        "Trabajador de línea de ensamblaje. Múltiples turnos disponibles. Entrenamiento proporcionado.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Pharmacy Technician Intern",
      titleQanjobal: "Practicante de Técnico de Farmacia",
      companyName: "HealthFirst Pharmacy",
      businessContactEmail: "internships@healthfirstpharmacy.com",
      jobType: JobType.INTERNSHIP,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.INPERSON,
      city: "Philadelphia",
      state: "Pennsylvania",
      url: "https://healthfirstpharmacy.com/jobs/pharm-tech-intern-19",
      salary: 22000,
      expirationDate: new Date("2025-06-15"),
      descriptionEnglish:
        "Pharmacy technician internship. Great opportunity for students pursuing pharmacy careers.",
      descriptionQanjobal:
        "Práctica de técnico de farmacia. Gran oportunidad yet' estudiantes.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Freelance Translator",
      titleQanjobal: "Traductor Independiente",
      companyName: "Global Communications LLC",
      businessContactEmail: "projects@globalcomm.com",
      jobType: JobType.FREELANCE,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.REMOTE,
      city: "Remote",
      state: "Various",
      url: "https://globalcomm.com/freelance/translator-20",
      salary: 55000,
      expirationDate: new Date("2025-11-30"),
      descriptionEnglish:
        "Freelance translator for Spanish/Q'anjob'al to English. Flexible hours. Remote work.",
      descriptionQanjobal:
        "Traductor independiente. Horario flexible. Trabajo remoto.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Janitorial Services",
      titleQanjobal: "Servicios de Conserjería",
      companyName: "Clean Pro Services",
      businessContactEmail: "hiring@cleanproservices.com",
      jobType: JobType.PARTTIME,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Atlanta",
      state: "Georgia",
      url: "https://cleanproservices.com/jobs/janitorial-21",
      salary: 26000,
      expirationDate: new Date("2025-07-15"),
      descriptionEnglish:
        "Part-time janitorial position for office buildings. Evening hours. No experience required.",
      descriptionQanjobal:
        "Mulnaj medio tiempo yet' conserjería. Horario nocturno. Sin experiencia necesaria.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Personal Trainer",
      titleQanjobal: "Entrenador Personal",
      companyName: "FitLife Gym",
      businessContactEmail: "careers@fitlifegym.com",
      jobType: JobType.PARTTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.INPERSON,
      city: "San Francisco",
      state: "California",
      url: "https://fitlifegym.com/jobs/personal-trainer-22",
      salary: 38000,
      expirationDate: new Date("2025-09-10"),
      descriptionEnglish:
        "Part-time personal trainer. Certification required. Flexible schedule.",
      descriptionQanjobal:
        "Entrenador personal medio tiempo. Certificación k'ulal. Horario flexible.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Farm Worker",
      titleQanjobal: "Trabajador Agrícola",
      companyName: "Green Valley Farms",
      businessContactEmail: "jobs@greenvalleyfarms.com",
      jobType: JobType.SEASONAL,
      acceptedLanguages: ["Non-English", "Spanish", "Q'anjob'al"],
      locationType: LocationType.INPERSON,
      city: "Fresno",
      state: "California",
      url: "https://greenvalleyfarms.com/jobs/farm-worker-23",
      salary: 34000,
      expirationDate: new Date("2025-10-31"),
      descriptionEnglish:
        "Seasonal farm worker for harvest season. Housing provided. Experienced preferred.",
      descriptionQanjobal:
        "Trabajador agrícola temporal. Vivienda proporcionada. Experiencia preferida.",
      status: JobStatus.ARCHIVED,
    },
    {
      titleEnglish: "Sales Representative",
      titleQanjobal: "Representante de Ventas",
      companyName: "TechPro Solutions",
      businessContactEmail: "sales@techprosolutions.com",
      jobType: JobType.FULLTIME,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.HYBRID,
      city: "Dallas",
      state: "Texas",
      url: "https://techprosolutions.com/jobs/sales-rep-24",
      salary: 65000,
      expirationDate: new Date("2025-12-01"),
      descriptionEnglish:
        "B2B sales representative. Commission plus base salary. Company car provided.",
      descriptionQanjobal:
        "Representante de ventas B2B. Comisión más salario base. Carro de empresa proporcionado.",
      status: JobStatus.ACTIVE,
    },
    {
      titleEnglish: "Event Coordinator",
      titleQanjobal: "Coordinador de Eventos",
      companyName: "Premier Events Co.",
      businessContactEmail: "careers@premierevents.com",
      jobType: JobType.TEMPORARY,
      acceptedLanguages: ["Non-English", "Spanish"],
      locationType: LocationType.INPERSON,
      city: "Nashville",
      state: "Tennessee",
      url: "https://premierevents.com/jobs/event-coordinator-25",
      salary: 44000,
      expirationDate: new Date("2025-08-05"),
      descriptionEnglish:
        "Temporary event coordinator for summer season. Event planning experience required.",
      descriptionQanjobal:
        "Coordinador de eventos temporal. Experiencia en planificación k'ulal.",
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
