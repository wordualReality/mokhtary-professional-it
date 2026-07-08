/**
 * @file src/data/profil-mockup-frames.ts
 * @summary Chrome + Overlay-Konfiguration für Profil-Mockup-Frames (Bio, Stakeholder, Hero).
 */
import type { HeroMockupId } from './hero-mockup-videos';

export type ProfilMockupFrameId = 'hero-requirements' | 'delivery' | 'stakeholder';

export interface ProfilMockupFrameChip {
  id: string;
  label: string;
}

export interface ProfilMockupFrameConfig {
  frameId: ProfilMockupFrameId;
  mockupId: HeroMockupId;
  chromeLabel: string;
  chips: readonly ProfilMockupFrameChip[];
  checks: readonly string[];
  /** Chrome-Label pro aktivem Chip (Reihenfolge = chips). */
  chromeLabelByChip: readonly string[];
}

export const profilMockupFrames: Record<ProfilMockupFrameId, ProfilMockupFrameConfig> = {
  'hero-requirements': {
    frameId: 'hero-requirements',
    mockupId: 'professional-it',
    chromeLabel: 'scope · uat · release',
    chips: [
      { id: 'scope', label: 'Scope' },
      { id: 'uat', label: 'UAT' },
      { id: 'release', label: 'Release' },
    ],
    checks: ['Scope dokumentiert', 'UAT-Szenarien definiert', 'Release-Readiness'],
    chromeLabelByChip: ['Scope · uat · release', 'scope · UAT · release', 'scope · uat · Release'],
  },
  delivery: {
    frameId: 'delivery',
    mockupId: 'professional-it-bio',
    chromeLabel: 'plan · sprint · release',
    chips: [
      { id: 'plan', label: 'Plan' },
      { id: 'sprint', label: 'Sprint' },
      { id: 'release', label: 'Release' },
    ],
    checks: ['Planning abgestimmt', 'Sprint-Backlog bereit', 'Release freigegeben'],
    chromeLabelByChip: ['Plan · sprint · release', 'plan · Sprint · release', 'plan · sprint · Release'],
  },
  stakeholder: {
    frameId: 'stakeholder',
    mockupId: 'professional-it-stakeholder',
    chromeLabel: 'kpi · compliance · roi',
    chips: [
      { id: 'kpi', label: 'KPI' },
      { id: 'compliance', label: 'Compliance' },
      { id: 'roi', label: 'ROI' },
    ],
    checks: ['KPI-Dashboard live', 'Compliance-Report', 'Stakeholder-Alignment'],
    chromeLabelByChip: ['KPI · compliance · roi', 'kpi · Compliance · roi', 'kpi · compliance · ROI'],
  },
};

export function getProfilMockupFrame(id: ProfilMockupFrameId): ProfilMockupFrameConfig {
  return profilMockupFrames[id];
}
