/**
 * @file src/config/site-variant.ts
 * @summary Site-Kontext: main (Marketing) vs. professional (Professional IT).
 * `variant="launch"` auf Header/Footer ist ein Alias für professional.
 */

export type SiteVariant = 'main' | 'professional';

/** Header/Footer-Prop — launch bleibt für Abwärtskompatibilität. */
export type ShellVariant = 'default' | 'launch';

export function resolveSiteVariant(variant: ShellVariant = 'default'): SiteVariant {
  return variant === 'launch' ? 'professional' : 'main';
}

export function isProfessionalShell(variant: ShellVariant = 'default'): boolean {
  return resolveSiteVariant(variant) === 'professional';
}

/** Professional-IT-Standalone-Routen (Root One-Pager). */
export function isProfessionalRoute(pathname: string): boolean {
  const current = pathname.replace(/\/$/, '') || '/';
  if (current === '/' || current === '/en' || current === '/impressum' || current === '/datenschutz') {
    return true;
  }
  return current.startsWith('/en/');
}
