/**
 * @file src/data/profil-content.locale.ts
 * @summary Locale-Loader für Professional-IT-Content.
 */
import * as de from './profil-content';
import * as en from './profil-content.en';

export type ProfilLocale = 'de' | 'en';

const bundles = { de, en } as const;

export function getProfilContent(locale: ProfilLocale = 'de') {
  return bundles[locale];
}

export { de, en };
