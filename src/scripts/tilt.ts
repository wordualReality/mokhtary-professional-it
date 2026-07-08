/**
 * @file src/scripts/tilt.ts
 * @summary Parallax-Tilt für `[data-tilt]` / `.tilt-scene`: setzt `--tx`/`--ty` für CSS-Perspective. Skip bei reduced-motion und Touch.
 */

type TiltEl = HTMLElement & { __tiltBound?: boolean };

const SELECTOR = '[data-tilt]';

/** Kein Effekt bei SSR, reduced-motion oder Touch-Pointer. */
function shouldSkip(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (window.matchMedia('(pointer: coarse)').matches) return true;
  return false;
}

/** Schreibt bei Pointermove `--tx`/`--ty` (-1…1) für CSS-Perspective auf dem Element. */
function attach(el: TiltEl): void {
  if (el.__tiltBound) return;
  el.__tiltBound = true;

  let raf = 0;
  let tx = 0;
  let ty = 0;
  let active = false;

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    tx = Math.max(-1, Math.min(1, nx));
    ty = Math.max(-1, Math.min(1, ny));
    active = true;

    if (!raf) {
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--tx', tx.toFixed(3));
        el.style.setProperty('--ty', ty.toFixed(3));
        raf = 0;
      });
    }
  };

  const onLeave = () => {
    tx = 0; ty = 0; active = false;
    el.style.setProperty('--tx', '0');
    el.style.setProperty('--ty', '0');
  };

  el.addEventListener('pointermove', onMove, { passive: true });
  el.addEventListener('pointerleave', onLeave);
  el.addEventListener('pointerdown', onLeave);
}

/** Alle `[data-tilt]`-Elemente anbinden. */
function init(): void {
  if (shouldSkip()) return;
  document.querySelectorAll<TiltEl>(SELECTOR).forEach(attach);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}
