import { VideoTopic } from "@prisma/client";

export const videosData = [
  {
    titleEnglish: "How to Use the City Bus System",
    titleQanjobal: "Yalel B'eyb'al Yet' Autobus Yet' Konob'",
    topic: VideoTopic.TRANSPORT,
    urls: ["https://www.youtube.com/watch?v=video1_transport", "https://www.youtube.com/watch?v=video1_transport"],
    durations: [420, 321],
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
    urls: ["https://www.youtube.com/watch?v=video2_legal"],
    durations: [540],
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
    urls: ["https://www.youtube.com/watch?v=video3_medical"],
    durations: [360],
    uploadDate: new Date("2025-03-10T09:00:00Z"),
    descriptionEnglish:
      "A simple guide on how to call and schedule a medical appointment.",
    descriptionQanjobal: "Jun b'eyb'al sencillo yet' yalel jun cita yet' unin.",
  },
  {
    titleEnglish: "How to Write a Resume",
    titleQanjobal: "Yalel Tz'ib'anel Jun Curriculum",
    topic: VideoTopic.CAREER,
    urls: ["https://www.youtube.com/watch?v=video4_career"],
    durations: [600],
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
    urls: ["https://www.youtube.com/watch?v=video5_education"],
    durations: [480],
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
    urls: ["https://www.youtube.com/watch?v=video6_career_prep"],
    durations: [720],
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
    urls: ["https://www.youtube.com/watch?v=video7_other"],
    durations: [660],
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
    urls: ["https://www.youtube.com/watch?v=video8_medical_insurance"],
    durations: [780],
    uploadDate: new Date("2025-01-20T12:00:00Z"),
    descriptionEnglish:
      "Learn about different types of health insurance and how to apply.",
    descriptionQanjobal: "Yojtakk'ulal diferentes tipos yet' seguro yet' unin.",
  },
  {
    titleEnglish: "Filing Your Taxes",
    titleQanjobal: "Yalel A Impuestos",
    topic: VideoTopic.LEGAL,
    urls: ["https://www.youtube.com/watch?v=video9_legal_taxes"],
    durations: [900],
    uploadDate: new Date("2025-02-01T14:30:00Z"),
    descriptionEnglish: "Step-by-step guide to filing your annual tax return.",
    descriptionQanjobal: "B'eyb'al yet' yalel a impuestos anuales.",
  },
  {
    titleEnglish: "Job Search Strategies",
    titleQanjobal: "Estrategias Yet' B'eyal Mulnaj",
    topic: VideoTopic.CAREER,
    urls: ["https://www.youtube.com/watch?v=video10_career_search"],
    durations: [510],
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
    urls: ["https://www.youtube.com/watch?v=video11_other_food"],
    durations: [450],
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
    urls: ["https://www.youtube.com/watch?v=video12_transport_license"],
    durations: [540],
    uploadDate: new Date("2025-03-15T11:00:00Z"),
    descriptionEnglish:
      "Requirements and steps for obtaining a driver's license.",
    descriptionQanjobal: "Requisitos yet' b'eyb'al yet' licencia yet' manejo.",
  },
  {
    titleEnglish: "Understanding Your Rights at Work",
    titleQanjobal: "Yojtakk'ulal A B'aq'il Ti' Mulnaj",
    topic: VideoTopic.LEGAL,
    urls: ["https://www.youtube.com/watch?v=video13_legal_work"],
    durations: [630],
    uploadDate: new Date("2025-04-01T13:45:00Z"),
    descriptionEnglish: "Learn about worker rights and workplace protections.",
    descriptionQanjobal:
      "Yojtakk'ulal b'aq'il yet' trabajadores yet' protecciones.",
  },
  {
    titleEnglish: "Emergency Room vs Urgent Care",
    titleQanjobal: "Sala de Emergencias vs Cuidado Urgente",
    topic: VideoTopic.MEDICAL,
    urls: ["https://www.youtube.com/watch?v=video14_medical_er"],
    durations: [390],
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
    urls: ["https://www.youtube.com/watch?v=video15_other_finance"],
    durations: [750],
    uploadDate: new Date("2025-05-05T08:30:00Z"),
    descriptionEnglish: "Learn basic budgeting and saving strategies.",
    descriptionQanjobal:
      "Yojtakk'ulal presupuesto básico yet' estrategias yet' ahorro.",
  },
  {
    titleEnglish: "College Application Process",
    titleQanjobal: "Proceso Yet' Solicitud Yet' Universidad",
    topic: VideoTopic.EDUCATION,
    urls: ["https://www.youtube.com/watch?v=video16_education_college"],
    durations: [840],
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
    urls: ["https://www.youtube.com/watch?v=video17_career_networking"],
    durations: [570],
    uploadDate: new Date("2025-06-10T14:15:00Z"),
    descriptionEnglish:
      "How to build professional connections and network effectively.",
    descriptionQanjobal: "Yalel conexiones profesionales yet' redes efectivas.",
  },
  {
    titleEnglish: "Using Public Libraries",
    titleQanjobal: "Yalel Bibliotecas Públicas",
    topic: VideoTopic.EDUCATION,
    urls: ["https://www.youtube.com/watch?v=video18_education_library"],
    durations: [330],
    uploadDate: new Date("2025-06-25T09:00:00Z"),
    descriptionEnglish: "How to get a library card and access free resources.",
    descriptionQanjobal:
      "Yalel tarjeta yet' biblioteca yet' recursos gratuitos.",
  },
  {
    titleEnglish: "Navigating Immigration Services",
    titleQanjobal: "Navegando Servicios de Inmigración",
    topic: VideoTopic.LEGAL,
    urls: ["https://www.youtube.com/watch?v=video19_legal_immigration"],
    durations: [960],
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
    urls: ["https://www.youtube.com/watch?v=video20_medical_mental"],
    durations: [690],
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
    urls: ["https://www.youtube.com/watch?v=video21_other_banking"],
    durations: [420],
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
    urls: ["https://www.youtube.com/watch?v=video22_transport_insurance"],
    durations: [600],
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
    urls: ["https://www.youtube.com/watch?v=video23_career_safety"],
    durations: [540],
    uploadDate: new Date("2025-09-01T09:15:00Z"),
    descriptionEnglish: "Essential workplace safety practices and protocols.",
    descriptionQanjobal:
      "Prácticas esenciales yet' seguridad ti' trabajo yet' protocolos.",
  },
  {
    titleEnglish: "Understanding Prescription Medications",
    titleQanjobal: "Yojtakk'ulal Medicamentos Con Receta",
    topic: VideoTopic.MEDICAL,
    urls: ["https://www.youtube.com/watch?v=video24_medical_meds"],
    durations: [480],
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
    urls: ["https://www.youtube.com/watch?v=video25_other_housing"],
    durations: [720],
    uploadDate: new Date("2025-09-30T11:00:00Z"),
    descriptionEnglish:
      "Resources and tips for finding affordable rental housing.",
    descriptionQanjobal:
      "Recursos yet' consejos yet' b'eyal vivienda accesible.",
  },
];
