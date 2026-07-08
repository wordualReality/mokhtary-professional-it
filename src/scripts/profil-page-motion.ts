/**
 * @file src/scripts/profil-page-motion.ts
 * @summary Interaktive Mocks auf `/professional-it` (Kanban, Skills, Insights, Hero-Checklist).
 */

import {
  profilMockupFrames,
  type ProfilMockupFrameId,
} from '../data/profil-mockup-frames';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const PP_FLOW_ORDER = ['fach', 'req', 'build', 'run'] as const;

const PP_LANE_BY_STEP: Record<(typeof PP_FLOW_ORDER)[number], string> = {
  fach: 'backlog',
  req: 'scope',
  build: 'scope',
  run: 'uat',
};

const PP_FLOW_STEP_MS = 1600;
const PP_FLOW_RESUME_MS = 3200;

function initKanban(panel: HTMLElement): void {
  const board = panel.querySelector<HTMLElement>('[data-pp-board]');
  const flow = panel.querySelector<HTMLElement>('[data-pp-flow]');
  if (!board || !flow) return;

  const lanes = [...board.querySelectorAll<HTMLButtonElement>('[data-pp-lane]')];
  const flowNodes = [...flow.querySelectorAll<HTMLButtonElement>('[data-pp-flow-step]')];
  const reduced = prefersReducedMotion();
  let stepIndex = 0;
  let loopTimer: ReturnType<typeof setInterval> | null = null;
  let resumeTimer: ReturnType<typeof setTimeout> | null = null;
  let panelVisible = false;
  let autoEnabled = false;

  const applyFlowIndex = (index: number, laneOverride: string | null | undefined = undefined) => {
    stepIndex = index;
    const stepName = PP_FLOW_ORDER[index] ?? 'fach';
    flow.dataset.ppFlowIndex = String(index);
    flow.classList.add('is-flow-live');

    flowNodes.forEach((node) => {
      const nodeIndex = Number(node.dataset.ppFlowIndex ?? '0');
      node.classList.toggle('is-active', nodeIndex === index);
      node.classList.toggle('is-done', nodeIndex < index);
      node.setAttribute('aria-pressed', nodeIndex === index ? 'true' : 'false');
    });

    const mappedLane =
      laneOverride === undefined ? PP_LANE_BY_STEP[stepName] : laneOverride;

    lanes.forEach((lane) => {
      const on = mappedLane !== null && lane.dataset.ppLane === mappedLane;
      lane.classList.toggle('is-active', on);
      lane.setAttribute('aria-pressed', on ? 'true' : 'false');
      const meta = lane.querySelector<HTMLElement>('[data-pp-meta]');
      if (!meta) return;
      const defaultText = lane.dataset.ppMetaDefault ?? '';
      const activeText = lane.dataset.ppMetaActive ?? defaultText;
      const buildText = lane.dataset.ppMetaBuild ?? activeText;
      if (!on) {
        meta.textContent = defaultText;
      } else if (stepName === 'build') {
        meta.textContent = buildText;
      } else {
        meta.textContent = activeText;
      }
    });

    panel.classList.toggle('is-active', mappedLane !== null);

    if (!reduced && mappedLane) {
      const activeLane = lanes.find((l) => l.dataset.ppLane === mappedLane);
      const stub = activeLane?.querySelector('.pp-board__stub');
      stub?.classList.add('is-pulsing');
      window.setTimeout(() => stub?.classList.remove('is-pulsing'), 700);
    }
  };

  const clearResumeTimer = () => {
    if (resumeTimer) window.clearTimeout(resumeTimer);
    resumeTimer = null;
  };

  const stopLoop = () => {
    if (loopTimer) window.clearInterval(loopTimer);
    loopTimer = null;
  };

  const startLoop = () => {
    if (!autoEnabled || reduced) return;
    stopLoop();
    loopTimer = window.setInterval(() => {
      applyFlowIndex((stepIndex + 1) % PP_FLOW_ORDER.length);
    }, PP_FLOW_STEP_MS);
  };

  const scheduleResumeLoop = () => {
    if (!autoEnabled || reduced) return;
    clearResumeTimer();
    resumeTimer = window.setTimeout(startLoop, PP_FLOW_RESUME_MS);
  };

  const pauseAutoForInteraction = () => {
    stopLoop();
    clearResumeTimer();
  };

  const setAutoEnabled = (on: boolean) => {
    autoEnabled = on;
    if (!on) {
      pauseAutoForInteraction();
      return;
    }
    if (reduced) {
      applyFlowIndex(3);
      return;
    }
    startLoop();
  };

  const resetFlow = () => {
    pauseAutoForInteraction();
    flow.classList.remove('is-flow-live');
    applyFlowIndex(0);
    if (panelVisible && autoEnabled && !reduced) startLoop();
  };

  const onManualStep = (index: number, laneOverride?: string) => {
    pauseAutoForInteraction();
    applyFlowIndex(index, laneOverride);
    scheduleResumeLoop();
  };

  applyFlowIndex(0);

  flowNodes.forEach((node) => {
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      const index = Number(node.dataset.ppFlowIndex ?? '0');
      onManualStep(index);
    });
  });

  lanes.forEach((lane) => {
    lane.addEventListener('click', () => {
      const id = lane.dataset.ppLane ?? '';
      const step = lane.dataset.ppFlowStep ?? 'fach';
      const stepIdx = PP_FLOW_ORDER.indexOf(step as (typeof PP_FLOW_ORDER)[number]);

      if (lane.classList.contains('is-active') && id === 'scope' && stepIndex === 1) {
        onManualStep(2, 'scope');
        return;
      }

      if (lane.classList.contains('is-active')) {
        resetFlow();
        return;
      }

      onManualStep(stepIdx >= 0 ? stepIdx : 0, id);
    });
    lane.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        lane.click();
      }
    });
  });

  const isPanelInView = () => {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    return rect.bottom > vh * 0.08 && rect.top < vh * 0.92;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      panelVisible = visible;
      if (visible) {
        setAutoEnabled(true);
      } else {
        setAutoEnabled(false);
        pauseAutoForInteraction();
        flow.classList.remove('is-flow-live');
        applyFlowIndex(0);
      }
    },
    { threshold: 0.22, rootMargin: '0px 0px -6% 0px' },
  );
  observer.observe(panel);

  if (reduced) {
    applyFlowIndex(3);
  } else if (isPanelInView()) {
    window.setTimeout(() => setAutoEnabled(true), 400);
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-pp-panel]')) return;
    if (!panelVisible) return;
    resetFlow();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') resetFlow();
  });
}

type TypeToken = { type: 'text' | 'tag'; value: string };

function htmlToTokens(html: string): TypeToken[] {
  const tokens: TypeToken[] = [];
  const parts = html.split(/(<[^>]+>)/).filter(Boolean);
  for (const part of parts) {
    tokens.push(
      part.startsWith('<') ? { type: 'tag', value: part } : { type: 'text', value: part },
    );
  }
  return tokens;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

type BizFlowController = {
  applyStep: (step: number) => void;
  startLoop: () => void;
  stopLoop: () => void;
  advance: () => void;
  reset: () => void;
};

function initBizFlow(card: HTMLElement, reduced: boolean): BizFlowController | null {
  const flow = card.querySelector<HTMLElement>('[data-biz-flow]');
  if (!flow) return null;

  const nodes = [...flow.querySelectorAll<HTMLElement>('.ps-viz__node[data-biz-step]')];
  let step = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  const applyStep = (next: number) => {
    step = next;
    flow.dataset.bizStep = String(next);
    card.dataset.bizStep = String(next);
    nodes.forEach((node) => {
      const nodeStep = Number(node.dataset.bizStep ?? '-1');
      node.classList.toggle('is-active', nodeStep === next);
    });
  };

  const stopLoop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const startLoop = () => {
    flow.classList.add('is-flow-live');
    if (reduced) {
      applyStep(2);
      return;
    }
    stopLoop();
    timer = window.setInterval(() => {
      applyStep((step + 1) % nodes.length);
    }, 1400);
  };

  const reset = () => {
    stopLoop();
    flow.classList.remove('is-flow-live');
    applyStep(0);
  };

  const advance = () => {
    applyStep((step + 1) % nodes.length);
  };

  applyStep(0);
  return { applyStep, startLoop, stopLoop, advance, reset };
}

function initSkills(grid: HTMLElement): void {
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-skill-card]')];
  const reduced = prefersReducedMotion();

  const techCard = cards.find((c) => c.dataset.skillCard === 'tech');
  const editor = techCard?.querySelector<HTMLElement>('[data-skill-typewriter]');
  const typeLines =
    editor == null
      ? []
      : [...editor.querySelectorAll<HTMLElement>('[data-type-line]')].map((code) => ({
          code,
          html: code.innerHTML,
          line: code.closest('.ps-viz__code-line'),
        }));

  let typewriterRunning = false;

  const runTypewriter = async (force = false) => {
    if (!editor || typeLines.length === 0) return;
    if (typewriterRunning && !force) return;
    if (editor.classList.contains('is-typed') && !force) return;

    if (reduced) {
      typeLines.forEach(({ code, html, line }) => {
        code.innerHTML = html;
        line?.classList.add('is-line-done');
      });
      editor.classList.add('is-typed', 'is-typed-complete');
      return;
    }

    typewriterRunning = true;
    editor.classList.remove('is-typed', 'is-typed-complete');
    typeLines.forEach(({ code, line }) => {
      code.innerHTML = '';
      line?.classList.remove('is-line-done', 'is-typing');
    });
    editor.classList.add('is-typewriting');

    for (const { code, html, line } of typeLines) {
      line?.classList.add('is-typing');
      code.innerHTML = '';
      let built = '';
      for (const token of htmlToTokens(html)) {
        if (token.type === 'tag') {
          built += token.value;
          code.innerHTML = built;
        } else {
          for (const ch of token.value) {
            built += ch;
            code.innerHTML = built;
            await sleep(14);
          }
        }
      }
      line?.classList.remove('is-typing');
      line?.classList.add('is-line-done');
      await sleep(60);
    }

    editor.classList.remove('is-typewriting');
    editor.classList.add('is-typed', 'is-typed-complete');
    typewriterRunning = false;
  };

  const bizFlows = new Map<HTMLElement, BizFlowController>();
  cards
    .filter((c) => c.dataset.skillCard === 'biz')
    .forEach((card) => {
      const flow = initBizFlow(card, reduced);
      if (flow) bizFlows.set(card, flow);
    });

  const langViz = cards
    .find((c) => c.dataset.skillCard === 'lang')
    ?.querySelector<HTMLElement>('[data-lang-viz]');

  const setLangLive = (on: boolean) => {
    if (!langViz) return;
    langViz.classList.toggle('is-lang-live', on);
    if (on && !reduced) {
      langViz.querySelectorAll<HTMLElement>('.ps-viz__meter').forEach((meter, i) => {
        window.setTimeout(() => meter.classList.add('is-meter-glow'), 50 + i * 90);
      });
    } else {
      langViz.querySelectorAll('.ps-viz__meter').forEach((meter) => {
        meter.classList.remove('is-meter-glow');
      });
    }
  };

  const syncSkillViz = (id: string | null) => {
    if (id === 'tech') void runTypewriter(true);
    if (id === 'biz') {
      const card = cards.find((c) => c.dataset.skillCard === 'biz');
      if (card) bizFlows.get(card)?.startLoop();
    } else {
      bizFlows.forEach((flow) => flow.reset());
    }
    if (id === 'lang') setLangLive(true);
    else setLangLive(false);
  };

  const setActive = (id: string | null) => {
    cards.forEach((card) => {
      const on = card.dataset.skillCard === id;
      card.classList.toggle('is-active', on);
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    syncSkillViz(id);
  };

  cards.forEach((card) => {
    const skillId = card.dataset.skillCard ?? '';

    card.addEventListener('mouseenter', () => {
      if (skillId === 'tech') void runTypewriter();
      if (skillId === 'biz') bizFlows.get(card)?.startLoop();
      if (skillId === 'lang') setLangLive(true);
    });

    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('is-active')) {
        if (skillId === 'biz') bizFlows.get(card)?.reset();
        if (skillId === 'lang') setLangLive(false);
      }
    });

    const activate = () => {
      if (card.classList.contains('is-active')) {
        setActive(null);
        return;
      }
      setActive(skillId);

      if (skillId === 'tech') void runTypewriter(true);
    };

    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-skill-card]')) return;
    setActive(null);
  });

  if (!reduced && grid.classList.contains('is-revealed')) {
    window.setTimeout(() => void runTypewriter(), 400);
  } else {
    const revealTarget = grid.closest('[data-reveal]') ?? grid;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        window.setTimeout(() => void runTypewriter(), 350);
      },
      { threshold: 0.35 },
    );
    observer.observe(revealTarget);
  }
}

type InsightVizRunner = { stop: () => void };

function resetInsightViz(card: HTMLDetailsElement): void {
  const viz = card.querySelector<HTMLElement>('[data-insight-viz]');
  const teaser = card.querySelector<HTMLElement>('[data-insight-teaser]');
  if (teaser?.dataset.insightTeaserFull) {
    teaser.textContent = teaser.dataset.insightTeaserFull;
    teaser.classList.remove('is-typing');
  }

  const reqViz = card.querySelector('.insight-viz--req');
  reqViz?.querySelectorAll('[data-req-pill]').forEach((pill) => {
    pill.classList.remove('is-active', 'is-chosen');
    pill.setAttribute('aria-pressed', 'false');
  });
  const status = card.querySelector('[data-req-status]');
  if (status) {
    status.textContent = 'Freigabe offen';
    status.classList.remove('is-decided');
  }

  const bridgeViz = card.querySelector<HTMLElement>('.insight-viz--bridge');
  bridgeViz?.classList.remove('is-viz-live', 'is-pulse-fb', 'is-pulse-mid', 'is-pulse-it');

  const provViz = card.querySelector<HTMLElement>('.insight-viz--prov');
  provViz?.classList.remove('is-prov-live', 'is-prov-gap');
  provViz?.querySelectorAll('.insight-viz-prov__bang').forEach((bang) => bang.classList.remove('is-shake'));

  const aiViz = card.querySelector<HTMLElement>('.insight-viz--ai');
  aiViz?.classList.remove('is-ai-live');
  aiViz?.querySelectorAll('.insight-viz-ai__sig').forEach((sig) => sig.classList.remove('is-sig-hot'));

  viz?.classList.remove('is-viz-live', 'is-animated');
}

function runRequirementsViz(viz: HTMLElement, reduced: boolean): InsightVizRunner {
  const pillA = viz.querySelector<HTMLElement>('[data-req-pill="a"]');
  const pillB = viz.querySelector<HTMLElement>('[data-req-pill="b"]');
  const status = viz.querySelector<HTMLElement>('[data-req-status]');
  let step = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  const apply = (next: number) => {
    step = next;
    pillA?.classList.toggle('is-active', next === 0);
    pillB?.classList.toggle('is-active', next === 1);
    pillA?.classList.toggle('is-chosen', next === 2);
    pillB?.classList.remove('is-chosen');
    pillA?.setAttribute('aria-pressed', next === 0 || next === 2 ? 'true' : 'false');
    pillB?.setAttribute('aria-pressed', next === 1 ? 'true' : 'false');
    if (status) {
      if (next === 2) {
        status.textContent = 'Entschieden: A';
        status.classList.add('is-decided');
      } else {
        status.textContent = 'Freigabe offen';
        status.classList.remove('is-decided');
      }
    }
  };

  if (reduced) {
    apply(2);
    return { stop: () => apply(0) };
  }

  apply(0);
  timer = window.setInterval(() => {
    apply((step + 1) % 3);
  }, 850);

  return {
    stop: () => {
      if (timer) window.clearInterval(timer);
      apply(0);
      pillA?.classList.remove('is-active', 'is-chosen');
      pillB?.classList.remove('is-active', 'is-chosen');
      if (status) {
        status.textContent = 'Freigabe offen';
        status.classList.remove('is-decided');
      }
    },
  };
}

function runBridgeViz(viz: HTMLElement, reduced: boolean): InsightVizRunner {
  const steps = ['is-pulse-fb', 'is-pulse-mid', 'is-pulse-it'] as const;
  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  const apply = () => {
    viz.classList.remove('is-pulse-fb', 'is-pulse-mid', 'is-pulse-it');
    viz.classList.add('is-viz-live', steps[index] ?? steps[0]);
    index = (index + 1) % steps.length;
  };

  if (reduced) {
    viz.classList.add('is-viz-live', 'is-pulse-it');
    return {
      stop: () => viz.classList.remove('is-viz-live', 'is-pulse-fb', 'is-pulse-mid', 'is-pulse-it'),
    };
  }

  apply();
  timer = window.setInterval(apply, 800);

  return {
    stop: () => {
      if (timer) window.clearInterval(timer);
      viz.classList.remove('is-viz-live', 'is-pulse-fb', 'is-pulse-mid', 'is-pulse-it');
    },
  };
}

function runProviderViz(viz: HTMLElement, reduced: boolean): InsightVizRunner {
  const bangs = [...viz.querySelectorAll<HTMLElement>('.insight-viz-prov__bang')];
  let loopTimer: ReturnType<typeof setInterval> | null = null;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  viz.classList.add('is-prov-live');

  const pulseGap = () => {
    viz.classList.remove('is-prov-gap');
    bangs.forEach((bang) => bang.classList.remove('is-shake'));
    const phaseTimer = window.setTimeout(() => {
      viz.classList.add('is-prov-gap');
      bangs.forEach((bang, i) => {
        const t = window.setTimeout(() => bang.classList.add('is-shake'), 100 + i * 120);
        timeouts.push(t);
      });
    }, 380);
    timeouts.push(phaseTimer);
  };

  if (reduced) {
    viz.classList.remove('is-prov-gap');
    return {
      stop: () => {
        viz.classList.remove('is-prov-live', 'is-prov-gap');
        bangs.forEach((bang) => bang.classList.remove('is-shake'));
      },
    };
  }

  pulseGap();
  loopTimer = window.setInterval(pulseGap, 2400);

  return {
    stop: () => {
      if (loopTimer) window.clearInterval(loopTimer);
      timeouts.forEach((t) => window.clearTimeout(t));
      timeouts.length = 0;
      viz.classList.remove('is-prov-live', 'is-prov-gap');
      bangs.forEach((bang) => bang.classList.remove('is-shake'));
    },
  };
}

function runAiViz(viz: HTMLElement, reduced: boolean): InsightVizRunner {
  const sigs = [...viz.querySelectorAll<HTMLElement>('.insight-viz-ai__sig')];
  let sigIndex = 0;
  let sigTimer: ReturnType<typeof setInterval> | null = null;

  viz.classList.add('is-ai-live');

  const applySig = () => {
    sigs.forEach((sig, i) => sig.classList.toggle('is-sig-hot', i === sigIndex));
    sigIndex = (sigIndex + 1) % Math.max(sigs.length, 1);
  };

  if (reduced) {
    applySig();
    return {
      stop: () => {
        sigs.forEach((sig) => sig.classList.remove('is-sig-hot'));
        viz.classList.remove('is-ai-live');
      },
    };
  }

  applySig();
  sigTimer = window.setInterval(applySig, 580);

  return {
    stop: () => {
      if (sigTimer) window.clearInterval(sigTimer);
      sigs.forEach((sig) => sig.classList.remove('is-sig-hot'));
      viz.classList.remove('is-ai-live');
    },
  };
}

async function typeInsightTeaser(card: HTMLDetailsElement, reduced: boolean): Promise<void> {
  const teaser = card.querySelector<HTMLElement>('[data-insight-teaser]');
  if (!teaser) return;
  const full = teaser.dataset.insightTeaserFull ?? teaser.textContent?.trim() ?? '';
  teaser.dataset.insightTeaserFull = full;
  if (reduced || !full) return;

  teaser.classList.add('is-typing');
  teaser.textContent = '';
  for (const ch of full) {
    if (!card.open) break;
    teaser.textContent += ch;
    await sleep(10);
  }
  teaser.classList.remove('is-typing');
}

function initInsights(grid: HTMLElement): void {
  const cards = [...grid.querySelectorAll<HTMLDetailsElement>('[data-insight-card]')];
  const reduced = prefersReducedMotion();
  const runners = new Map<HTMLDetailsElement, InsightVizRunner>();
  let teaserToken = 0;
  let rotateTimer: ReturnType<typeof setInterval> | null = null;
  let rotateIndex = 0;
  let rotatePaused = false;
  let gridLive = false;
  let hoverCard: HTMLDetailsElement | null = null;

  const anyOpen = () => cards.some((c) => c.open);

  const clearRotate = () => {
    if (rotateTimer) clearInterval(rotateTimer);
    rotateTimer = null;
  };

  const setPreview = (active: HTMLDetailsElement | null) => {
    cards.forEach((c) => {
      const isActive = active === c && !c.open;
      c.classList.toggle('is-preview', isActive);
      c.classList.toggle('is-dimmed', !!active && active !== c && !c.open);
    });
  };

  const stopInsightViz = (card: HTMLDetailsElement) => {
    runners.get(card)?.stop();
    runners.delete(card);
    resetInsightViz(card);
  };

  const startInsightViz = (card: HTMLDetailsElement, opened: boolean) => {
    stopInsightViz(card);
    const vizWrap = card.querySelector<HTMLElement>('[data-insight-viz]');
    const innerViz = vizWrap?.querySelector<HTMLElement>('.insight-viz');
    if (!vizWrap || !innerViz) return;

    vizWrap.classList.add('is-viz-live');
    if (opened) vizWrap.classList.add('is-animated');

    const type = card.dataset.insightType ?? '';
    let runner: InsightVizRunner | null = null;
    if (type === 'requirements') runner = runRequirementsViz(innerViz, reduced);
    if (type === 'bridge') runner = runBridgeViz(innerViz, reduced);
    if (type === 'provider') runner = runProviderViz(innerViz, reduced);
    if (type === 'ai') runner = runAiViz(innerViz, reduced);
    if (runner) runners.set(card, runner);

    if (opened) {
      const token = ++teaserToken;
      void (async () => {
        await typeInsightTeaser(card, reduced);
        if (token !== teaserToken) return;
      })();
    }
  };

  const startAllViz = () => {
    cards.forEach((card) => {
      if (!card.open) startInsightViz(card, false);
    });
  };

  const stopAllViz = () => {
    cards.forEach((card) => {
      if (!card.open) stopInsightViz(card);
    });
  };

  const focusCard = (card: HTMLDetailsElement) => {
    if (card.open) return;
    setPreview(card);
  };

  const startRotate = () => {
    if (reduced || !gridLive || rotatePaused || anyOpen() || hoverCard) return;
    clearRotate();
    rotateTimer = setInterval(() => {
      if (rotatePaused || anyOpen() || hoverCard || !gridLive) {
        clearRotate();
        return;
      }
      rotateIndex = (rotateIndex + 1) % cards.length;
      focusCard(cards[rotateIndex]!);
    }, 2000);
  };

  const startGrid = () => {
    if (gridLive) return;
    gridLive = true;
    grid.classList.add('is-grid-live');
    startAllViz();
    if (!anyOpen() && cards[0]) focusCard(cards[0]);
    startRotate();
  };

  const stopGrid = () => {
    if (!gridLive) return;
    gridLive = false;
    grid.classList.remove('is-grid-live');
    clearRotate();
    hoverCard = null;
    rotatePaused = false;
    setPreview(null);
    stopAllViz();
  };

  const isMovingToInsightCard = (from: HTMLDetailsElement, target: EventTarget | null) => {
    if (!(target instanceof Node)) return false;
    const nextCard = (target as Element).closest?.('[data-insight-card]');
    return !!nextCard && nextCard !== from;
  };

  cards.forEach((card) => {
    const vizWrap = card.querySelector<HTMLElement>('[data-insight-viz]');

    card.addEventListener('toggle', () => {
      if (card.open) {
        clearRotate();
        rotatePaused = true;
        hoverCard = null;
        setPreview(null);
        cards.forEach((other) => {
          if (other !== card && other.open) {
            other.open = false;
            stopInsightViz(other);
          }
          other.classList.remove('is-preview', 'is-dimmed');
        });
        startInsightViz(card, true);
      } else {
        teaserToken += 1;
        stopInsightViz(card);
        rotatePaused = false;
        if (gridLive && !hoverCard) {
          startAllViz();
          startRotate();
        }
      }
    });

    const summary = card.querySelector('.insight-card__summary');
    summary?.addEventListener('mouseenter', () => {
      if (card.open) return;
      clearRotate();
      hoverCard = card;
      rotatePaused = true;
      focusCard(card);
    });
    summary?.addEventListener('mouseleave', (event) => {
      if (card.open) return;
      if (isMovingToInsightCard(card, event.relatedTarget)) return;
      hoverCard = null;
      setPreview(null);
      rotatePaused = false;
      if (gridLive && cards[rotateIndex]) focusCard(cards[rotateIndex]!);
      startRotate();
    });
    summary?.addEventListener('focusin', () => {
      if (card.open) return;
      clearRotate();
      rotatePaused = true;
      focusCard(card);
    });
    summary?.addEventListener('focusout', (event) => {
      if (card.open) return;
      if (isMovingToInsightCard(card, event.relatedTarget)) return;
      rotatePaused = false;
      if (gridLive && cards[rotateIndex]) focusCard(cards[rotateIndex]!);
      startRotate();
    });

    if (card.dataset.insightType === 'requirements' && vizWrap) {
      const reqViz = vizWrap.querySelector('.insight-viz--req');
      reqViz?.querySelectorAll<HTMLButtonElement>('[data-req-pill]').forEach((pill) => {
        pill.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const pick = pill.dataset.reqPill ?? 'a';
          runners.get(card)?.stop();
          runners.delete(card);
          const pillA = reqViz.querySelector('[data-req-pill="a"]');
          const pillB = reqViz.querySelector('[data-req-pill="b"]');
          const status = reqViz.querySelector('[data-req-status]');
          pillA?.classList.toggle('is-chosen', pick === 'a');
          pillB?.classList.toggle('is-chosen', pick === 'b');
          pillA?.classList.toggle('is-active', pick === 'a');
          pillB?.classList.toggle('is-active', pick === 'b');
          pillA?.setAttribute('aria-pressed', pick === 'a' ? 'true' : 'false');
          pillB?.setAttribute('aria-pressed', pick === 'b' ? 'true' : 'false');
          if (status) {
            status.textContent = pick === 'a' ? 'Entschieden: A' : 'Entschieden: B';
            status.classList.add('is-decided');
          }
          reqViz.classList.add('is-viz-live');
          vizWrap.classList.add('is-viz-live');
        });
      });
    }
  });

  grid.addEventListener('mouseleave', () => {
    if (anyOpen()) return;
    hoverCard = null;
    rotatePaused = false;
    if (gridLive && cards[rotateIndex]) focusCard(cards[rotateIndex]!);
    startRotate();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible) startGrid();
      else stopGrid();
    },
    { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
  );
  observer.observe(grid);

  if (reduced && grid.getBoundingClientRect().top < window.innerHeight) {
    startGrid();
  }
}

const HERO_CHIP_ORDER = ['scope', 'uat', 'release'] as const;

function initProfilMockupFrame(frame: HTMLElement): void {
  const frameId = frame.dataset.profMockupFrame as ProfilMockupFrameId | undefined;
  if (!frameId || !(frameId in profilMockupFrames)) return;

  const config = profilMockupFrames[frameId];
  const overlay = frame.querySelector<HTMLElement>('[data-prof-mockup-overlay]');
  const chromeLabel = frame.querySelector<HTMLElement>('.profil-mockup-frame__chrome-label');
  if (!overlay) return;

  const rows = [...overlay.querySelectorAll<HTMLButtonElement>('[data-prof-mockup-check]')];
  const chips = [...overlay.querySelectorAll<HTMLButtonElement>('[data-prof-mockup-chip]')];
  const chipOrder = config.chips.map((c) => c.id);
  const reduced = prefersReducedMotion();
  let chipTimer: ReturnType<typeof setInterval> | null = null;
  let chipIndex = 0;

  const applyChip = (chipId: string) => {
    const step = chipOrder.indexOf(chipId);
    chips.forEach((chip) => {
      const on = chip.dataset.profMockupChip === chipId;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    rows.forEach((row, i) => {
      row.classList.toggle('is-done', step >= 0 && i <= step);
    });
    const labelIndex = step >= 0 ? step : 0;
    if (chromeLabel && config.chromeLabelByChip[labelIndex]) {
      chromeLabel.textContent = config.chromeLabelByChip[labelIndex];
      chromeLabel.classList.add('is-chip-active');
    }
  };

  const stopChipLoop = () => {
    if (chipTimer) window.clearInterval(chipTimer);
    chipTimer = null;
  };

  const startChipLoop = () => {
    if (reduced) {
      applyChip(chipOrder[chipOrder.length - 1] ?? chipOrder[0] ?? '');
      return;
    }
    stopChipLoop();
    applyChip(chipOrder[chipIndex] ?? chipOrder[0] ?? '');
    chipTimer = window.setInterval(() => {
      chipIndex = (chipIndex + 1) % chipOrder.length;
      applyChip(chipOrder[chipIndex] ?? chipOrder[0] ?? '');
    }, 1400);
  };

  const resetMock = () => {
    stopChipLoop();
    chipIndex = 0;
    chips.forEach((chip) => {
      chip.classList.remove('is-active');
      chip.setAttribute('aria-pressed', 'false');
    });
    rows.forEach((row) => row.classList.remove('is-done'));
    chromeLabel?.classList.remove('is-chip-active');
    if (chromeLabel) chromeLabel.textContent = config.chromeLabel;
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', (event) => {
      event.stopPropagation();
      stopChipLoop();
      const id = chip.dataset.profMockupChip;
      if (id && chipOrder.includes(id)) applyChip(id);
    });
  });

  rows.forEach((row) => {
    row.addEventListener('click', (event) => {
      event.stopPropagation();
      stopChipLoop();
      row.classList.toggle('is-done');
    });
  });

  frame.addEventListener('mouseenter', () => {
    frame.classList.add('is-mockup-live');
    startChipLoop();
  });

  frame.addEventListener('mouseleave', () => {
    frame.classList.remove('is-mockup-live');
    resetMock();
  });

  const revealFrame = () => {
    frame.classList.add('is-mockup-ready');
    if (!reduced) window.setTimeout(startChipLoop, 600);
  };

  const isVisible = () => {
    const rect = frame.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight * 0.92;
  };

  const revealTarget = frame.closest('[data-reveal]') ?? frame;

  if (frame.classList.contains('is-revealed') || revealTarget.classList.contains('is-revealed') || isVisible()) {
    revealFrame();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        revealFrame();
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
    );
    observer.observe(revealTarget);
  }

  const revealSync = new MutationObserver(() => {
    if (revealTarget.classList.contains('is-revealed')) revealFrame();
  });
  revealSync.observe(revealTarget, { attributes: true, attributeFilter: ['class'] });
}

function initProfilHeroTilt(wrap: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const layer = wrap.querySelector<HTMLElement>('.tilt-scene__layer');
  if (!layer) return;

  let targetTx = 0;
  let targetTy = 0;
  let currentTx = 0;
  let currentTy = 0;
  let raf = 0;
  let hovering = false;

  const tick = () => {
    currentTx += (targetTx - currentTx) * 0.12;
    currentTy += (targetTy - currentTy) * 0.12;
    wrap.style.setProperty('--tx', currentTx.toFixed(3));
    wrap.style.setProperty('--ty', currentTy.toFixed(3));

    if (hovering || Math.abs(targetTx - currentTx) > 0.002 || Math.abs(targetTy - currentTy) > 0.002) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  const queueTick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onMove = (event: PointerEvent) => {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetTx = Math.max(-1, Math.min(1, (event.clientX - cx) / (rect.width / 2)));
    targetTy = Math.max(-1, Math.min(1, (event.clientY - cy) / (rect.height / 2)));
    queueTick();
  };

  const onEnter = () => {
    hovering = true;
    wrap.classList.add('is-tilt-active');
    queueTick();
  };

  const onLeave = () => {
    hovering = false;
    targetTx = 0;
    targetTy = 0;
    wrap.classList.remove('is-tilt-active');
    queueTick();
  };

  wrap.addEventListener('pointerenter', onEnter);
  wrap.addEventListener('pointerleave', onLeave);
  wrap.addEventListener('pointermove', onMove, { passive: true });
}

function initArchitectureDiagram(aside: HTMLElement): void {
  const root = aside.querySelector<HTMLElement>('[data-arch-diagram]');
  if (!root || root.classList.contains('arch-diagram--static') || root.classList.contains('arch-diagram--hybrid') || root.classList.contains('arch-diagram--svg')) {
    return;
  }

  const layers = [...root.querySelectorAll<HTMLImageElement>('.arch-diagram__layer')];
  if (layers.length === 0) return;

  const markReady = () => {
    if (layers.every((img) => img.complete && img.naturalWidth > 0)) {
      root.classList.add('arch-diagram--assets-ready');
    }
  };

  layers.forEach((img) => {
    img.addEventListener('load', markReady, { once: true });
    img.addEventListener('error', markReady, { once: true });
  });
  markReady();
}

function initProfilHero(aside: HTMLElement): void {
  const mock = aside.querySelector<HTMLElement>('[data-prof-hero-mock]');
  const figure = aside.querySelector<HTMLElement>('[data-prof-hero-figure]');
  const tiltWrap = aside.querySelector<HTMLElement>('[data-prof-hero-tilt]');
  const chromeLabel = aside.querySelector<HTMLElement>('.profil-hero__mock-chrome__label');
  const reduced = prefersReducedMotion();

  initArchitectureDiagram(aside);
  if (tiltWrap) initProfilHeroTilt(tiltWrap);

  if (!mock || !figure) return;

  const rows = [...mock.querySelectorAll<HTMLButtonElement>('[data-hero-check]')];
  const chips = [...mock.querySelectorAll<HTMLButtonElement>('[data-hero-chip]')];
  let chipTimer: ReturnType<typeof setInterval> | null = null;
  let chipIndex = 0;

  const applyChip = (id: (typeof HERO_CHIP_ORDER)[number]) => {
    const step = HERO_CHIP_ORDER.indexOf(id);
    chips.forEach((chip) => {
      const on = chip.dataset.heroChip === id;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    rows.forEach((row, i) => {
      row.classList.toggle('is-done', i <= step);
    });
    if (chromeLabel) {
      const labelByChip: Record<(typeof HERO_CHIP_ORDER)[number], string> = {
        scope: 'Scope · uat · release',
        uat: 'scope · UAT · release',
        release: 'scope · uat · Release',
      };
      chromeLabel.textContent = labelByChip[id];
      chromeLabel.classList.add('is-chip-active');
    }
  };

  const stopChipLoop = () => {
    if (chipTimer) window.clearInterval(chipTimer);
    chipTimer = null;
  };

  const startChipLoop = () => {
    if (reduced) {
      applyChip('release');
      return;
    }
    stopChipLoop();
    applyChip(HERO_CHIP_ORDER[chipIndex] ?? 'scope');
    chipTimer = window.setInterval(() => {
      chipIndex = (chipIndex + 1) % HERO_CHIP_ORDER.length;
      applyChip(HERO_CHIP_ORDER[chipIndex] ?? 'scope');
    }, 1400);
  };

  const resetHeroMock = () => {
    stopChipLoop();
    chipIndex = 0;
    chips.forEach((chip) => {
      chip.classList.remove('is-active');
      chip.setAttribute('aria-pressed', 'false');
    });
    rows.forEach((row) => row.classList.remove('is-done'));
    chromeLabel?.classList.remove('is-chip-active');
    if (chromeLabel) chromeLabel.textContent = 'scope · uat · release';
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', (event) => {
      event.stopPropagation();
      stopChipLoop();
      const id = chip.dataset.heroChip as (typeof HERO_CHIP_ORDER)[number] | undefined;
      if (id && HERO_CHIP_ORDER.includes(id)) applyChip(id);
    });
  });

  rows.forEach((row) => {
    row.addEventListener('click', (event) => {
      event.stopPropagation();
      stopChipLoop();
      row.classList.toggle('is-done');
    });
  });

  figure.addEventListener('mouseenter', () => {
    aside.classList.add('is-hero-live');
    startChipLoop();
  });

  figure.addEventListener('mouseleave', () => {
    if (!aside.matches(':hover')) {
      aside.classList.remove('is-hero-live');
      resetHeroMock();
    }
  });

  aside.addEventListener('mouseleave', () => {
    aside.classList.remove('is-hero-live');
    resetHeroMock();
  });

  const hasAnimatedDiagram = figure.querySelector('[data-arch-diagram]')?.classList.contains('arch-diagram--svg');

  const revealFigure = () => {
    if (hasAnimatedDiagram && !reduced) {
      figure.classList.remove('is-hero-ready');
      void figure.offsetWidth;
    }
    figure.classList.add('is-hero-ready');
    if (!reduced) window.setTimeout(startChipLoop, 600);
  };

  const replayDiagram = () => {
    if (!hasAnimatedDiagram || reduced) return;
    revealFigure();
  };

  const isAsideVisible = () => {
    const rect = aside.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight * 0.92;
  };

  if (figure.classList.contains('is-revealed') || aside.classList.contains('is-revealed') || isAsideVisible()) {
    revealFigure();
  } else {
    const target = aside.closest('[data-reveal]') ?? aside;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        revealFigure();
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
    );
    observer.observe(target);
  }

  const revealTarget = aside.closest('[data-reveal]') ?? aside;
  const revealSync = new MutationObserver(() => {
    if (revealTarget.classList.contains('is-revealed')) revealFigure();
  });
  revealSync.observe(revealTarget, { attributes: true, attributeFilter: ['class'] });

  requestAnimationFrame(() => {
    if (isAsideVisible()) revealFigure();
  });

  figure.addEventListener('mouseenter', replayDiagram, { passive: true });
}

const WORK_DOC_LINES = ['Scope · Risiko', 'Machbarkeit · UAT', 'Release-Ready'] as const;

function resetWorkItemViz(item: HTMLElement): void {
  const body = item.querySelector<HTMLElement>('[data-work-body]');
  if (body) {
    body.classList.remove('is-typing');
    body.textContent = body.dataset.workBodyFull ?? body.textContent ?? '';
  }

  item.querySelector('[data-work-typed]')?.replaceChildren();
  item.querySelectorAll('[data-work-check]').forEach((check) => check.classList.remove('is-done'));

  const bridgeViz = item.querySelector<HTMLElement>('.pp-work-viz--bridge');
  bridgeViz?.classList.remove('is-flow-live', 'is-pulse-at-fb', 'is-pulse-at-mid', 'is-pulse-at-it');

  if (item.dataset.workGain === 'scope') {
    item.querySelectorAll<HTMLButtonElement>('[data-scope-side]').forEach((btn) => {
      const isIn = btn.dataset.scopeSide === 'in';
      btn.classList.toggle('is-active', isIn);
      btn.setAttribute('aria-pressed', isIn ? 'true' : 'false');
    });
  }
}

function initBioTimeline(timeline: HTMLElement): void {
  const items = [...timeline.querySelectorAll<HTMLElement>('[data-timeline-item]')];
  if (items.length === 0) return;

  const reduced = prefersReducedMotion();
  let activeIndex = 0;

  const setActive = (index: number) => {
    activeIndex = Math.max(0, Math.min(index, items.length - 1));
    timeline.dataset.activeIndex = String(activeIndex);
    const fillPct = `${((activeIndex + 1) / items.length) * 100}%`;
    timeline.style.setProperty('--timeline-fill', fillPct);
    items.forEach((item, i) => {
      const on = i === activeIndex;
      item.classList.toggle('is-active', on);
      item.setAttribute('aria-current', on ? 'step' : 'false');
    });
  };

  if (reduced) {
    timeline.classList.add('is-line-drawn');
    setActive(items.length - 1);
    return;
  }

  const lineObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      lineObserver.disconnect();
      timeline.classList.add('is-line-drawn');
    },
    { threshold: 0.2 },
  );
  lineObserver.observe(timeline);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .map((e) => Number((e.target as HTMLElement).dataset.timelineIndex ?? '0'));
      if (visible.length === 0) return;
      setActive(Math.min(...visible));
    },
    { rootMargin: '-15% 0px -50% 0px', threshold: 0.15 },
  );
  items.forEach((item) => spyObserver.observe(item));

  items.forEach((item) => {
    const index = Number(item.dataset.timelineIndex ?? '0');

    item.addEventListener('mouseenter', () => setActive(index));
    item.addEventListener('focus', () => setActive(index));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = Math.min(activeIndex + 1, items.length - 1);
        items[next]?.focus();
        setActive(next);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = Math.max(activeIndex - 1, 0);
        items[prev]?.focus();
        setActive(prev);
      }
    });
  });

  setActive(0);
}

function initWorkBand(section: HTMLElement): void {
  const items = [...section.querySelectorAll<HTMLElement>('[data-work-gain]')];
  const reduced = prefersReducedMotion();
  const docRunToken = new Map<HTMLElement, number>();
  const typeToken = new Map<HTMLElement, number>();
  const bridgeTimer = new Map<HTMLElement, ReturnType<typeof setInterval>>();
  const scopeTimer = new Map<HTMLElement, ReturnType<typeof setInterval>>();
  let bandLive = false;

  items.forEach((item) => {
    const body = item.querySelector<HTMLElement>('[data-work-body]');
    if (body && !body.dataset.workBodyFull) {
      body.dataset.workBodyFull = body.textContent?.trim() ?? '';
    }
  });

  const stopBridgeLoop = (item: HTMLElement) => {
    const timer = bridgeTimer.get(item);
    if (timer) window.clearInterval(timer);
    bridgeTimer.delete(item);
  };

  const stopScopeLoop = (item: HTMLElement) => {
    const timer = scopeTimer.get(item);
    if (timer) window.clearInterval(timer);
    scopeTimer.delete(item);
  };

  const stopItemMotion = (item: HTMLElement) => {
    docRunToken.set(item, (docRunToken.get(item) ?? 0) + 1);
    typeToken.set(item, (typeToken.get(item) ?? 0) + 1);
    stopBridgeLoop(item);
    stopScopeLoop(item);
    item.classList.remove('is-active');
    item.setAttribute('aria-pressed', 'false');
    resetWorkItemViz(item);
  };

  const runBridgeLoop = (item: HTMLElement) => {
    const viz = item.querySelector<HTMLElement>('.pp-work-viz--bridge');
    if (!viz) return;
    const steps = ['is-pulse-at-fb', 'is-pulse-at-mid', 'is-pulse-at-it'] as const;
    let index = 0;

    const apply = () => {
      if (!bandLive) return;
      viz.classList.remove('is-pulse-at-fb', 'is-pulse-at-mid', 'is-pulse-at-it');
      viz.classList.add('is-flow-live', steps[index] ?? steps[0]);
      index = (index + 1) % steps.length;
    };

    if (reduced) {
      viz.classList.add('is-flow-live', 'is-pulse-at-it');
      return;
    }

    stopBridgeLoop(item);
    apply();
    bridgeTimer.set(item, window.setInterval(apply, 900));
  };

  const runScopeLoop = (item: HTMLElement) => {
    const buttons = [...item.querySelectorAll<HTMLButtonElement>('[data-scope-side]')];
    if (buttons.length === 0) return;

    let showIn = true;
    const apply = () => {
      if (!bandLive) return;
      buttons.forEach((btn) => {
        const on = (btn.dataset.scopeSide === 'in') === showIn;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      showIn = !showIn;
    };

    if (reduced) {
      apply();
      return;
    }

    stopScopeLoop(item);
    apply();
    scopeTimer.set(item, window.setInterval(apply, 1200));
  };

  const runDocSequence = async (item: HTMLElement) => {
    const typed = item.querySelector<HTMLElement>('[data-work-typed]');
    const checks = [...item.querySelectorAll<HTMLElement>('[data-work-check]')];
    if (!typed) return;

    const runId = (docRunToken.get(item) ?? 0) + 1;
    docRunToken.set(item, runId);
    checks.forEach((check) => check.classList.remove('is-done'));
    typed.textContent = '';

    if (reduced) {
      typed.textContent = WORK_DOC_LINES[WORK_DOC_LINES.length - 1];
      checks.forEach((check) => check.classList.add('is-done'));
      return;
    }

    for (let i = 0; i < WORK_DOC_LINES.length; i++) {
      if (docRunToken.get(item) !== runId || !bandLive) return;
      const line = WORK_DOC_LINES[i];
      typed.textContent = '';
      for (const ch of line) {
        if (docRunToken.get(item) !== runId || !bandLive) return;
        typed.textContent += ch;
        await sleep(14);
      }
      checks[i]?.classList.add('is-done');
      await sleep(220);
    }

    if (docRunToken.get(item) !== runId || !bandLive) return;
    await sleep(900);
    if (docRunToken.get(item) === runId && bandLive) void runDocSequence(item);
  };

  const typeWorkBody = async (item: HTMLElement) => {
    const body = item.querySelector<HTMLElement>('[data-work-body]');
    const full = body?.dataset.workBodyFull ?? '';
    if (!body || !full) return;

    const token = (typeToken.get(item) ?? 0) + 1;
    typeToken.set(item, token);

    if (reduced) {
      body.classList.remove('is-typing');
      body.textContent = full;
      return;
    }

    body.classList.add('is-typing');
    body.textContent = '';
    for (const ch of full) {
      if (typeToken.get(item) !== token || !bandLive) return;
      body.textContent += ch;
      await sleep(12);
    }
    if (typeToken.get(item) === token) body.classList.remove('is-typing');
  };

  const startItem = (item: HTMLElement) => {
    item.classList.add('is-active');
    item.setAttribute('aria-pressed', 'true');

    const id = item.dataset.workGain ?? '';
    void typeWorkBody(item);
    if (id === 'doc') void runDocSequence(item);
    if (id === 'scope') runScopeLoop(item);
    if (id === 'bridge') runBridgeLoop(item);
  };

  const startBand = () => {
    if (bandLive) return;
    bandLive = true;
    section.classList.add('is-band-live');
    items.forEach((item, index) => {
      window.setTimeout(() => startItem(item), reduced ? 0 : index * 180);
    });
  };

  const stopBand = () => {
    if (!bandLive) return;
    bandLive = false;
    section.classList.remove('is-band-live');
    items.forEach(stopItemMotion);
  };

  const scopeItem = items.find((item) => item.dataset.workGain === 'scope');
  scopeItem?.querySelectorAll<HTMLButtonElement>('[data-scope-side]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!bandLive) return;
      stopScopeLoop(scopeItem);
      const side = btn.dataset.scopeSide ?? 'in';
      scopeItem.querySelectorAll<HTMLButtonElement>('[data-scope-side]').forEach((other) => {
        const on = other.dataset.scopeSide === side;
        other.classList.toggle('is-active', on);
        other.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      window.setTimeout(() => {
        if (bandLive) runScopeLoop(scopeItem);
      }, 2400);
    });
  });

  items.forEach((item) => {
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const scopeBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-scope-side]');
        if (scopeBtn) return;
        item.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  });

  const grid = section.querySelector<HTMLElement>('[data-prof-work-grid]');
  const observeTarget = grid ?? section;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible) startBand();
      else stopBand();
    },
    { threshold: 0.22, rootMargin: '0px 0px -8% 0px' },
  );
  observer.observe(observeTarget);

  if (reduced && observeTarget.getBoundingClientRect().top < window.innerHeight) {
    startBand();
  }
}

function initProfilPageMotion(): void {
  const page = document.querySelector('.profil-page');
  if (!page) return;

  const panel = page.querySelector<HTMLElement>('[data-pp-panel]');
  if (panel) initKanban(panel);

  const skillsGrid = page.querySelector<HTMLElement>('[data-prof-skills-grid]');
  if (skillsGrid) initSkills(skillsGrid);

  const insightsGrid = page.querySelector<HTMLElement>('[data-prof-insights-grid]');
  if (insightsGrid) initInsights(insightsGrid);

  const heroAside = page.querySelector<HTMLElement>('[data-prof-hero-aside]');
  if (heroAside) initProfilHero(heroAside);

  page.querySelectorAll<HTMLElement>('[data-prof-mockup-frame]').forEach(initProfilMockupFrame);

  const bioTimeline = page.querySelector<HTMLElement>('[data-prof-bio-timeline]');
  if (bioTimeline) initBioTimeline(bioTimeline);

  const workBand = page.querySelector<HTMLElement>('[data-prof-work-band]');
  if (workBand) initWorkBand(workBand);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfilPageMotion, { once: true });
} else {
  initProfilPageMotion();
}
