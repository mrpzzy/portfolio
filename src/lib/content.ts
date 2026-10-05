/**
 * Single source of truth for all site copy.
 * Every line here traces to Julius's CV — no invented metrics, clients, or claims.
 */

export const profile = {
  name: "Julius Baltazar Ayuno",
  shortName: "Julius Ayuno",
  monogram: "JA",
  role: "AI Automation Engineer",
  location: "Davao City, Philippines",
  remote: "Works remotely with US & international teams",
  email: "jbayuno.work@gmail.com",
  phone: "+63 991 575 4131",
  telegram: "@julsbaltazar",
  telegramUrl: "https://t.me/julsbaltazar",
  linkedin: "linkedin.com/in/solutionswithjuls",
  linkedinUrl: "https://linkedin.com/in/solutionswithjuls",
  resumeUrl: "/resume.pdf",
};

export const hero = {
  eyebrow: "AI Automation Engineer",
  headline: "I turn business problems into working systems.",
  sub: "I put LLMs to work inside real business operations, and build the databases, automations, and software underneath them. In production, not in demos.",
  nowLine: "Now: Independent Solutions Engineer",
  thenLine: "Previously Lead Automator at Aruna Talent (US)",
};

/** Section 2 — What I actually do */
export const whatIDo = {
  statement:
    "Most of my work lives in the gap between a business problem and a system that actually solves it.",
  lead: "The problems I tend to get pulled into:",
  items: [
    {
      problem: "Manual, error-prone processes",
      detail:
        "Automated tiered commission, expense, and payout calculations straight from raw data exports, with cleaning and deduplication built in, cutting time and errors every pay cycle.",
    },
    {
      problem: "Operations with no structure",
      detail:
        "Mapped a company's foundational processes and surfaced redundant, overlapping work and roles. The changes were worth about $8,000 a month.",
    },
    {
      problem: "Internal systems that don't exist yet",
      detail:
        "Built a full HRIS and payroll system from scratch that carried a company from ~20 to 90+ people without a rebuild.",
    },
    {
      problem: "Data that should be answering questions",
      detail:
        "Put OpenAI and Claude to work on live HRIS and payroll data as a finance assistant for leadership.",
    },
    {
      problem: "Repetitive follow-up between people",
      detail:
        "Wired event-driven automation so new records, status changes, and sign-offs reach the right people on their own.",
    },
  ],
};

/** Section 3 — Experience as a story */
export type ExperienceEntry = {
  role: string;
  org: string;
  meta?: string;
  period: string;
  summary: string;
  points: string[];
  current?: boolean;
};

export const experience: ExperienceEntry[] = [
  {
    role: "Independent Solutions Engineer",
    org: "Freelance",
    meta: "Remote · Davao City",
    period: "Sep 2026 to Present",
    current: true,
    summary:
      "Designing and building custom business systems for clients, end to end: scheduling and booking tools, structured databases, inventory and record tracking, automation, and reporting dashboards.",
    points: [
      "Led discovery for a clinic management system pitched to a three-branch dental clinic: competitive analysis against local products, a phased build-and-retainer pricing model, and a working prototype deployed on Netlify.",
      "Scoped Data Privacy Act (RA 10173) compliance into the build from the start.",
    ],
  },
  {
    role: "Lead Automation Engineer",
    org: "Aruna Talent LLC",
    meta: "Official title: Lead Automator · Remote · US talent & creator agency",
    period: "Apr 2025 to Sep 2026",
    summary:
      "Single-handedly built the systems a fast-growing US agency ran its people, payroll, and money on, then layered AI on top and helped hand it off to a dedicated dev team.",
    points: [
      "Built a full HRIS and payroll system from scratch: database structure and payroll logic in Google Apps Script, Sheets, and JavaScript, then extended into Supabase (PostgreSQL) and SQL as it grew. It carried the company from ~20 to 90+ employees without a rebuild.",
      "Integrated OpenAI and Anthropic's Claude APIs into the production finance system to automate data-export parsing, tiered commission and expense calculations, and report generation.",
      "Built agentic AI workflows in n8n, self-hosted on Docker behind Caddy, including a meeting action-tracking agent that works from Fathom recordings, and an AI finance assistant for leadership.",
      "Engineered event-driven automation with Apps Script triggers, Slack webhooks, and REST API calls so records, status changes, and sign-offs routed themselves.",
      "Mapped the company's foundational processes and surfaced redundant work and roles. The changes saved about $8,000 a month (~$96,000 a year).",
      "When the system's success led the company to fund a dev team to rebuild it as a web app, shifted from solo builder to supervising and consulting, owning UAT end to end through production launch while the original system kept running live in parallel.",
    ],
  },
  {
    role: "Quality Analyst & Operations Support",
    org: "Creator management agencies",
    meta: "Europe, US & Germany · Remote",
    period: "2023 to 2025",
    summary:
      "Kept client-facing operations running across distributed remote teams.",
    points: [
      "Supervised training and quality assurance for client-facing operations across distributed teams.",
      "Managed operational and marketing tools and handled sensitive information discreetly for international clients.",
    ],
  },
  {
    role: "Customer Service Representative",
    org: "iQor Philippines",
    meta: "1-800-Flowers, then Walmart",
    period: "2022 to 2023",
    summary:
      "Supported US customers across voice, email, and chat, learning how operations feel from the front line.",
    points: [
      "Handled the Walmart account across all three channels, resolving issues accurately with clear, professional communication.",
    ],
  },
];

export const internship = {
  role: "On-the-Job Trainee, Planning Department",
  org: "Department of Trade and Industry (DTI) Region XI",
  meta: "Davao City",
  period: "2026 to Present",
  summary:
    "Built and deployed PRISM, a data platform for DTI Region XI (see Selected Work).",
};

/** Section 4 — Selected work / case studies */
export type CaseStudy = {
  id: string;
  name: string;
  full?: string; // optional expansion shown under the name (e.g. an acronym's meaning)
  tag: string;
  summary: string;
  metric?: { value: string; label: string };
  live?: { label: string; url: string };
  status?: string;
  stack: string[];
  problem: string;
  built: string[];
  interesting: string;
  contribution: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "aruna",
    name: "HRIS, payroll & an AI layer",
    tag: "Aruna Talent · production",
    summary:
      "A US creator-management agency was scaling fast with no system to run its people, payroll, or money on. I built one, then taught it to think.",
    metric: { value: "~20 → 90+", label: "employees, no rebuild" },
    stack: [
      "Google Apps Script",
      "JavaScript",
      "Supabase (PostgreSQL)",
      "SQL",
      "n8n",
      "Docker",
      "Caddy",
      "OpenAI API",
      "Claude API",
      "Slack",
      "REST",
    ],
    problem:
      "The company was growing fast, running payroll and tiered commissions by hand with no HRIS underneath. Processes overlapped, follow-up was manual, and nothing scaled.",
    built: [
      "A full HRIS and payroll system from scratch: database structure and payroll logic in Apps Script, Sheets, and JavaScript, extended into Supabase (PostgreSQL) and SQL as it grew.",
      "Automated tiered commission, expense, and payout calculations from raw data exports, with cleaning and deduplication built in.",
      "Event-driven automation via Apps Script triggers, Slack webhooks, and REST calls so records and sign-offs routed themselves.",
      "Agentic n8n workflows on Docker behind Caddy: a Fathom meeting action-tracking agent, and an AI finance assistant for leadership on the company's HRIS and payroll data.",
      "AI-ready knowledge-transfer docs (CLAUDE.md system briefs) so the system could be maintained and extended with AI coding agents.",
    ],
    interesting:
      "Mapping the company's foundational processes surfaced redundant, overlapping work and roles. The changes were worth about $8,000 a month (~$96,000 a year). The system's success led leadership to fund a dedicated dev team to rebuild it as a full web app on the original foundation.",
    contribution:
      "Solo builder, then system owner, shifting to supervise and consult the new dev team, owning UAT end to end through production launch while the original system kept running live in parallel.",
  },
  {
    id: "thebook",
    name: "TheBook",
    tag: "Accounting SaaS · live",
    summary:
      "Double-entry accounting and invoicing for freelancers and small businesses. Live in production.",
    live: { label: "the live app", url: "https://thebook-iota.vercel.app" },
    status: "Sign-in required · guided demo soon",
    stack: ["Next.js", "Supabase", "Drizzle", "Stripe", "Resend"],
    problem:
      "Freelancers and small businesses need real books: a general ledger, invoices, and statements they can trust, without enterprise accounting software.",
    built: [
      "A double-entry general ledger with online payments via Stripe.",
      "Bank and QuickBooks CSV import.",
      "P&L, balance sheet, and cash-flow reports.",
      "Multi-org tenant isolation enforced with row-level security.",
    ],
    interesting:
      "Getting double-entry correctness and strict multi-tenant isolation right at the same time: the accounting has to balance, and no org can ever see another's books.",
    contribution: "Designed, built, and shipped the platform end to end.",
  },
  {
    id: "prism",
    name: "P.R.I.S.M",
    full: "Planning Resource Information System & Management",
    tag: "Gov data platform · DTI Region XI",
    summary:
      "A data platform for DTI Region XI, built and deployed during an on-the-job internship with the Planning Department.",
    live: {
      label: "the live app",
      url: "https://dti11-prism-by-jnjo.vercel.app",
    },
    status: "Deployed · completing with DTI",
    stack: ["Next.js", "Supabase (RLS)", "Drizzle", "ExcelJS"],
    problem:
      "A government regional office needed structured data entry, catalogs, and reporting across offices, with a clear access and audit model.",
    built: [
      "A form engine and forms catalog for structured data entry.",
      "Office-level data entry and summaries.",
      "Excel import and export via ExcelJS.",
      "Office administration and office-scoped audit logs, backed by Supabase row-level security.",
    ],
    interesting:
      "Building a security model a government office can rely on: row-level security plus office-scoped audit logs, not just the forms on top.",
    contribution:
      "Built and deployed the platform during the internship; currently continuing with DTI toward its completion.",
  },
  {
    id: "timetracker",
    name: "Agency Time Tracker",
    tag: "Desktop + web",
    status: "v1 in progress",
    summary:
      "A billing-first, multi-tenant time tracker for remote agencies. A Hubstaff and Time Doctor alternative.",
    stack: ["Electron", "Next.js", "Prisma", "Neon Postgres", "Clerk", "Turborepo"],
    problem:
      "Remote agencies need time tracking that leads straight to billing and profitability, not just surveillance of their people.",
    built: [
      "A Windows desktop agent paired with timesheets.",
      "Timesheets that flow into client invoices and profitability reports.",
      "Transparent, opt-in monitoring rather than covert tracking.",
    ],
    interesting:
      "Designing it billing-first: time has to become invoices and profit, with monitoring that teams can actually consent to.",
    contribution: "Designing and building it across desktop and web (in progress).",
  },
];

/** Section 5 — How I think */
export const howIThink = {
  statement: "I don't just know tools. I know how to approach a problem.",
  steps: [
    {
      k: "01",
      title: "Understand the business first",
      detail:
        "Discovery, process mapping, and competitive analysis before any code. The system has to fit how the work actually happens.",
    },
    {
      k: "02",
      title: "Build the foundation right",
      detail:
        "Databases, schema, and clean data first. AI and automation are only as reliable as what sits underneath them.",
    },
    {
      k: "03",
      title: "Automate the repetitive",
      detail:
        "Event-driven triggers and workflows so routine follow-up runs itself instead of a person chasing it.",
    },
    {
      k: "04",
      title: "Put AI where it pays off",
      detail:
        "LLMs inside real operations: parsing, calculating, reporting, assisting. Not demos that never ship.",
    },
    {
      k: "05",
      title: "Verify in the real world",
      detail:
        "UAT through production launch, with the old system running in parallel until the new one earns trust.",
    },
    {
      k: "06",
      title: "Document so it lasts",
      detail:
        "AI-ready system briefs so what I build can be maintained and extended long after I hand it off.",
    },
  ],
};

/** Section 6 — Technical capabilities */
export const capabilities = [
  {
    group: "AI & Automation",
    note: "LLMs put to work inside production systems.",
    items: [
      "OpenAI API",
      "Anthropic Claude API",
      "Claude Code",
      "n8n agentic workflows",
      "Prompt engineering",
      "AI agents",
      "LangChain / LangGraph (foundational)",
      "Ollama",
    ],
  },
  {
    group: "Software",
    note: "The applications and services around the automation.",
    items: [
      "TypeScript / JavaScript",
      "Python",
      "React",
      "Next.js (App Router)",
      "Node.js",
      "NestJS",
      "Electron",
      "Turborepo",
      "Vite",
      "Google Apps Script",
      "R",
    ],
  },
  {
    group: "Data & Systems",
    note: "The reliable foundation AI output depends on.",
    items: [
      "Supabase (PostgreSQL, Auth, RLS)",
      "Neon Postgres",
      "Prisma",
      "Drizzle ORM",
      "SQL",
      "Multi-tenant schema design",
      "Database design",
      "Data cleaning",
    ],
  },
  {
    group: "APIs & Infrastructure",
    note: "How systems connect, deploy, and run.",
    items: [
      "REST APIs",
      "Webhooks",
      "Stripe (Checkout, Connect)",
      "Clerk",
      "Resend",
      "Docker",
      "Caddy",
      "Git",
      "Vercel",
    ],
  },
];

export const certifications = {
  issuer: "OpenAI Academy",
  year: "2026",
  items: ["AI Foundations", "Applied AI Foundations", "Agents and Workflows"],
};

/** Section 7 — About */
export const about = {
  lead: "I came to software from electrical engineering.",
  paras: [
    "I studied Electrical Engineering for three years before shifting to BS Information Technology, major in Business Technology Management, bringing an engineering and quantitative foundation into business systems.",
    "Before I built the systems, I worked the operations. I supported US customers at iQor across voice, email, and chat, then ran quality assurance and operations for remote creator-management teams. I learned how work actually feels on the front line before I started building what sits behind it.",
    "These days I build daily with Claude Code, I'm OpenAI Academy certified, and I'm still picking up tools faster than I can list them. I work from Davao City, Philippines, with teams around the world.",
  ],
  education: {
    degree: "BS Information Technology, major in Business Technology Management",
    school: "University of Southeastern Philippines (Obrero), Davao City",
    detail: "Expected April 2027 · shifted from BS Electrical Engineering",
  },
};

/** Section 8 — Current direction */
export const direction = {
  statement: "I know what I can contribute, and I'm still hungry to learn.",
  openTo: [
    "Full-time roles, remote",
    "Freelance & direct-client projects",
    "Interesting systems & automation work",
    "Places where I can keep growing",
  ],
};

/** Section 9 — Contact */
export const contact = {
  big: "Got something in mind? Let's talk.",
  sub: "Whether it's a project, a consultation, or just a hello, I'm easy to reach. I read everything.",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
];
