/**
 * @file src/scripts/profil-scheduling-dialog.ts
 * @summary Site-weit: Terminwahl als natives `<dialog id="profil-terminwahl-dialog">` — Top-Layer, Fokus, History (push/popstate/replace), Opener-Links.
 *
 * ## Inventar Opener (Hash `#terminwahl`)
 * - [src/components/scheduling/SchedulingDialog.astro](SchedulingDialog.astro) — Markup (in [BaseLayout.astro](../layouts/BaseLayout.astro))
 * - [src/components/profil/ProfilHero.astro](ProfilHero.astro) — Hero `/professional-it`
 * - [src/components/profil/ProfilInsightsSection.astro](ProfilInsightsSection.astro) — Fließtext-Link
 * - [src/components/home/HomeHero.astro](HomeHero.astro) und Cluster-Hub-Heroes (`webdesign`, `social-media`, `wachstum`, `systeme`, `systeme-ki`) — Primär-CTA
 *
 * ## Konfliktpotenzial (global `document`)
 * - [src/scripts/site-header.ts](site-header.ts) — schließt Nav bei Klick außerhalb; kein `preventDefault` auf Profil-Links.
 * - Kein weiteres Modul kennt `#terminwahl`; Listener hier kapseln.
 *
 * ## History
 * - Öffnen ohne bestehenden Hash: `pushState({ profilScheduling: 1 })` → Browser-Zurück schließt Dialog.
 * - Deeplink `/#terminwahl` or `/en#terminwahl`: no push; close clears hash via `replaceState`.
 * - `popstate`: Dialog schließen, wenn Hash nicht mehr `#terminwahl`.
 *
 * ## Manuelle Regression (Kurz)
 * - Hero + Fließtext öffnen; kein Seiten-Scroll; Escape + Backdrop + Schließen-Button; Fokus zurück auf Opener.
 * - Deeplink Reload mit `#terminwahl`; Schließen entfernt Hash ohne Sprung.
 * - Nach Push geöffnet: Browser-Zurück schließt; `prefers-reduced-motion`: Animation aus (CSS).
 * - Link „Zum Formular“ im Panel: Dialog zu, Scroll zu `#kontakt`.
 */

const TERMIN_HASH = '#terminwahl';

const HISTORY_STATE_KEY = 'profilScheduling' as const;

function isTerminwahlOpener(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const a = target.closest('a[href]');
  if (!a) return false;
  const raw = a.getAttribute('href');
  if (raw === TERMIN_HASH) return true;
  try {
    const u = new URL(a.href, location.href);
    return u.hash === TERMIN_HASH && u.pathname === location.pathname;
  } catch {
    return false;
  }
}

function stripTerminHash(): void {
  if (location.hash !== TERMIN_HASH) return;
  history.replaceState(null, '', `${location.pathname}${location.search}`);
}

function pushTerminHash(): void {
  if (location.hash === TERMIN_HASH) return;
  const u = new URL(location.href);
  u.hash = TERMIN_HASH.slice(1);
  history.pushState({ [HISTORY_STATE_KEY]: 1 }, '', u);
}

function initProfilSchedulingDialog(): void {
  const el = document.getElementById('profil-terminwahl-dialog');
  if (!el || !(el instanceof HTMLDialogElement)) return;

  let lastOpener: HTMLElement | null = null;
  let openedWithHistoryPush = false;
  let skipCloseUrlSync = false;

  const syncOpenFromHash = (): void => {
    if (location.hash !== TERMIN_HASH) return;
    if (!el.open) {
      el.showModal();
      openedWithHistoryPush = false;
    }
  };

  syncOpenFromHash();

  window.addEventListener('hashchange', () => {
    if (location.hash === TERMIN_HASH) {
      if (!el.open) {
        el.showModal();
        openedWithHistoryPush = false;
      }
      return;
    }
    if (el.open) {
      skipCloseUrlSync = true;
      el.close();
    }
  });

  window.addEventListener('popstate', () => {
    if (!el.open) return;
    if (location.hash !== TERMIN_HASH) {
      skipCloseUrlSync = true;
      el.close();
    }
  });

  document.addEventListener(
    'click',
    (e) => {
      if (!isTerminwahlOpener(e.target)) return;
      e.preventDefault();
      lastOpener = (e.target instanceof Element ? e.target.closest('a[href]') : null) as HTMLElement | null;
      if (!el.open) {
        el.showModal();
        if (location.hash !== TERMIN_HASH) {
          pushTerminHash();
          openedWithHistoryPush = true;
        } else {
          openedWithHistoryPush = false;
        }
      }
    },
    true
  );

  /** Schließen-Button: direkt binden (zuverlässiger als Delegation auf dem Dialog bei Top-Layer/SVG-Zielen). */
  el.querySelectorAll<HTMLElement>('[data-scheduling-close]').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      el.close();
    });
  });

  el.addEventListener('click', (e) => {
    if (e.target === el) {
      el.close();
    }
    const t = e.target;
    if (!(t instanceof Element)) return;
    const kontakt = t.closest('a[href="#kontakt"]');
    if (kontakt && el.contains(kontakt)) {
      el.close();
    }
  });

  el.addEventListener('close', () => {
    const opener = lastOpener;
    lastOpener = null;

    if (skipCloseUrlSync) {
      skipCloseUrlSync = false;
      openedWithHistoryPush = false;
      queueMicrotask(() => opener?.focus());
      return;
    }

    if (openedWithHistoryPush && history.state?.[HISTORY_STATE_KEY]) {
      openedWithHistoryPush = false;
      history.back();
      queueMicrotask(() => opener?.focus());
      return;
    }

    openedWithHistoryPush = false;
    stripTerminHash();
    queueMicrotask(() => opener?.focus());
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initProfilSchedulingDialog(), { once: true });
} else {
  initProfilSchedulingDialog();
}
