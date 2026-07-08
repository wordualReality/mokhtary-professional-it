/**
 * @file src/scripts/magnetic.ts
 * @summary CTAs mit `data-magnetic`: setzt `--mx`/`--my` für leichten Cursor-Zug (interactions.css). Respektiert reduced-motion und Touch.
 */

type MagneticEl = HTMLElement & { __magneticBound?: boolean };

const SELECTOR = '[data-magnetic]';
const ACTIVE_RADIUS_PX = 160; // ausserhalb dieses Radius schaltet der Effekt weich ab

/** Kein Effekt bei SSR, reduced-motion oder grobem Pointer (Touch). */
function shouldSkip(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (window.matchMedia('(pointer: coarse)').matches) return true;
  return false;
}

/** Bindet document-pointermove: setzt `--mx`/`--my` relativ zum Cursor (siehe interactions.css). */
function attach(el: MagneticEl): void {
  if (el.__magneticBound) return;
  el.__magneticBound = true;

  let raf = 0;
  let tx = 0;
  let ty = 0;

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    // outside radius softly ramp to 0
    const falloff = Math.max(0, 1 - dist / (ACTIVE_RADIUS_PX + Math.max(rect.width, rect.height) / 2));

    // normalise to -0.5 ... 0.5 range relative to button size
    tx = Math.max(-0.5, Math.min(0.5, (dx / rect.width))) * falloff;
    ty = Math.max(-0.5, Math.min(0.5, (dy / rect.height))) * falloff;

    if (!raf) {
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', tx.toFixed(3));
        el.style.setProperty('--my', ty.toFixed(3));
        raf = 0;
      });
    }
  };

  const onLeave = () => {
    tx = 0; ty = 0;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
  };

  // use pointermove scoped to the viewport so the effect reacts even
  // when cursor is near the button but not over it
  const onDocMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < ACTIVE_RADIUS_PX + Math.max(rect.width, rect.height) / 2) {
      onMove(e);
    } else if (tx !== 0 || ty !== 0) {
      onLeave();
    }
  };

  document.addEventListener('pointermove', onDocMove, { passive: true });
  el.addEventListener('pointerleave', onLeave);
}

/** Alle `[data-magnetic]` registrieren, sofern der Effekt nicht übersprungen wird. */
function init(): void {
  if (shouldSkip()) return;
  document.querySelectorAll<MagneticEl>(SELECTOR).forEach(attach);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}
