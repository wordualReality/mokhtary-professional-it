// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mokhtary.de',
  output: 'static',
  trailingSlash: 'never',
  redirects: {
    '/profil': { status: 301, destination: '/professional-it' },
    '/it-consulting': { status: 301, destination: '/professional-it' },
    '/seo': { status: 301, destination: '/professional-it' },
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      filter: (page) => page.includes('/professional-it'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
