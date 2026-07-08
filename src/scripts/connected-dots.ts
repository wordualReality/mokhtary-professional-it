/**
 * @file src/scripts/connected-dots.ts
 * @summary Canvas-Netzwerk-Hintergrund für `canvas[data-connected-dots]`: Partikel, Kanten, Pulse; Pause per IntersectionObserver.
 */

type Tone = 'neutral' | 'growth' | 'systems';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

type Pulse = {
  a: number;
  b: number;
  t: number;     // progress 0..1 along the segment
  speed: number; // per frame increment
};

type Instance = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  pulses: Pulse[];
  pulseCooldown: number;
  dpr: number;
  width: number;
  height: number;
  dotColor: string;
  lineColor: string;
  pulseColor: string;
  density: number;
  linkDistance: number;
  running: boolean;
  rafId: number | null;
  mouseX: number;
  mouseY: number;
  hasMouse: boolean;
};

const PALETTE: Record<Tone, { dot: string; line: string; pulse: string }> = {
  neutral: {
    dot: 'rgba(57, 91, 100, 0.55)',
    line: 'rgba(57, 91, 100, 0.18)',
    pulse: 'rgba(108, 91, 123, 0.95)',
  },
  growth: {
    dot: 'rgba(108, 91, 123, 0.60)',
    line: 'rgba(108, 91, 123, 0.20)',
    pulse: 'rgba(155, 142, 199, 0.95)',
  },
  systems: {
    dot: 'rgba(94, 132, 140, 0.60)',
    line: 'rgba(94, 132, 140, 0.20)',
    pulse: 'rgba(147, 191, 199, 0.95)',
  },
};

const DOT_COUNT_MULTIPLIER = 1.05;
const DOT_RADIUS_SCALE = 1.5;
const PULSE_RADIUS_SCALE = 1.5;

const instances: Instance[] = [];
let sharedReduceMotion = false;
let visibilityObserver: IntersectionObserver | null = null;

/** Passt Canvas-Pixelmaß an CSS-Größe und DPR an. */
function sizeCanvas(i: Instance): void {
  const rect = i.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  i.dpr = dpr;
  i.width = rect.width;
  i.height = rect.height;
  i.canvas.width = Math.floor(rect.width * dpr);
  i.canvas.height = Math.floor(rect.height * dpr);
  i.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/** Erzeugt Partikelanzahl abhängig von Fläche und Dichte. */
function seedParticles(i: Instance): void {
  const area = i.width * i.height;
  const target = Math.max(
    22,
    Math.min(100, Math.round((area / 15000) * i.density * DOT_COUNT_MULTIPLIER)),
  );
  i.particles = [];
  for (let n = 0; n < target; n++) {
    i.particles.push({
      x: Math.random() * i.width,
      y: Math.random() * i.height,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      r: (Math.random() * 0.9 + 0.9) * DOT_RADIUS_SCALE,
    });
  }
}

/**
 * Erzeugt in Abständen einen Puls auf einer Kante zwischen zwei nahen Partikeln (nur wenn nicht reduced-motion).
 */
function maybeSpawnPulse(i: Instance): void {
  if (sharedReduceMotion) return;
  i.pulseCooldown -= 1;
  if (i.pulseCooldown > 0) return;
  // re-randomise cooldown: roughly 2.5 - 5.5 seconds at 60fps
  i.pulseCooldown = 150 + Math.floor(Math.random() * 180);

  const n = i.particles.length;
  if (n < 2) return;
  // pick a random particle and find a connected neighbour
  const a = Math.floor(Math.random() * n);
  const pa = i.particles[a];
  const candidates: number[] = [];
  for (let b = 0; b < n; b++) {
    if (b === a) continue;
    const pb = i.particles[b];
    const dx = pa.x - pb.x;
    const dy = pa.y - pb.y;
    if (dx * dx + dy * dy < i.linkDistance * i.linkDistance) {
      candidates.push(b);
    }
  }
  if (!candidates.length) return;
  const b = candidates[Math.floor(Math.random() * candidates.length)];
  i.pulses.push({
    a,
    b,
    t: 0,
    speed: 0.012 + Math.random() * 0.008,
  });
}

/** Zeichnet laufende Pulse entlang der Kanten (Kopf + Halo, Alpha per Fortschritt). */
function drawPulses(i: Instance): void {
  const { ctx, particles, pulses, pulseColor } = i;
  for (let k = pulses.length - 1; k >= 0; k--) {
    const pulse = pulses[k];
    const pa = particles[pulse.a];
    const pb = particles[pulse.b];
    if (!pa || !pb) {
      pulses.splice(k, 1);
      continue;
    }
    pulse.t += pulse.speed;
    if (pulse.t >= 1) {
      pulses.splice(k, 1);
      continue;
    }

    const x = pa.x + (pb.x - pa.x) * pulse.t;
    const y = pa.y + (pb.y - pa.y) * pulse.t;
    // head: bright filled circle
    ctx.globalAlpha = Math.sin(pulse.t * Math.PI);
    ctx.fillStyle = pulseColor;
    ctx.beginPath();
    ctx.arc(x, y, 2.4 * PULSE_RADIUS_SCALE, 0, Math.PI * 2);
    ctx.fill();
    // halo
    ctx.globalAlpha = Math.sin(pulse.t * Math.PI) * 0.35;
    ctx.beginPath();
    ctx.arc(x, y, 6 * PULSE_RADIUS_SCALE, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Ein Simulationsschritt: Partikel bewegen, Kanten zeichnen, Punkte, Pulse. */
function step(i: Instance): void {
  const { ctx, particles, width, height, linkDistance, dotColor, lineColor } = i;
  ctx.clearRect(0, 0, width, height);

  maybeSpawnPulse(i);

  for (const p of particles) {
    if (!sharedReduceMotion) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      if (i.hasMouse) {
        const dx = p.x - i.mouseX;
        const dy = p.y - i.mouseY;
        const d2 = dx * dx + dy * dy;
        const radius = 120;
        if (d2 < radius * radius && d2 > 1) {
          const d = Math.sqrt(d2);
          const push = (radius - d) / radius * 0.25;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
      }
    }
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = lineColor;
  for (let a = 0; a < particles.length; a++) {
    const pa = particles[a];
    for (let b = a + 1; b < particles.length; b++) {
      const pb = particles[b];
      const dx = pa.x - pb.x;
      const dy = pa.y - pb.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < linkDistance * linkDistance) {
        const d = Math.sqrt(d2);
        const alpha = 1 - d / linkDistance;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = dotColor;
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPulses(i);
}

/** requestAnimationFrame-Schleife pro Canvas-Instanz. */
function loop(i: Instance): void {
  if (!i.running) return;
  step(i);
  if (!sharedReduceMotion) {
    i.rafId = requestAnimationFrame(() => loop(i));
  }
}

/** Startet die Animationsschleife für eine Instanz. */
function start(i: Instance): void {
  if (i.running) return;
  i.running = true;
  loop(i);
}

/** Beendet rAF und setzt running zurück. */
function stop(i: Instance): void {
  i.running = false;
  if (i.rafId !== null) {
    cancelAnimationFrame(i.rafId);
    i.rafId = null;
  }
}

/** Zeigerposition relativ zum Canvas für leichte Maus-Abstoßung der Partikel. */
function attachPointer(i: Instance): void {
  const host = i.canvas.parentElement ?? i.canvas;
  host.addEventListener('pointermove', (e) => {
    const rect = i.canvas.getBoundingClientRect();
    i.mouseX = e.clientX - rect.left;
    i.mouseY = e.clientY - rect.top;
    i.hasMouse = true;
  });
  host.addEventListener('pointerleave', () => {
    i.hasMouse = false;
  });
}

/** Nach Fenster-Resize alle Instanzen neu ausmessen (und ggf. einen Stillstand-Frame zeichnen). */
function resizeAll(): void {
  for (const i of instances) {
    sizeCanvas(i);
    seedParticles(i);
    if (sharedReduceMotion) step(i);
  }
}

/** Sucht alle Dot-Canvases, registriert Resize/Observer und Start/Stop je Sichtbarkeit. */
function init(): void {
  const canvases = document.querySelectorAll<HTMLCanvasElement>('canvas[data-connected-dots]');
  if (!canvases.length) return;

  sharedReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const tone = (canvas.dataset.tone as Tone) || 'neutral';
    const palette = PALETTE[tone] ?? PALETTE.neutral;
    const density = parseFloat(canvas.dataset.density || '1');
    const linkDistance = parseFloat(canvas.dataset.linkDistance || '130');

    const instance: Instance = {
      canvas,
      ctx,
      particles: [],
      pulses: [],
      pulseCooldown: 60 + Math.floor(Math.random() * 120),
      dpr: 1,
      width: 0,
      height: 0,
      dotColor: palette.dot,
      lineColor: palette.line,
      pulseColor: palette.pulse,
      density,
      linkDistance,
      running: false,
      rafId: null,
      mouseX: 0,
      mouseY: 0,
      hasMouse: false,
    };

    sizeCanvas(instance);
    seedParticles(instance);
    attachPointer(instance);
    instances.push(instance);

    if (sharedReduceMotion) {
      step(instance);
    }
  });

  if ('IntersectionObserver' in window) {
    visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = instances.find((x) => x.canvas === entry.target);
          if (!i) return;
          if (entry.isIntersecting && !sharedReduceMotion) {
            start(i);
          } else {
            stop(i);
          }
        });
      },
      { threshold: 0 }
    );
    instances.forEach((i) => visibilityObserver?.observe(i.canvas));
  } else if (!sharedReduceMotion) {
    instances.forEach(start);
  }

  window.addEventListener('resize', () => {
    requestAnimationFrame(resizeAll);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
