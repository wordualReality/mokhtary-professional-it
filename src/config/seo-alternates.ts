/**
 * @file src/config/seo-alternates.ts
 * @summary Canonical und hreflang fuer mokhtary.de. Deutsch und Englisch beide auf mokhtary.de (mokhtary.com vorerst entkoppelt, bis es fuer Kunden freigegeben ist).
 */

export const MOKHTARY_DE_ORIGIN = 'https://mokhtary.de';
export const MOKHTARY_COM_ORIGIN = 'https://mokhtary.com';

function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, '') || '/';
}

function originUrl(origin: string, path: string): string {
  const normalized = path.replace(/\/$/, '') || '/';
  return new URL(normalized, `${origin}/`).toString();
}

const pathToDeOnDe: Record<string, string> = {
  '/': '/',
  '/en': '/',
  '/impressum': '/impressum',
  '/datenschutz': '/datenschutz',
  '/en/imprint': '/impressum',
  '/en/privacy': '/datenschutz',
};

const pathToEnOnDe: Record<string, string> = {
  '/': '/en',
  '/en': '/en',
  '/impressum': '/en/imprint',
  '/datenschutz': '/en/privacy',
  '/en/imprint': '/en/imprint',
  '/en/privacy': '/en/privacy',
};

export function resolveSeoForMokhtaryDe(
  pathname: string,
  locale: 'de' | 'en',
): { canonical: string; de: string; en: string; xDefault: string } {
  const path = normalizePath(pathname);
  const dePath = pathToDeOnDe[path] ?? (path.startsWith('/en') ? '/' : path);
  const enPath = pathToEnOnDe[path] ?? (path.startsWith('/en') ? path : '/en');
  const de = originUrl(MOKHTARY_DE_ORIGIN, dePath);
  const en = originUrl(MOKHTARY_DE_ORIGIN, enPath);
  const canonical = locale === 'en' ? en : de;
  return { canonical, de, en, xDefault: de };
}
