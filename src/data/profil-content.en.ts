/**
 * @file src/data/profil-content.en.ts
 * @summary English content for /professional-it/en.
 */

export const biography = [
  {
    kicker: 'Business Analysis · Platforms',
    title: 'Market and reference data under regulatory logic',
    body: 'Ownership of central data platforms · data quality and traceable integration into application landscapes · migration and evolution of large market-data environments · change and performance management across many applications · ServiceNow and regulatory context · at an international wholesale bank.',
  },
  {
    kicker: 'Freelance · Dev & IT',
    title: 'Projects between delivery and operations',
    body: 'Web and data-driven applications · specification, implementation and documented handovers in smaller mandates · later focus on IT service and support in production environments including 2nd/3rd level · Java and SQL for reporting and operational analysis · support for integrations and data validation between systems · change requests, escalations and improvement of technical workflows · including for financial services clients.',
  },
] as const;

export const terminMailHref =
  'mailto:kontakt@mokhtary.de?subject=' +
  encodeURIComponent('Meeting request · Professional IT') +
  '&body=' +
  encodeURIComponent(
    'Hello,\n\nI would like to suggest a time for a brief introductory call.\n\nPreferred times (optional):\n\nTopic / context:\n\nBest regards'
  );

export type ProfilInsightVisual = 'requirements' | 'bridge' | 'provider' | 'ai';

export type ProfilInsight = {
  tag: string;
  visual: ProfilInsightVisual;
  title: string;
  teaser: string;
  bullets: readonly string[];
};

export const insights = [
  {
    tag: 'Requirements',
    visual: 'requirements' as const,
    title: 'Why requirements fail without decisions.',
    teaser:
      'Three typical patterns when specification does not become a binding decision, with a direct line to rework, acceptance and auditability.',
    bullets: [
      'Missing owner and deadline: requirements stay open to interpretation; acceptance becomes negotiable instead of testable.',
      'Contradictions in the business picture remain unresolved until delivery forces priority; then adjustments happen under time pressure.',
      'Traceability breaks: changes and accountability are hard to prove; audit and regression risk rise first.',
    ],
  },
  {
    tag: 'Business × IT',
    visual: 'bridge' as const,
    title: 'The bridge few people build.',
    teaser:
      'A shared picture of goals, boundaries and priorities reduces rework cost and stabilises releases, instead of financing the same misunderstandings in every sprint.',
    bullets: [
      'Silent assumptions can be defused once terms and models are consolidated between business and IT.',
      'Less rework after business review, clearer escalation on conflicts: delivery gains speed and predictability.',
      'Knowledge carriers change; documented decisions preserve context even when people or vendors rotate.',
    ],
  },
  {
    tag: 'Provider steering',
    visual: 'provider' as const,
    title: 'Mistakes that really hurt mid-market companies.',
    teaser:
      'Three classic steering gaps between contract, delivery and operations, regardless of industry and toolchain.',
    bullets: [
      'Target and actual diverge: scope in the backlog and service definition in the contract do not align; change orders without solid documentation become expensive.',
      'Interface responsibility ends at project closure: in live operations grey areas remain; incidents accumulate after the handover workshop.',
      'Go-live without hard acceptance criteria: escalation often starts only at visible damage; budget and reputation risk jump.',
    ],
  },
  {
    tag: 'AI projects',
    visual: 'ai' as const,
    title: 'Why AI projects rarely fail on technology.',
    teaser:
      'Three non-technical bottlenecks that stop AI in practice sooner than any model architecture.',
    bullets: [
      'Data basis unclear: quality, access, history. Demo and model run; the production path often does not.',
      'The process does not carry the use case: SLAs, responsibilities and rework are not wired; island solution instead of leverage in daily work.',
      'Roles, approvals, compliance: without an operational rulebook the pilot loses ground after the showcase, not because of the GPU.',
    ],
  },
] as const satisfies readonly ProfilInsight[];

export type ProfilHeroBullet = {
  title: string;
  text: string;
};

export const profilHeroSignature = {
  kicker: 'Aydin Mokhtary',
  role: 'Senior IT Business Analyst · Banking IT',
} as const;

export const profilHeroDeckIntro =
  'Fewer surprises after go-live: commitments and models that hold in delivery and operations.';

export const profilHeroBullets: readonly ProfilHeroBullet[] = [
  {
    title: 'Business & IT',
    text: 'shared language and robust requirements so acceptance stays testable.',
  },
  {
    title: 'Scope & acceptance',
    text: 'clear scope and tests before time pressure takes over interpretation.',
  },
  {
    title: 'Interfaces',
    text: 'APIs and data flows described so build and operations use the same track.',
  },
  {
    title: 'Handover & operations',
    text: 'support release until what was delivered works in daily operations, not only on paper.',
  },
];

export type ProfilStakeholderBullet = {
  title: string;
  text: string;
};

export const stakeholderSection = {
  kicker: 'C-LEVEL & STAKEHOLDER MANAGEMENT',
  headline: 'The bridge between deep tech and board level.',
  subheadline:
    'Complex IT projects rarely fail on technology; they fail on missing translation. I connect deep technical expertise with strategic perspective. With experience working directly with executive stakeholders, C-level interfaces and cross-functional decision makers, I translate complex architectures into clear, measurable business decisions and reduce risk for stakeholders at every level.',
  bullets: [
    {
      title: 'Strategic translation',
      text: 'From code to decision paper: 100% aligned with business goals.',
    },
    {
      title: 'Expectation management',
      text: 'Transparent communication and realistic roadmaps that eliminate surprises at C-level.',
    },
    {
      title: 'Crisis-proof orchestration',
      text: 'Effective mediation between IT teams, business units and executive management.',
    },
    {
      title: 'DORA & compliance focus',
      text: 'Stakeholder reporting that meets the highest regulatory and security standards.',
    },
  ] as const satisfies readonly ProfilStakeholderBullet[],
} as const;

export const profilPageCopy = {
  hero: {
    badge: 'Senior BA · Requirements · Banking IT',
    headline: 'IT Business Analysis · Requirements Engineering · Integration',
    headlineAccent: 'From requirement to stable operations.',
    lead:
      'IT business analysis for regulated enterprises and projects with complex software landscapes: technical depth, requirements engineering and stakeholder steering in one, so enterprise requirements translate into robust solutions and stable operations.',
    primaryCtaLabel: 'Get in touch',
    primaryCtaHref: '#kontakt',
    schedulingCtaLabel: 'Book a meeting',
    schedulingCtaHref: '#terminwahl',
    trustChips: ['Switzerland · Corporate', 'Germany · Freelance', 'Handled confidentially'],
  },
  contact: {
    kicker: 'Contact',
    headline: "Let's clarify the context.",
    introText:
      "I'm open to a structured conversation around freelance work, project roles or recruiting context.",
    trustChips: ['Direct exchange', 'Treated confidentially'],
    submitLabel: 'Send message',
    organizationPlaceholder: 'Company, recruiting contact or business area',
    emailPlaceholder: 'you@company.com',
    messagePlaceholder: "I'm looking forward to your message.",
  },
  contactForm: {
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    companyLabel: 'Company',
    optionalLabel: 'optional',
    interestLabel: 'Topic',
    messageLabel: 'Message',
    chipsAriaLabel: 'What you get',
    formNote: 'Treated confidentially. No forwarding. No newsletter.',
  },
} as const;

export const profilContactInterests = [
  { v: 'freelance-mandate', l: 'Freelance work' },
  { v: 'project-inquiry', l: 'Project inquiry' },
  { v: 'recruiting', l: 'Recruiting / placement' },
  { v: 'other', l: 'Other' },
] as const;

export const skillsSection = {
  kicker: 'Skills',
  headline: 'Methods, technology, working languages',
  blocks: [
    {
      id: 'tech',
      title: 'Technology',
      body:
        'Application engineering · Java (SE), Spring (MVC, JDBC), REST APIs, Python, SQL, data models · Web · JavaScript (ES6), Node.js, Vue.js, Astro, HTML5, CSS3 · Cloud & operations · Azure AD, Microsoft 365 · monitoring and support of production systems · IntelliJ, Eclipse, VS Code',
      ariaLabel: 'Technology: activate card',
    },
    {
      id: 'biz',
      title: 'Business & delivery',
      body:
        'Business analysis & requirements engineering · process analysis (BPMN, use cases, user stories) · IT service management (ITIL), change/incident/problem · UAT, governance & audit · stakeholder & cross-team · agile (Scrum/SAFe) · escalation & prioritisation',
      ariaLabel: 'Business and delivery: activate card',
    },
    {
      id: 'lang',
      title: 'Working languages',
      body:
        'German · negotiation level (C2) · English · professional (C1) · Persian · native · French · basic (A2)',
      ariaLabel: 'Working languages: activate card',
    },
  ],
} as const;

export const insightsSection = {
  kicker: 'Thoughts from practice',
  headline: 'What really derails projects.',
} as const;

export const bioSection = {
  kicker: 'Roles & contexts',
  headline: 'How clarity enters complex projects',
  asideAriaLabel: 'Project lifecycle: planning, agile sprints, QA testing and deployment',
} as const;

export const profilHeroUi = {
  asideAriaLabel: 'Editorial profile card and positioning',
  mockChromeLabel: 'scope · uat · release',
  checkItems: ['Scope documented', 'UAT scenarios defined', 'Release readiness'],
} as const;

export { schedulingGoogleCalendarUrl } from './profil-content';
