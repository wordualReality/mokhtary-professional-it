/**
 * @file src/data/hero-mockup-videos.ts
 * @summary Stille Hero-Loops für Seiten-Mockups (nicht Social-Kacheln).
 */

import {
  MOCKUP_KI_ASSISTANT,
  MOCKUP_PROFESSIONAL_IT_BIO_POSTER,
  MOCKUP_PROFESSIONAL_IT_HERO_POSTER,
  MOCKUP_PROFESSIONAL_IT_STAKEHOLDER_POSTER,
  MOCKUP_SICHTBARKEIT,
  MOCKUP_SOCIAL,
  MOCKUP_SOFTWARE_PROTOTYPING,
  MOCKUP_SYSTEME_KI,
  VIDEO_KI_ASSISTANT,
  VIDEO_PROFESSIONAL_IT_BIO_HERO,
  VIDEO_PROFESSIONAL_IT_HERO,
  VIDEO_PROFESSIONAL_IT_STAKEHOLDER_HERO,
  VIDEO_SOCIAL_WORKFLOW_HERO,
  VIDEO_SYSTEME_KI_HERO,
  VIDEO_SYSTEME_KI_TOOL_HIGHLIGHT,
  VIDEO_WACHSTUM_HERO,
  VIDEO_WACHSTUM_SOCIAL_HERO,
} from './asset-paths';

export type HeroMockupId =
  | 'systeme-ki'
  | 'ki-automation'
  | 'systeme-ki-social-workflow'
  | 'systeme-ki-tool-highlight'
  | 'apps-ki-assistant'
  | 'professional-it'
  | 'professional-it-bio'
  | 'professional-it-stakeholder'
  | 'wachstum'
  | 'wachstum-social'
  | 'webdesign-addon-social'
  | 'webdesign-addon-systeme-ki';

export interface HeroMockupCoverBadge {
  title: string;
  meta: string;
}

export type HeroMockupPlayback = 'loop' | 'enter-once';

export interface HeroMockupVideoConfig {
  poster: string;
  video: string;
  alt: string;
  width: number;
  height: number;
  /** `loop` = Dauerloop im Viewport · `enter-once` = einmal pro Scroll-Eintritt, dann Poster. */
  playback?: HeroMockupPlayback;
  /** Kleines Built-UI unten rechts (z. B. KI-Wasserzeichen überdecken). */
  coverBadge?: HeroMockupCoverBadge;
  /** `object-position` für Poster und Video (gleiches Framing). */
  objectPosition?: string;
}

const systemeKiBase: Omit<HeroMockupVideoConfig, 'width' | 'height'> & {
  width?: number;
  height?: number;
} = {
  poster: MOCKUP_SYSTEME_KI,
  video: VIDEO_SYSTEME_KI_HERO,
  alt: 'Animiertes KI-Automation-Mockup: Dashboard, zentraler AI-Hub und Mobile-App mit Datenfluss',
  coverBadge: { title: 'Datenfluss', meta: 'Live' },
};

export const heroMockupVideos: Record<HeroMockupId, HeroMockupVideoConfig> = {
  'systeme-ki': {
    ...systemeKiBase,
    width: 1200,
    height: 750,
  },
  'ki-automation': {
    poster: MOCKUP_SYSTEME_KI,
    video: VIDEO_SYSTEME_KI_HERO,
    alt: 'Animiertes KI-Automation-Mockup: zentraler Workflow-Hub mit verbundenen Systemen und Datenfluss',
    width: 1200,
    height: 750,
    coverBadge: { title: 'Datenfluss', meta: 'Live' },
  },
  'systeme-ki-social-workflow': {
    poster: MOCKUP_SOCIAL,
    video: VIDEO_SOCIAL_WORKFLOW_HERO,
    alt: 'Animiertes Social-Media-Mockup: Smartphone-Feed mit Reels, Stories und Karussell-Posts',
    width: 800,
    height: 500,
    playback: 'loop',
    objectPosition: 'center center',
  },
  'systeme-ki-tool-highlight': {
    poster: MOCKUP_SOFTWARE_PROTOTYPING,
    video: VIDEO_SYSTEME_KI_TOOL_HIGHLIGHT,
    alt:
      'Animiertes Software-Prototyping-Mockup: AI-Orchestrierung zwischen Enterprise-Desktop und Mobile-App mit Datenfluss',
    width: 1024,
    height: 571,
    playback: 'loop',
    coverBadge: { title: 'Prototyp', meta: 'Desktop · App · Flow' },
    objectPosition: 'center center',
  },
  'apps-ki-assistant': {
    poster: MOCKUP_KI_ASSISTANT,
    video: VIDEO_KI_ASSISTANT,
    alt: 'Animiertes Mockup: interner Wissens-Assistent mit strukturierten Antworten',
    width: 1024,
    height: 571,
    playback: 'loop',
    coverBadge: { title: 'Assistent', meta: 'Wissen · Q&A' },
    objectPosition: 'center center',
  },
  'professional-it': {
    poster: MOCKUP_PROFESSIONAL_IT_HERO_POSTER,
    video: VIDEO_PROFESSIONAL_IT_HERO,
    alt:
      'Animiertes Requirements-Engineering-Mockup: Stakeholder Engagement, Scope Definition, Elicitation, Specification und Validation',
    width: 1024,
    height: 571,
    coverBadge: { title: 'Requirements', meta: 'Scope · Spec · UAT' },
  },
  'professional-it-bio': {
    poster: MOCKUP_PROFESSIONAL_IT_BIO_POSTER,
    video: VIDEO_PROFESSIONAL_IT_BIO_HERO,
    alt:
      'Animiertes Projekt-Lifecycle-Mockup: Planning, Agile Sprints, QA Testing und Deployment mit Requirements, Architektur und UAT',
    width: 1024,
    height: 571,
    playback: 'loop',
    coverBadge: { title: 'Delivery', meta: 'Plan · Sprint · Release' },
  },
  'professional-it-stakeholder': {
    poster: MOCKUP_PROFESSIONAL_IT_STAKEHOLDER_POSTER,
    video: VIDEO_PROFESSIONAL_IT_STAKEHOLDER_HERO,
    alt:
      'Animiertes Executive-IT-Mockup: KPI-Dashboards, Security & Compliance und strategischer ROI — Brücke von Deep Tech zu Vorstandsebene',
    width: 1024,
    height: 571,
    playback: 'loop',
    coverBadge: { title: 'Stakeholder', meta: 'KPI · Compliance · ROI' },
    objectPosition: 'center center',
  },
  wachstum: {
    poster: MOCKUP_SICHTBARKEIT,
    video: VIDEO_WACHSTUM_HERO,
    alt: 'Design-Mockup einer Startseite mit Suchergebnissen daneben',
    width: 1200,
    height: 750,
    playback: 'enter-once',
    coverBadge: { title: 'Dashboard', meta: 'Live · Web' },
  },
  'wachstum-social': {
    poster: MOCKUP_SOCIAL,
    video: VIDEO_WACHSTUM_SOCIAL_HERO,
    alt: 'Smartphone mit animiertem Social-Media-Feed',
    width: 900,
    height: 900,
    playback: 'loop',
    coverBadge: { title: 'Social', meta: 'Live · Feed' },
    objectPosition: 'center 42%',
  },
  'webdesign-addon-social': {
    poster: MOCKUP_SOCIAL,
    video: VIDEO_SOCIAL_WORKFLOW_HERO,
    alt: 'Social-Media-Feed in Phone-Mockup',
    width: 800,
    height: 500,
    playback: 'loop',
    objectPosition: 'center center',
  },
  'webdesign-addon-systeme-ki': {
    ...systemeKiBase,
    width: 800,
    height: 500,
    playback: 'loop',
    objectPosition: 'center center',
  },
};

export function getHeroMockupVideo(id: HeroMockupId): HeroMockupVideoConfig {
  return heroMockupVideos[id];
}
