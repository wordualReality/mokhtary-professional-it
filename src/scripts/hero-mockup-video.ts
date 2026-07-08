/**
 * @file src/scripts/hero-mockup-video.ts
 * @summary Hero-Mockups: Loop im Viewport oder einmaliges Abspielen pro Scroll-Eintritt.
 */

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureSource(video: HTMLVideoElement): void {
  if (video.querySelector('source')) return;
  const src = video.dataset.heroMockupSrc;
  if (!src) return;
  const source = document.createElement('source');
  source.src = src;
  source.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
  video.appendChild(source);
  video.load();
}

function setLive(host: HTMLElement, on: boolean): void {
  host.classList.toggle('is-mockup-live', on);
}

function resetToPoster(host: HTMLElement, video: HTMLVideoElement): void {
  video.pause();
  video.currentTime = 0;
  setLive(host, false);
}

function playLoop(host: HTMLElement, video: HTMLVideoElement): void {
  ensureSource(video);
  video.muted = true;
  video.loop = true;
  void video
    .play()
    .then(() => setLive(host, true))
    .catch(() => setLive(host, false));
}

function playOnce(host: HTMLElement, video: HTMLVideoElement): void {
  ensureSource(video);
  video.muted = true;
  video.loop = false;
  video.currentTime = 0;
  void video
    .play()
    .then(() => setLive(host, true))
    .catch(() => setLive(host, false));
}

function initHost(host: HTMLElement, reduced: boolean): void {
  const video = host.querySelector<HTMLVideoElement>('[data-hero-mockup-video]');
  if (!video) return;

  const playback = host.dataset.heroMockupPlayback === 'enter-once' ? 'enter-once' : 'loop';

  if (reduced) {
    resetToPoster(host, video);
    return;
  }

  if (typeof IntersectionObserver === 'undefined') return;

  let inView = false;
  let canPlayOnEnter = true;

  const onEnded = () => {
    resetToPoster(host, video);
    canPlayOnEnter = false;
  };

  if (playback === 'enter-once') {
    video.addEventListener('ended', onEnded);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((e) => e.isIntersecting);

      if (visible && !inView) {
        inView = true;
        if (playback === 'enter-once' && canPlayOnEnter) {
          playOnce(host, video);
        } else if (playback === 'loop') {
          playLoop(host, video);
        }
        return;
      }

      if (!visible && inView) {
        inView = false;
        resetToPoster(host, video);
        if (playback === 'enter-once') {
          canPlayOnEnter = true;
        }
      }
    },
    { threshold: 0.28, rootMargin: '0px 0px -6% 0px' },
  );

  observer.observe(host.closest('.showroom-stack') ?? host);
}

function initHeroMockupVideos(): void {
  const hosts = [...document.querySelectorAll<HTMLElement>('[data-hero-mockup]')];
  if (hosts.length === 0) return;

  const reduced = prefersReducedMotion();
  hosts.forEach((host) => initHost(host, reduced));

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    hosts.forEach((host) => {
      const video = host.querySelector<HTMLVideoElement>('[data-hero-mockup-video]');
      if (video) resetToPoster(host, video);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroMockupVideos, { once: true });
} else {
  initHeroMockupVideos();
}
