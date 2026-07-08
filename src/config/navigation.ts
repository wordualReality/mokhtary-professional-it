/**
 * @file src/config/navigation.ts
 * @summary Single source of truth für Header- und Footer-Navigation.
 */

export interface NavLink {
  href: string;
  label: string;
}

export interface NavCluster {
  id: 'growth' | 'systems';
  label: string;
  tone: 'growth' | 'systems';
  hub: string;
  hubLabel: string;
  links: NavLink[];
}

export const navClusters: NavCluster[] = [
  {
    id: 'growth',
    label: 'Wachstum',
    tone: 'growth',
    hub: '/wachstum',
    hubLabel: 'Wachstum',
    links: [
      { href: '/webdesign', label: 'Webdesign · SEO' },
      { href: '/social-media', label: 'Social Media' },
    ],
  },
  {
    id: 'systems',
    label: 'Systeme',
    tone: 'systems',
    hub: '/systeme',
    hubLabel: 'Systeme',
    links: [
      { href: '/ki-automation', label: 'KI-Automation' },
      { href: '/apps', label: 'Apps' },
    ],
  },
];

export const professionalItHref = '/';

export function resolveActiveClusterId(pathname: string): NavCluster['id'] | null {
  const current = pathname.replace(/\/$/, '') || '/';
  return (
    navClusters.find((c) => c.hub === current || c.links.some((l) => l.href === current))?.id ??
    null
  );
}
