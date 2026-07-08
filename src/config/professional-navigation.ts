/**
 * @file src/config/professional-navigation.ts
 * @summary Section-Navigation für Professional IT.
 */

import { professionalItHref } from './navigation';

export interface ProfessionalNavItem {
  label: string;
  hash: string;
}

export const professionalNavItemsDe: ProfessionalNavItem[] = [
  { label: 'Kompetenzen', hash: '#kenntnisse' },
  { label: 'Erfahrung', hash: '#erfahrung' },
  { label: 'Praxis', hash: '#praxis' },
  { label: 'Kontakt', hash: '#kontakt' },
];

export const professionalNavItemsEn: ProfessionalNavItem[] = [
  { label: 'Capabilities', hash: '#kenntnisse' },
  { label: 'Experience', hash: '#erfahrung' },
  { label: 'Field Notes', hash: '#praxis' },
  { label: 'Contact', hash: '#kontakt' },
];

export const professionalItEnHref = '/professional-it/en';
export const professionalItDeHref = '/professional-it';

export const professionalLegalPaths = {
  impressum: '/professional-it/impressum',
  datenschutz: '/professional-it/datenschutz',
} as const;

export const professionalLegalPathsEn = {
  imprint: '/professional-it/en/imprint',
  privacy: '/professional-it/en/privacy',
} as const;

export const navLinkClass =
  'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface-light)] hover:text-[var(--color-base-dark)]';

export const navLinkMobileClass =
  'block rounded-xl px-4 py-3 text-base font-medium text-[var(--color-base-dark)] transition-colors hover:bg-[var(--color-surface-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

export const langLinkClass =
  'inline-flex items-center rounded-full border border-[var(--color-border-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/30 hover:text-[var(--color-base-dark)]';

/**
 * Anker auf /professional-it; auf Legal-/Sub-Routen voller Pfad.
 */
export function resolveProfessionalNavHref(hash: string, pathname: string, baseHref = professionalItHref): string {
  const current = pathname.replace(/\/$/, '') || '/';
  if (current === baseHref) {
    return hash;
  }
  if (current.startsWith(`${baseHref}/`)) {
    return `${baseHref}${hash}`;
  }
  return `${baseHref}${hash}`;
}
