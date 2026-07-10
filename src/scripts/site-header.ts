/**
 * @file src/scripts/site-header.ts
 * @summary Site-Header unter `[data-site-header]`: Mobile-Panel, Nav-Cluster-Disclosures, Fokus-Fallen.
 */

/** Tab-fokussierbare Controls innerhalb eines Containers (für Fokus-Falle). */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

/** Burger-Panel, Backdrop, Escape und Tab-Falle für die mobile Navigation. */
function initMobilePanel(root: HTMLElement): void {
  const toggle = root.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
  const backdrop = root.querySelector<HTMLElement>('[data-nav-backdrop]');
  if (!toggle || !panel || !backdrop) return;

  let open = false;

  const setOpen = (next: boolean) => {
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    panel.hidden = !next;
    backdrop.hidden = !next;
    toggle.setAttribute('aria-label', next ? 'Navigation schließen' : 'Navigation öffnen');
    document.body.classList.toggle('overflow-hidden', next);

    if (next) {
      requestAnimationFrame(() => getFocusableElements(panel)[0]?.focus());
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!open);
  });
  backdrop.addEventListener('click', () => setOpen(false));

  panel.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    if (!open) return;
    const target = e.target as Node;
    if (panel.contains(target) || toggle.contains(target) || backdrop.contains(target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (!open || e.key !== 'Escape') return;
    e.preventDefault();
    setOpen(false);
  });

  panel.addEventListener('keydown', (e) => {
    if (!open || e.key !== 'Tab') return;
    const focusable = getFocusableElements(panel);
    if (focusable.length < 2) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/** Desktop-Cluster-Dropdowns im Header (Klick, Tastatur, optional Hover). */
function initClusterDisclosures(root: HTMLElement): void {
  const clusters = Array.from(
    root.querySelectorAll<HTMLElement>('[data-nav-cluster]')
  );
  if (!clusters.length) return;

  const hoverCapable = window.matchMedia('(hover: hover)').matches;
  let hoverCloseTimer: number | undefined;

  const closeAll = (except?: HTMLElement) => {
    clusters.forEach((c) => {
      if (c === except) return;
      const btn = c.querySelector<HTMLButtonElement>('[data-nav-cluster-toggle]');
      const panel = c.querySelector<HTMLElement>('[data-nav-cluster-panel]');
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    });
  };

  const setOpen = (cluster: HTMLElement, next: boolean) => {
    const btn = cluster.querySelector<HTMLButtonElement>('[data-nav-cluster-toggle]');
    const panel = cluster.querySelector<HTMLElement>('[data-nav-cluster-panel]');
    if (!btn || !panel) return;
    btn.setAttribute('aria-expanded', String(next));
    panel.hidden = !next;
    if (next) closeAll(cluster);
  };

  clusters.forEach((cluster) => {
    const btn = cluster.querySelector<HTMLButtonElement>('[data-nav-cluster-toggle]');
    const panel = cluster.querySelector<HTMLElement>('[data-nav-cluster-panel]');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      setOpen(cluster, !isOpen);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || (e.key === 'Enter' && btn.getAttribute('aria-expanded') === 'false')) {
        e.preventDefault();
        setOpen(cluster, true);
        requestAnimationFrame(() => getFocusableElements(panel)[0]?.focus());
      } else if (e.key === 'Escape') {
        setOpen(cluster, false);
      }
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setOpen(cluster, false);
        btn.focus();
      }
    });

    if (hoverCapable) {
      cluster.addEventListener('mouseenter', () => {
        window.clearTimeout(hoverCloseTimer);
        setOpen(cluster, true);
      });
      cluster.addEventListener('mouseleave', () => {
        hoverCloseTimer = window.setTimeout(() => setOpen(cluster, false), 120);
      });
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    const inside = clusters.some((c) => c.contains(target));
    if (!inside) closeAll();
  });
}

/** Einstieg: findet den Header und initialisiert Panel + Cluster. */
function initSiteHeader(): void {
  const root = document.querySelector<HTMLElement>('[data-site-header]');
  if (!root) return;
  initMobilePanel(root);
  initClusterDisclosures(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSiteHeader);
} else {
  initSiteHeader();
}
