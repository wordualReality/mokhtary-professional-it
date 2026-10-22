/**
 * @file src/data/profil-arcava-teaser.ts
 * @summary Komprimierte Arcava-Fallstudie auf dem Profil-One-Pager (mokhtary.de).
 */

import { aydinStudiosUrl } from '../config/site';

export const profilArcavaTeaser = {
  sectionId: 'fallstudie-arcava',
  kicker: 'Ausgewählte Produkt- & Systemarchitektur-Fallstudie',
  title: 'Arcava · White-Label Coaching & Journey Platform',
  maturityLine: 'Architektur- und interaktive Produktfallstudie. Implementierung in Arbeit.',
  roleLine:
    'Product / Business Analyst · Requirements Engineer · Systemarchitektur (Spezifikation)',
  body: 'Eine Coach-Marke wollte strukturierte Programme unter eigenem Namen liefern. Die Arbeit zeigt, wie aus einer unstrukturierten Produktidee ein nachvollziehbarer Blueprint, Rollenmodell, Zielarchitektur und interaktiver Prototyp entstand, inklusive expliziter Build-vs-Buy-Korrektur.',
  artifacts: [
    'Capability Map & Akzeptanzkriterien',
    'Vier-Rollen-Modell & Golden Journey',
    'Zielarchitektur & Daten-Grenzen',
    'Interaktiver Produkt-Prototyp',
    'KI-unterstützte Methode mit menschlicher Freigabe',
  ],
  fullCaseLabel: 'Vollständige Fallstudie auf AydinStudios',
  fullCaseHref: `${aydinStudiosUrl}/cases/arcava`,
  showcaseLabel: 'Interaktiver Showcase',
  showcaseHref: `${aydinStudiosUrl}/apps`,
  summaryLabel: 'Kurzform auf AydinStudios',
  summaryHref: `${aydinStudiosUrl}/cases/arcava`,
} as const;
