/**
 * @file src/config/seo-alternates.ts
 * @summary Canonical und hreflang fuer mokhtary.de. Deutsch hier, Englisch auf mokhtary.com.
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

const pathToEnOnCom: Record<string, string> = {
  '/': '/',
  '/en': '/',
  '/impressum': '/imprint',
  '/datenschutz': '/privacy',
  '/en/imprint': '/imprint',
  '/en/privacy': '/privacy',
};

export function resolveSeoForMokhtaryDe(
  pathname: string,
  locale: 'de' | 'en',
): { canonical: string; de: string; en: string; xDefault: string } {
  const path = normalizePath(pathname);
  const dePath = pathToDeOnDe[path] ?? (path.startsWith('/en') ? '/' : path);
  const enPath = pathToEnOnCom[path] ?? '/';
  const de = originUrl(MOKHTARY_DE_ORIGIN, dePath);
  const en = originUrl(MOKHTARY_COM_ORIGIN, enPath);
  const canonical = locale === 'en' ? en : originUrl(MOKHTARY_DE_ORIGIN, dePath === path ? path : dePath);
  return { canonical, de, en, xDefault: de };
}
