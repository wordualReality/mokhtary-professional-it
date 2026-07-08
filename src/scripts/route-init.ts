/**
 * @file src/scripts/route-init.ts
 * @summary Professional IT: lazy-load profil motion bundle.
 */
function currentPath(): string {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

function matches(...prefixes: string[]): boolean {
  const path = currentPath();
  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

if (matches('/', '/en')) {
  void import('./bundles/profil-bundle.ts');
}
