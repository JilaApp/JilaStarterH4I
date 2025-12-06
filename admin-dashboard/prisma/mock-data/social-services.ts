import { SocialServiceCategory } from "@prisma/client";

export const socialServicesData = [
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
    description: "Public transportation services including buses and subways.",
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
