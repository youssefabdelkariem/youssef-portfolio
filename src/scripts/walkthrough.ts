// Walkthrough page behaviour. Everything here is an enhancement: with no JavaScript every clip stays a poster
// and every note stays in the page. Video is silent, loads only near the viewport, plays only while visible
// (and, inside a pinned stage, only for the active step), and never autoplays under reduced motion or Save-Data.

const root = document.querySelector<HTMLElement>('[data-walkthrough]');

type Net = { connection?: { saveData?: boolean } };

if (root) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 700px)');
  const saveData = Boolean((navigator as Navigator & Net).connection?.saveData);
  const autoplayAllowed = () => !reduced.matches && !saveData;

  interface Clip {
    fig: HTMLElement;
    video: HTMLVideoElement;
    ctl: HTMLButtonElement;
    inView: boolean;
    near: boolean;
    touching: boolean; // any pixel on screen; enough to keep a clip the visitor started themselves
    pressed: boolean; // the visitor pressed play on this clip
    wanted: boolean; // stage steps are only wanted while active; everything else is always wanted
    userPaused: boolean;
    started: boolean; // the user (or autoplay) has started this clip at least once
    loop: boolean;
    manual: boolean; // driven by its own controller (the comparison block)
  }
  const clips = new Map<HTMLElement, Clip>();

  const sync = (c: Clip) => {
    const v = c.video;
    const playing = !v.paused && !v.ended;
    c.fig.dataset.playing = playing ? 'true' : 'false';
    const label = c.ctl.dataset.label ?? 'clip';
    const text = c.ctl.querySelector('.sr');
    const verb = playing ? 'Pause' : v.ended ? 'Replay' : 'Play';
    if (text) text.textContent = `${verb}: ${label}`;
    c.ctl.setAttribute('aria-pressed', String(playing));
    c.ctl.dataset.state = playing ? 'playing' : 'paused';
  };

  const ensureSrc = (c: Clip) => {
    if (c.video.getAttribute('src') || c.fig.dataset.state === 'failed') return;
    const mobile = c.video.dataset.srcM;
    c.video.src = small.matches && mobile ? mobile : (c.video.dataset.src as string);
    c.video.preload = 'auto';
    c.video.load();
  };

  const play = (c: Clip) => {
    ensureSrc(c);
    const p = c.video.play();
    if (p) p.then(() => { c.started = true; sync(c); }).catch(() => { c.fig.dataset.blocked = 'true'; sync(c); });
  };

  const update = (c: Clip) => {
    if (c.manual) return;
    if (c.near && c.wanted) ensureSrc(c);
    const should = (c.inView || (c.pressed && c.touching)) && c.wanted && !document.hidden && !c.userPaused && (autoplayAllowed() || c.started);
    if (should && (c.video.paused && (!c.video.ended || c.loop))) play(c);
    else if (!should && !c.video.paused) c.video.pause();
  };

  const nearIo = new IntersectionObserver((entries) => {
    for (const e of entries) { const c = clips.get(e.target as HTMLElement); if (c) { c.near = e.isIntersecting; update(c); } }
  }, { rootMargin: '80% 0px' });
  const viewIo = new IntersectionObserver((entries) => {
    for (const e of entries) { const c = clips.get(e.target as HTMLElement); if (c) { c.touching = e.isIntersecting; c.inView = e.isIntersecting && e.intersectionRatio >= 0.3; update(c); } }
  }, { threshold: [0, 0.3] });

  root.querySelectorAll<HTMLElement>('figure.clip').forEach((fig) => {
    const video = fig.querySelector('video');
    const ctl = fig.querySelector<HTMLButtonElement>('.clip-ctl');
    if (!video || !ctl) return;
    const c: Clip = { fig, video, ctl, inView: false, near: false, touching: false, pressed: false, wanted: !fig.classList.contains('stage-clip'), userPaused: false, started: false, loop: fig.dataset.loop !== 'false', manual: Boolean(fig.closest('.compare-frame')) };
    clips.set(fig, c);
    ctl.hidden = false;
    video.addEventListener('playing', () => { fig.dataset.ready = 'true'; sync(c); });
    for (const ev of ['pause', 'ended', 'play']) video.addEventListener(ev, () => sync(c));
    video.addEventListener('error', () => { fig.dataset.state = 'failed'; ctl.hidden = true; });
    video.addEventListener('stalled', () => { fig.dataset.slow = 'true'; });
    video.addEventListener('canplay', () => { delete fig.dataset.slow; });
    ctl.addEventListener('click', () => {
      c.started = true; // an explicit press always wins over the reduced-motion default
      c.pressed = true;
      if (video.ended) { video.currentTime = 0; c.userPaused = false; play(c); return; }
      if (video.paused) { c.userPaused = false; delete fig.dataset.blocked; play(c); } else { c.userPaused = true; video.pause(); }
    });
    sync(c);
    nearIo.observe(fig);
    viewIo.observe(fig);
  });

  const refreshAll = () => clips.forEach(update);
  document.addEventListener('visibilitychange', refreshAll);
  reduced.addEventListener('change', refreshAll);

  // header height, used to pin stages below the sticky site header
  const header = document.querySelector<HTMLElement>('.site-header');
  const setHeader = () => root.style.setProperty('--hdr', `${header ? header.offsetHeight : 72}px`);
  setHeader();
  addEventListener('resize', setHeader, { passive: true });

  // pinned stages: the step nearest the middle of the screen owns the media frame
  root.querySelectorAll<HTMLElement>('[data-stage]').forEach((stage) => {
    const steps = [...stage.querySelectorAll<HTMLElement>('.step')];
    const figs = [...stage.querySelectorAll<HTMLElement>('figure.clip')];
    const counter = stage.querySelector<HTMLElement>('[data-step-now]');
    let current = -1;
    const activate = (i: number) => {
      if (i === current) return;
      current = i;
      steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
      figs.forEach((f, k) => {
        const c = clips.get(f);
        f.classList.toggle('is-active', k === i);
        if (!c) return;
        const was = c.wanted;
        c.wanted = k === i;
        if (c.wanted && !was) { if (c.video.readyState > 0 && c.started) c.video.currentTime = 0; }
        if (Math.abs(k - i) <= 1) { c.near = true; ensureSrc(c); }
        update(c);
      });
      if (counter) counter.textContent = String(i + 1).padStart(2, '0');
    };
    activate(0);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) activate(steps.indexOf(e.target as HTMLElement));
    }, { rootMargin: '-42% 0px -42% 0px' });
    steps.forEach((s) => io.observe(s));
    // a stage whose frame is off screen should not keep its active clip playing; per-clip inView handles that
  });

  // before/after comparison: two silent clips of the same camera move, played once, with a draggable divider
  root.querySelectorAll<HTMLElement>('[data-compare]').forEach((box) => {
    const frame = box.querySelector<HTMLElement>('.compare-frame');
    const bar = box.querySelector<HTMLElement>('.compare-bar');
    const range = box.querySelector<HTMLInputElement>('input[type="range"]');
    const replay = box.querySelector<HTMLButtonElement>('[data-replay]');
    const [a, b] = ['.compare-a', '.compare-b'].map((q) => box.querySelector<HTMLElement>(q));
    const ca = a && clips.get(a);
    const cb = b && clips.get(b);
    if (!frame || !bar || !range || !replay || !ca || !cb) return;
    box.classList.add('is-live');
    bar.hidden = false;
    // the stock per-clip buttons would duplicate the Replay control
    ca.ctl.hidden = true; cb.ctl.hidden = true;
    const setPos = (v: number) => {
      const pct = Math.min(100, Math.max(0, v));
      frame.style.setProperty('--pos', `${pct}%`);
      range.value = String(Math.round(pct));
      range.setAttribute('aria-valuetext', `${Math.round(pct)}% final composite revealed`);
    };
    setPos(50);
    range.addEventListener('input', () => setPos(Number(range.value)));
    const fromPointer = (ev: PointerEvent) => { const r = frame.getBoundingClientRect(); setPos(((ev.clientX - r.left) / r.width) * 100); };
    frame.addEventListener('pointerdown', (ev) => { frame.setPointerCapture(ev.pointerId); fromPointer(ev); frame.dataset.drag = 'true'; });
    frame.addEventListener('pointermove', (ev) => { if (frame.dataset.drag) fromPointer(ev); });
    const end = () => { delete frame.dataset.drag; };
    frame.addEventListener('pointerup', end); frame.addEventListener('pointercancel', end);

    const both = (fn: (c: Clip) => void) => { fn(ca); fn(cb); };
    let played = false;
    const start = () => {
      both((c) => { c.video.currentTime = 0; ensureSrc(c); });
      Promise.all([ca.video.play(), cb.video.play()]).then(() => { played = true; both(sync); }).catch(() => { both((c) => { c.fig.dataset.blocked = 'true'; }); });
    };
    ca.video.addEventListener('timeupdate', () => { if (Math.abs(cb.video.currentTime - ca.video.currentTime) > 0.1) cb.video.currentTime = ca.video.currentTime; });
    replay.addEventListener('click', start);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { both(ensureSrc); if (!played && autoplayAllowed()) start(); }
      }
    }, { threshold: 0.6 });
    io.observe(frame);
    // keep the sibling clips preloaded when the block is near
    new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) both(ensureSrc); }, { rootMargin: '60% 0px' }).observe(frame);
  });

  // chapter rail and progress
  const rail = document.querySelector<HTMLElement>('.rail');
  if (rail) {
    rail.hidden = false;
    const links = new Map<string, HTMLElement>();
    rail.querySelectorAll<HTMLElement>('[data-rail]').forEach((l) => links.set(l.dataset.rail as string, l));
    const bar = rail.querySelector<HTMLElement>('.rail-bar i');
    const heroEl = root.querySelector<HTMLElement>('.wt-hero');
    const secs = [...root.querySelectorAll<HTMLElement>('.chapter, .result')];
    const chapIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((l, id) => { if (id === (e.target as HTMLElement).id) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => chapIo.observe(s));
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const top = secs[0].offsetTop;
        const end = root.offsetTop + root.offsetHeight - innerHeight;
        const p = Math.min(1, Math.max(0, (scrollY - top + innerHeight * 0.5) / Math.max(1, end - top + innerHeight * 0.5)));
        if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
        const past = heroEl ? scrollY > heroEl.offsetHeight * 0.6 : true;
        rail.classList.toggle('on', past);
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
