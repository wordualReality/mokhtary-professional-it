/**
 * @file src/scripts/reveal.ts
 * @summary Scroll-Reveal für `[data-reveal]`: IntersectionObserver setzt `.is-revealed`; Fallback ohne Observer oder bei reduced-motion.
 */

/** Attribut, das Scroll-Reveal-Elemente markiert (muss zu interactions.css passen). */
const REVEAL_ATTR = 'data-reveal';
/** Klasse auf Elementen, die sichtbar „eingeblendet“ sind (siehe interactions.css). */
const REVEAL_CLASS = 'is-revealed';

const REVEAL_REPEAT_ATTR = 'data-reveal-repeat';
const SKIP_REVEAL_REPEAT_PREFIXES = ['/professional-it', '/profil', '/social-media'];

const REVEAL_READY_CLASS = 'js-reveal-ready';

/** Setzt sofort die Endzustände aller Reveal-Elemente (kein Scroll nötig). */
function revealImmediately(): void {
  document.querySelectorAll<HTMLElement>(`[${REVEAL_ATTR}]`).forEach((el) => {
    el.classList.add(REVEAL_CLASS);
  });
  document.documentElement.classList.add(REVEAL_READY_CLASS);
}

function isAboveFold(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

function shouldRepeatReveal(): boolean {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return !SKIP_REVEAL_REPEAT_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** Startet IntersectionObserver für alle `[data-reveal]` oder revealed sofort. */
function initReveal(): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches || typeof IntersectionObserver === 'undefined') {
    revealImmediately();
    return;
  }

  const repeatAll = shouldRepeatReveal();

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        const repeat = repeatAll || el.hasAttribute(REVEAL_REPEAT_ATTR);

        if (entry.isIntersecting) {
          el.classList.add(REVEAL_CLASS);
          if (!repeat) obs.unobserve(el);
        } else if (repeat) {
          el.classList.remove(REVEAL_CLASS);
        }
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12,
    },
  );

  const elements = document.querySelectorAll<HTMLElement>(`[${REVEAL_ATTR}]`);
  elements.forEach((el) => {
    if (isAboveFold(el)) el.classList.add(REVEAL_CLASS);
    observer.observe(el);
  });
  document.documentElement.classList.add(REVEAL_READY_CLASS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal, { once: true });
} else {
  initReveal();
}
