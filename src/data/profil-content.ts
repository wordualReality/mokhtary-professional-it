/**
 * @file src/data/profil-content.ts
 * @summary Strukturierte Profil-Marketing-Copy: Biografie, Insights, Hero-Bullets, Mail-Template für Terminanfrage.
 */

/** Zwei Biografie-Einträge für die Profil-Timeline (Kicker, Titel, Fließtext). */
export const biography = [
  {
    kicker: 'Business Analysis · Plattformen',
    title: 'Markt- und Referenzdaten unter Aufsichtslogik',
    body: 'Verantwortung für zentrale Datenplattformen · Datenqualität und nachvollziehbare Integration in Anwendungslandschaften · Migration und Weiterentwicklung großer Marktdaten-Umfelder · Change- und Performance-Management über viele Anwendungen · ServiceNow und regulatorischer Kontext · bei einer internationalen Großbank im Wholesale-Bereich.',
  },
  {
    kicker: 'Freelance · Dev & IT',
    title: 'Projekte zwischen Umsetzung und Betrieb',
    body: 'Web- und datennahe Anwendungen · Spezifikation, Implementierung und dokumentierte Übergaben in kleineren Mandaten · später Schwerpunkt IT-Service und Support in produktiven Umgebungen einschließlich 2nd-/3rd-Level · Java und SQL für Reporting und operative Auswertungen · Unterstützung bei Integrationen und Datenvalidierung zwischen Systemen · Change Requests, Eskalationen und Verbesserung technischer Abläufe · unter anderem für Finanzdienstleister.',
  },
] as const;

/** Vorgefüllter mailto:-Link für Terminanfragen aus dem Profil-Hero. */
export const terminMailHref =
  'mailto:kontakt@mokhtary.de?subject=' +
  encodeURIComponent('Terminanfrage · Professional IT') +
  '&body=' +
  encodeURIComponent(
    'Guten Tag,\n\nich möchte einen Termin für ein kurzes Kennenlerngespräch vorschlagen.\n\nWunschzeiten (optional):\n\nThema / Kontext:\n\nMit freundlichen Grüßen'
  );

function readHttpsEnv(key: string): string {
  const raw = (import.meta.env as Record<string, string | boolean | undefined>)[key];
  if (typeof raw !== 'string') return '';
  const t = raw.trim();
  if (!t.startsWith('https://')) return '';
  return t;
}

function safeHttpsUrl(u: string): string {
  const t = u.trim();
  if (!t.startsWith('https://')) return '';
  return t;
}

/**
 * Ein öffentlicher Google-Terminplan für das Erstgespräch (nur https).
 * Typisch: Ort „Google Meet“, Telefon-Option in der **Beschreibung** auf der Google-Buchungsseite.
 * Setzen per `PUBLIC_SCHEDULING_GOOGLE_URL` oder Legacy `PUBLIC_SCHEDULING_GOOGLE_MEET_URL`, optional Inline unten.
 * Inline: Fallback, falls beim Build keine Env gesetzt ist (z. B. Hosting vergessen); Env hat Vorrang.
 */
const SCHEDULING_GOOGLE_URL_INLINE =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0FwqDAYEm-Glyjjr5MQ-SUINPgG2UFDwUrIJ4aZnTKrqMOEzzkkLeBkGRgEBUobQzP5BWxp4pU';

export const schedulingGoogleCalendarUrl =
  readHttpsEnv('PUBLIC_SCHEDULING_GOOGLE_URL') ||
  readHttpsEnv('PUBLIC_SCHEDULING_GOOGLE_MEET_URL') ||
  safeHttpsUrl(SCHEDULING_GOOGLE_URL_INLINE);

/** Welche Mini-Illustration die Insight-Karte im Hero-Bereich nutzt. */
export type ProfilInsightVisual = 'requirements' | 'bridge' | 'provider' | 'ai';

/** Eine Insight-Karte: Schlagwort, Visual-Typ, Titel, Teaser, Aufzählung. */
export type ProfilInsight = {
  tag: string;
  visual: ProfilInsightVisual;
  title: string;
  teaser: string;
  bullets: readonly string[];
};

/** Vier Insight-Karten in fester Reihenfolge (ProfilInsightsSection). */
export const insights = [
  {
    tag: 'Requirements',
    visual: 'requirements' as const,
    title: 'Warum Anforderungen ohne Entscheidungen nicht halten.',
    teaser:
      'Drei typische Muster, sobald aus Spezifikation keine verbindliche Entscheidung wird, mit direkter Spur in Rework, Abnahme und Nachweisbarkeit.',
    bullets: [
      'Owner und Frist fehlen: Anforderungen bleiben Interpretationssache, die Abnahme wird verhandelbar statt prüfbar.',
      'Widersprüche im Fachbild bleiben ungelöst, bis die Umsetzung Priorität erzwingt, dann wird unter Zeitdruck nachjustiert.',
      'Traceability bricht weg: Änderungen und Verantwortung sind schwer belegbar, Audit- und Regressionsrisiko steigen zuerst.',
    ],
  },
  {
    tag: 'Fachbereich × IT',
    visual: 'bridge' as const,
    title: 'Die Brücke, die selten jemand baut.',
    teaser:
      'Ein gemeinsames Bild aus Zielen, Grenzen und Prioritäten dämpft Reklamationskosten und stabilisiert Releases, statt dieselben Missverständnisse in jedem Sprint neu zu finanzieren.',
    bullets: [
      'Stillschweigende Annahmen lassen sich entschärfen, sobald Begriffe und Modelle zwischen Fach und IT konsolidiert sind.',
      'Weniger Nacharbeit nach dem Fach-Review, klarere Eskalation bei Konflikten: die Umsetzung gewinnt an Tempo und Vorhersehbarkeit.',
      'Wissensträger wechseln, dokumentierte Entscheidungen halten den Kontext, auch wenn Personal oder Dienstleister rotieren.',
    ],
  },
  {
    tag: 'Provider-Steuerung',
    visual: 'provider' as const,
    title: 'Fehler, die im Mittelstand wirklich wehtun.',
    teaser:
      'Drei klassische Steuerungslücken zwischen Vertrag, Lieferung und Betrieb, unabhängig von Branche und Toolchain.',
    bullets: [
      'Soll und Ist laufen auseinander: Scope im Backlog und Leistungsbild im Vertrag passen nicht zusammen, Nachträge ohne belastbare Doku werden teuer.',
      'Schnittstellen-Verantwortung endet mit Projektende: im Live-Betrieb bleiben Grey Areas, Störungen häufen sich nach dem Übergabe-Workshop.',
      'Go-Live ohne harte Abnahmekriterien: Eskalation startet oft erst am sichtbaren Schaden, Budget- und Reputationsrisiko steigen sprunghaft.',
    ],
  },
  {
    tag: 'KI-Projekte',
    visual: 'ai' as const,
    title: 'Warum KI-Projekte selten an der Technik scheitern.',
    teaser:
      'Drei nicht-technische Engpässe, die KI in der Praxis früher stoppen als jede Modellarchitektur.',
    bullets: [
      'Datenbasis ungeklärt: Qualität, Zugriff, Historie, Demo und Modell laufen, der produktive Pfad oft nicht.',
      'Der Prozess trägt den Use-Case nicht: SLAs, Verantwortlichkeiten und Nacharbeit sind nicht verdrahtet, Insellösung statt Hebel im Alltag.',
      'Rollen, Freigaben, Compliance: ohne operatives Regelwerk verliert der Pilot nach dem Showcase an Boden, nicht wegen der GPU.',
    ],
  },
] as const satisfies readonly ProfilInsight[];

/** Ein Bullet unter dem Profil-Hero-Mockup (fetter Titel + Fließtext nach Mittelpunkt). */
export type ProfilHeroBullet = {
  title: string;
  text: string;
};

/** Signatur auf dem Mockup (Hero + Section-Asides). */
export const profilHeroSignature = {
  kicker: 'Aydin Mokhtary',
  role: 'Senior IT Business Analyst · Banking IT',
} as const;

/** Kurze Hero-Einordnung unter dem Mockup (Profil). */
export const profilHeroDeckIntro =
  'Weniger Überraschungen nach dem Go-Live: Zusagen und Modelle, die in Umsetzung und Betrieb halten.';

/** Vier kompakte Hero-Bullets (ProfilHero). */
export const profilHeroBullets: readonly ProfilHeroBullet[] = [
  {
    title: 'Fach & IT',
    text: 'gemeinsame Sprache und tragfähige Anforderungen, damit Abnahme prüfbar bleibt.',
  },
  {
    title: 'Scope & Abnahme',
    text: 'klarer Umfang und Tests, bevor Zeitdruck die Interpretation übernimmt.',
  },
  {
    title: 'Schnittstellen',
    text: 'APIs und Datenflüsse so beschrieben, dass Bau und Betrieb dieselbe Spur nutzen.',
  },
  {
    title: 'Übergabe & Betrieb',
    text: 'Release begleiten, bis Geliefertes im Alltag trägt, nicht nur auf dem Papier steht.',
  },
];

/** C-Level & Stakeholder Management — Section direkt nach Hero. */
export type ProfilStakeholderBullet = {
  title: string;
  text: string;
};

export const stakeholderSection = {
  kicker: 'C-LEVEL & STAKEHOLDER MANAGEMENT',
  headline: 'Die Brücke zwischen Deep Tech und Vorstandsebene.',
  subheadline:
    'Komplexe IT-Projekte scheitern selten an der Technologie, sondern an fehlender Übersetzung. Ich verbinde tiefe technische Expertise mit strategischem Weitblick. Mit Erfahrung in direkter Zusammenarbeit mit Vorständen, C-Level-Stakeholdern und bereichsübergreifenden Entscheidern übersetze ich komplexe Architekturen in klare, messbare Business-Entscheidungen und nehme Stakeholdern auf allen Ebenen das Risiko.',
  bullets: [
    {
      title: 'Strategische Übersetzung',
      text: 'Vom Code zur Entscheidungsvorlage: 100 % aligned mit den Unternehmenszielen.',
    },
    {
      title: 'Erwartungsmanagement',
      text: 'Transparente Kommunikation und realistische Roadmaps, die Überraschungen auf C-Level eliminieren.',
    },
    {
      title: 'Krisenfeste Orchestrierung',
      text: 'Effektive Vermittlung zwischen IT-Teams, Fachbereichen und Geschäftsführung.',
    },
    {
      title: 'DORA & Compliance Fokus',
      text: 'Stakeholder-Reporting, das höchste regulatorische und sicherheitstechnische Standards erfüllt.',
    },
  ] as const satisfies readonly ProfilStakeholderBullet[],
} as const;

/** Conversion-Copy für /professional-it (Corporate CH · Freelance DE). */
export const profilPageCopy = {
  hero: {
    badge: 'Senior BA · Requirements · Banking IT',
    headline: 'IT Business Analysis · Requirements Engineering · Integration',
    headlineAccent: 'Von Anforderung bis stabilem Betrieb.',
    lead:
      'IT-Business-Analysis für regulierte Unternehmen und Projekte mit komplexen Software-Landschaften: Technische Tiefe, Requirements Engineering und Stakeholder-Steuerung in einem, damit Enterprise-Anforderungen in belastbare Lösungen und stabilen Betrieb übersetzen.',
    primaryCtaLabel: 'Kontakt aufnehmen',
    primaryCtaHref: '#kontakt',
    schedulingCtaLabel: 'Termin vereinbaren',
    schedulingCtaHref: '#terminwahl',
    trustChips: ['Schweiz · Corporate', 'Deutschland · Freelance', 'Vertraulich behandelt'],
  },
  contact: {
    kicker: 'Kontakt',
    headline: 'Kontakt für Rolle, Mandat oder Projekt.',
    introText: 'Ich freue mich über einen Austausch.',
    trustChips: ['Direkter Austausch', 'Vertraulich behandelt'],
    submitLabel: 'Nachricht senden',
    organizationPlaceholder: 'Unternehmen, Recruiting oder Fachbereich',
    emailPlaceholder: 'sie@unternehmen.com',
    messagePlaceholder: 'Ich freue mich auf Ihre Nachricht.',
  },
  contactForm: {
    nameLabel: 'Name',
    namePlaceholder: 'Ihr Name',
    emailLabel: 'E-Mail',
    companyLabel: 'Unternehmen',
    optionalLabel: 'optional',
    interestLabel: 'Anliegen',
    messageLabel: 'Nachricht',
    chipsAriaLabel: 'Was Sie bekommen',
    formNote: 'Vertraulich behandelt. Keine Weitergabe. Kein Newsletter.',
  },
} as const;

export const profilContactInterests = [
  { v: 'freelance-mandat', l: 'Freelance-Mandat' },
  { v: 'projektanfrage', l: 'Projektanfrage' },
  { v: 'recruiting', l: 'Recruiting / Vermittlung' },
  { v: 'sonstiges', l: 'Sonstiges' },
] as const;

/** Kenntnisse-Section — Kicker, Headline, Skill-Blöcke. */
export const skillsSection = {
  kicker: 'Kenntnisse',
  headline: 'Methoden, Technik, Sprachen',
  blocks: [
    {
      id: 'tech',
      title: 'Technik',
      body:
        'Application Engineering · Java (SE), Spring (MVC, JDBC), REST-APIs, Python, SQL, Datenmodelle · Web · JavaScript (ES6), Node.js, Vue.js, Astro, HTML5, CSS3 · Cloud & Betrieb · Azure AD, Microsoft 365 · Monitoring und Support produktiver Systeme · IntelliJ, Eclipse, VS Code',
      ariaLabel: 'Technik: Karte aktivieren',
    },
    {
      id: 'biz',
      title: 'Business & Delivery',
      body:
        'Business Analysis & Requirements Engineering · Prozessanalyse (BPMN, Use Cases, User Stories) · IT Service Management (ITIL), Change/Incident/Problem · UAT, Governance & Audit · Stakeholder & Cross-Team · Agile (Scrum/SAFe) · Eskalation & Priorisierung',
      ariaLabel: 'Business und Delivery: Karte aktivieren',
    },
    {
      id: 'lang',
      title: 'Sprachen',
      body:
        'Deutsch · Verhandlungssicher (C2) · Englisch · professionell (C1) · Persisch · Muttersprache · Französisch · Grundkenntnisse (A2)',
      ariaLabel: 'Sprachen: Karte aktivieren',
    },
  ],
} as const;

/** Section-Kicker für Insights (Gedanken aus der Praxis). */
export const insightsSection = {
  kicker: 'Gedanken aus der Praxis',
  headline: 'Was Projekte wirklich aus der Bahn wirft.',
} as const;

/** Rollen & Kontexte — Section-Header. */
export const bioSection = {
  kicker: 'Rollen & Kontexte',
  headline: 'Woher die Ruhe im Projekt kommt.',
  asideAriaLabel: 'Projekt-Lifecycle: Planning, Agile Sprints, QA Testing und Deployment',
} as const;

/** Hero-Mockup-UI-Strings (ProfilHero). */
export const profilHeroUi = {
  asideAriaLabel: 'Editorial-Visitenkarte und Einordnung',
  mockChromeLabel: 'scope · uat · release',
  checkItems: ['Scope dokumentiert', 'UAT-Szenarien definiert', 'Release-Readiness'],
} as const;
