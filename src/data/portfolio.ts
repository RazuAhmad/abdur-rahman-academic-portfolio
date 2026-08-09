export type NavItem = {
  label: string;
  href: `#${string}`;
};

export type ShowcaseCategory = "Technology" | "Legal Practice" | "Academic Engagement";

export type ArchiveGroup = "experience" | "seminars-workshops";

export type ShowcaseItem = {
  slug: string;
  title: string;
  category: ShowcaseCategory;
  archiveGroup: ArchiveGroup;
  summary: string;
  period: string;
  organisation: string;
  timelineOrder?: number;
  media: {
    label: string;
    tone: "cyan" | "blue" | "violet" | "slate";
  };
  role: string;
  context: string;
  contributions: string[];
  outcomes: string[];
  employmentProof?: {
    title: string;
    previewSrc: string;
    alt: string;
    documentType: "Employment certificate";
    issuedOn: string;
  };
};

export type Photograph = {
  id: string;
  src: string | null;
  alt: string;
  caption: string;
  orientation: "portrait" | "landscape" | "square" | "panoramic";
  year: string;
  location?: string;
};

export type VideoProject = {
  id: string;
  title: string;
  provider: "youtube" | "vimeo";
  videoId: string | null;
  thumbnail: string | null;
  description: string;
  year: string;
  duration?: string;
};

export const profile = {
  name: "Md. Abdur Rahman",
  shortName: "AR",
  email: "abdurrahman.academic1@gmail.com",
  linkedin: "https://www.linkedin.com/in/razuahmad247",
  github: "https://github.com/razuAhmad",
  cv: "/abdur-rahman-cv.pdf",
};

export const navigation: NavItem[] = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "Experience & Creative Practice", href: "#exposure" },
  { label: "Contact", href: "#contact" },
];

export const showcaseItems: ShowcaseItem[] = [
  {
    slug: "digital-product-passport",
    title: "Digital Product Passport for the EU market",
    category: "Technology",
    archiveGroup: "experience",
    summary:
      "Translating traceability, lifecycle information and access requirements into a usable compliance-focused product experience.",
    period: "Apr 2024 — Present",
    organisation: "Indetechs Software Ltd.",
    timelineOrder: 1,
    media: { label: "Compliance systems", tone: "cyan" },
    role: "Junior Frontend Engineer",
    context:
      "Digital Product Passports bring product, supply-chain and compliance information together across a product's lifecycle. The work requires close attention to what is recorded, what is public and what should remain available only to authorised users.",
    contributions: [
      "Review policy documents and technical guidance for product requirements.",
      "Help translate regulatory expectations into clear interface and information decisions.",
      "Contribute to data-driven frontend features supporting traceability and sustainability.",
      "Consider public transparency alongside commercial confidentiality and access control.",
    ],
    outcomes: [
      "Practical experience at the point where regulation becomes product behaviour.",
      "A stronger interest in data integrity, confidentiality and accountable system design.",
    ],
    employmentProof: {
      title: "Employment certificate - Indetechs Software Ltd.",
      previewSrc: "/certificates/indetechs-employment-certificate.webp",
      alt: "Privacy-redacted employment certificate from Indetechs Software Ltd. confirming Md. Abdur Rahman's role as Junior Frontend Engineer from April 2024 to the present.",
      documentType: "Employment certificate",
      issuedOn: "19 May 2026",
    },
  },
  {
    slug: "dhaka-judge-court",
    title: "Apprentice legal practice at Dhaka Judge Court",
    category: "Legal Practice",
    archiveGroup: "experience",
    summary:
      "Building practical understanding of legal research, documentation, confidential material and court procedure under supervision.",
    period: "July 2026 — Present",
    organisation: "Dhaka Judge Court",
    timelineOrder: 2,
    media: { label: "Legal practice", tone: "blue" },
    role: "Apprentice Lawyer",
    context:
      "Court exposure complements technology work with direct experience of evidence, responsibility, confidentiality and procedural fairness.",
    contributions: [
      "Assist with legal research and preparation of documentation.",
      "Handle confidential case material under supervision.",
      "Observe court procedures and the practical operation of legal accountability.",
    ],
    outcomes: [
      "Stronger foundations in evidence, confidentiality and fair process.",
      "A clearer academic interest in cybercrime, digital evidence and data misuse.",
    ],
  },
  {
    slug: "crowdfunding-platform",
    title: "Crowdfunding platform engineering",
    category: "Technology",
    archiveGroup: "experience",
    summary:
      "Contributing to a fundraising platform involving user accounts, payments, personal data and clear user-facing flows.",
    period: "Aug 2023 — Jan 2024",
    organisation: "As-Sunnah Foundation",
    timelineOrder: 3,
    media: { label: "Responsible product design", tone: "violet" },
    role: "Junior Frontend Developer Intern",
    context:
      "The internship provided an early professional view of how privacy, secure design and transparent communication affect real digital services.",
    contributions: [
      "Supported development of user-facing crowdfunding features.",
      "Worked with transaction flows, user accounts and payment-related experiences.",
      "Built practical web engineering foundations through collaborative delivery.",
    ],
    outcomes: [
      "Experience with systems that manage personal and transactional information.",
      "An appreciation for considering privacy and security from the start of product development.",
    ],
    employmentProof: {
      title: "Employment certificate - As-Sunnah Foundation",
      previewSrc: "/certificates/as-sunnah-employment-certificate.webp",
      alt: "Privacy-redacted employment certificate from As-Sunnah Foundation confirming Md. Abdur Rahman's role as Junior Frontend Developer Intern from August 2023 to January 2024.",
      documentType: "Employment certificate",
      issuedOn: "1 January 2024",
    },
  },
  {
    slug: "law-and-technology-foundation",
    title: "Law and technology academic foundation",
    category: "Academic Engagement",
    archiveGroup: "experience",
    summary:
      "An LLB foundation shaped by Media and Information Technology Law, legal research and interdisciplinary study.",
    period: "2019 — 2022",
    organisation: "Jagannath University",
    media: { label: "Bachelor of Laws", tone: "slate" },
    role: "LLB (Honours) Graduate",
    context:
      "Media and Information Technology Law introduced questions of cybercrime, privacy, unauthorised access, online fraud, digital evidence and platform responsibility.",
    contributions: [
      "Completed a four-year, 140-credit Bachelor of Laws with Honours.",
      "Developed legal research, interpretation, advocacy and reasoned writing skills.",
      "Studied intellectual property, human rights, business and company law alongside technology law.",
    ],
    outcomes: [
      "A legal framework for examining technology through rights, duties and institutions.",
      "The starting point for combining legal education with software engineering practice.",
    ],
  },
  {
    slug: "blockchain-workshop",
    title: "Blockchain Technology Workshop",
    category: "Academic Engagement",
    archiveGroup: "seminars-workshops",
    summary: "A three-day intensive introduction to blockchain concepts and emerging digital systems.",
    period: "Three-day workshop",
    organisation: "Jagannath University IT Society",
    media: { label: "Emerging technology", tone: "cyan" },
    role: "Participant",
    context:
      "The workshop extended academic exposure beyond the law curriculum into an emerging technology with questions of trust, verification and governance.",
    contributions: ["Completed the full three-day programme.", "Engaged with foundational blockchain concepts and applications."],
    outcomes: ["Broader awareness of decentralised technology and its regulatory implications."],
  },
  {
    slug: "human-rights-workshop",
    title: "Human Rights Workshop",
    category: "Academic Engagement",
    archiveGroup: "seminars-workshops",
    summary: "Academic engagement with human-rights principles and their practical application.",
    period: "Workshop",
    organisation: "Jagannath University Human Rights Society",
    media: { label: "Rights and governance", tone: "blue" },
    role: "Participant",
    context: "The programme reinforced the rights-based perspective that informs an interest in digital rights and responsible governance.",
    contributions: ["Participated in sessions organised by the university Human Rights Society."],
    outcomes: ["Connected foundational rights principles with wider questions of institutional accountability."],
  },
  {
    slug: "moot-court-organiser",
    title: "Academic moot court organisation",
    category: "Legal Practice",
    archiveGroup: "experience",
    summary: "Supporting academic moot court activities and structured legal advocacy exercises.",
    period: "During LLB studies",
    organisation: "Jagannath University",
    media: { label: "Advocacy", tone: "violet" },
    role: "Organiser",
    context: "Moot court activities create a practical setting for legal analysis, argument and academic collaboration.",
    contributions: ["Assisted with the organisation of academic moot court competitions."],
    outcomes: ["Strengthened familiarity with structured advocacy and collaborative academic events."],
  },
  {
    slug: "debate-recognition",
    title: "Intra-university debate runners-up",
    category: "Academic Engagement",
    archiveGroup: "experience",
    summary: "Second-place recognition in a university debate competition.",
    period: "2022",
    organisation: "Jagannath University",
    media: { label: "Communication", tone: "slate" },
    role: "Debater",
    context: "Competitive debate develops concise reasoning, evidence-based argument and communication under pressure.",
    contributions: ["Participated as part of the runners-up team in the intra-university competition."],
    outcomes: ["Recognition for structured argument and oral communication."],
  },
  {
    slug: "programming-mentorship",
    title: "Programming mentorship",
    category: "Technology",
    archiveGroup: "experience",
    summary: "Helping aspiring programmers build confidence and practical foundations.",
    period: "Mentorship",
    organisation: "Bangladesh University of Business and Technology community",
    media: { label: "Knowledge sharing", tone: "cyan" },
    role: "Programming Mentor",
    context: "Mentorship offered a way to consolidate technical knowledge while supporting new learners.",
    contributions: ["Guided aspiring programmers through foundational concepts and learning practices."],
    outcomes: ["Developed clearer technical communication and peer-support skills."],
  },
];

export const photographs: Photograph[] = [
  { id: "photo-01", src: null, alt: "Documentary photograph placeholder", caption: "Documentary study I", orientation: "portrait", year: "Portfolio" },
  { id: "photo-02", src: null, alt: "Street photography placeholder", caption: "Street observation", orientation: "landscape", year: "Portfolio" },
  { id: "photo-03", src: null, alt: "Public life photograph placeholder", caption: "Public life", orientation: "square", year: "Portfolio" },
  { id: "photo-04", src: null, alt: "People and place photograph placeholder", caption: "People and place", orientation: "portrait", year: "Portfolio" },
  { id: "photo-05", src: null, alt: "Urban detail photograph placeholder", caption: "Urban detail", orientation: "panoramic", year: "Portfolio" },
  { id: "photo-06", src: null, alt: "Everyday moment photograph placeholder", caption: "Everyday moment", orientation: "landscape", year: "Portfolio" },
  { id: "photo-07", src: null, alt: "Environmental portrait placeholder", caption: "Environmental portrait", orientation: "portrait", year: "Portfolio" },
  { id: "photo-08", src: null, alt: "Architecture photograph placeholder", caption: "Lines and structure", orientation: "square", year: "Portfolio" },
  { id: "photo-09", src: null, alt: "Community photograph placeholder", caption: "Community", orientation: "landscape", year: "Portfolio" },
];

export const videoProjects: VideoProject[] = [
  {
    id: "video-01",
    title: "Short documentary",
    provider: "youtube",
    videoId: null,
    thumbnail: null,
    description: "A reserved space for a documentary-led videography project.",
    year: "Video portfolio",
  },
  {
    id: "video-02",
    title: "People and place",
    provider: "vimeo",
    videoId: null,
    thumbnail: null,
    description: "A reserved space for a visual story focused on community and place.",
    year: "Video portfolio",
  },
  {
    id: "video-03",
    title: "Event film",
    provider: "youtube",
    videoId: null,
    thumbnail: null,
    description: "A reserved space for event coverage or an observational film.",
    year: "Video portfolio",
  },
  {
    id: "video-04",
    title: "Visual essay",
    provider: "vimeo",
    videoId: null,
    thumbnail: null,
    description: "A reserved space for a concise visual essay.",
    year: "Video portfolio",
  },
];

export function getShowcaseItem(slug: string) {
  return showcaseItems.find((item) => item.slug === slug);
}
