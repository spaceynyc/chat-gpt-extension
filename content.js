
// ChatGPT GPT‑5 Colorful Background - content script (MV3) - v1.2.8
(() => {
  const DEFAULTS = {
    gradient: `
      radial-gradient(60vw 40vw at 18% 22%, rgba(255,160,110,0.20), transparent 62%),
      radial-gradient(55vw 45vw at 82% 18%, rgba(90,150,255,0.22), transparent 60%),
      radial-gradient(50vw 40vw at 40% 60%, rgba(210,80,120,0.18), transparent 58%),
      linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.75) 92%, #000 100%)
    `.trim().replace(/\s+/g, ' '),
    dim: 0.18,
    blur: 0,
    enableTopFade: false,
    fadeHeightVH: 14,
    composerHole: true,
    sidebarAutoGap: true,
    sidebarGapPx: 280,
    aggressiveFix: true,
    sidebarGlass: 0.45,
    antiBandMask: true,
    antiBandHeightPx: 28,
    overlayGlass: 0.92
  };

  const STYLE_ID = 'gpt5-bg-style';
  const VARS_ID  = 'gpt5-vars';
  const FADE_ID  = 'gpt5-topfade';
  const ANTIBAND_ID = 'gpt5-antiband';
  let current = { ...DEFAULTS };

  function ensureVars() {
    let v = document.getElementById(VARS_ID);
    if (!v) {
      v = document.createElement('style');
      v.id = VARS_ID;
      document.documentElement.appendChild(v);
    }
    v.textContent = `:root{--gpt5-sidebar-glass:${current.sidebarGlass};--gpt5-overlay-glass:${current.overlayGlass};}`;
  }

  function css(settings) {
    const { gradient, dim, blur } = settings;
    return `
      html, body {
        background: ${gradient} !important;
        background-attachment: fixed !important;
        background-color: #000 !important;
      }

      html::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: rgba(0,0,0, ${dim});
        ${blur > 0 ? `backdrop-filter: blur(${blur}px);` : ""}
      }

      header, main, aside, footer, nav, section,
      [class*="surface"], [class*="bg-token"], [class*="bg-"],
      [class*="sidebar"], [data-testid*="sidebar"], [aria-label*="sidebar"],
      #__next, #root {
        background: transparent !important;
        background-image: none !important;
      }

      /* Sidebar glass backdrop */
      aside,
      nav[role="navigation"],
      [data-testid*="sidebar"],
      [aria-label*="sidebar"],
      [class*="sidebar"] {
        background-color: rgba(8,8,10, var(--gpt5-sidebar-glass, 0.45)) !important;
        backdrop-filter: saturate(120%) blur(3px);
      }
      aside [class*="sticky"],
      [data-testid*="sidebar"] [class*="sticky"],
      [class*="sidebar"] [class*="sticky"],
      aside footer,
      [class*="sidebar"] footer,
      [data-testid*="sidebar"] footer {
        background-color: rgba(8,8,10, var(--gpt5-sidebar-glass, 0.45)) !important;
        backdrop-filter: saturate(120%) blur(3px);
      }

      /* Settings modal, drawers, and search panel readability */
      [role="dialog"],
      [aria-modal="true"],
      [data-testid*="settings"],
      [data-testid*="modal"],
      [class*="Dialog"],
      [class*="drawer"],
      [data-testid*="search"],
      [aria-label*="Search chats"],
      [aria-label^="Search"],
      [placeholder="Search chats"] {
        background-color: rgba(12,12,14, var(--gpt5-overlay-glass, 0.92)) !important;
        backdrop-filter: saturate(120%) blur(6px);
      }
      [role="dialog"]::before,
      [role="dialog"]::after {
        background-color: rgba(12,12,14, var(--gpt5-overlay-glass, 0.92)) !important;
      }

      [data-gpt5-clean]::before,
      [data-gpt5-clean]::after {
        background: transparent !important;
        background-image: none !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
        box-shadow: none !important;
        content: "" !important;
      }
    `;
  }

  function ensureStyle() {
    let style = document.getElementById(STYLE_ID);
    const desired = css(current);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.setAttribute('data-gpt5-style', '1');
      document.documentElement.appendChild(style);
    }
    if (style.textContent !== desired) style.textContent = desired;
  }

  function detectSidebarWidth() {
    if (!current.sidebarAutoGap) return current.sidebarGapPx;
    const cand = document.querySelector('aside,[class*="sidebar"],nav[role="navigation"]');
    if (cand) {
      const w = Math.ceil(cand.getBoundingClientRect().width);
      if (w > 100 && w < window.innerWidth * 0.5) return w;
    }
    return current.sidebarGapPx;
  }

  function getComposerRect() {
    const el = document.querySelector('[data-testid="composer"], [class*="composer"], [class*="ChatComposer"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return r;
  }

  function ensureTopFade() {
    const { enableTopFade, fadeHeightVH, composerHole } = current;
    let fade = document.getElementById(FADE_ID);
    if (!enableTopFade) {
      if (fade && fade.parentNode) fade.parentNode.removeChild(fade);
      return;
    }
    const gap = detectSidebarWidth();
    if (!fade) {
      fade = document.createElement('div');
      fade.id = FADE_ID;
      Object.assign(fade.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        pointerEvents: 'none',
        zIndex: '2147483647'
      });
      document.body.appendChild(fade);
    } else if (fade.parentNode && fade.parentNode.lastChild !== fade) {
      fade.parentNode.appendChild(fade);
    }
    fade.style.left = `${gap}px`;
    fade.style.height = `${fadeHeightVH}vh`;
    fade.style.background = `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 68%, #000 100%)`;

    if (composerHole) {
      const r = getComposerRect();
      if (r) {
        const cx = Math.round(r.left + r.width / 2);
        const cy = Math.round(r.top + r.height / 2);
        const rx = Math.round(Math.max(320, r.width * 0.66));
        const ry = Math.round(Math.max(80, r.height * 1.3));
        fade.style.webkitMaskImage = `radial-gradient(${rx}px ${ry}px at ${cx}px ${cy}px, transparent 0, transparent 90%, black 100%)`;
        fade.style.maskImage = fade.style.webkitMaskImage;
      } else {
        fade.style.webkitMaskImage = 'none';
        fade.style.maskImage = 'none';
      }
    } else {
      fade.style.webkitMaskImage = 'none';
      fade.style.maskImage = 'none';
    }
  }

  function ensureAntiBand() {
    const { antiBandMask, antiBandHeightPx, composerHole } = current;
    let band = document.getElementById(ANTIBAND_ID);
    if (!antiBandMask) {
      if (band && band.parentNode) band.parentNode.removeChild(band);
      return;
    }
    const gap = detectSidebarWidth();
    if (!band) {
      band = document.createElement('div');
      band.id = ANTIBAND_ID;
      Object.assign(band.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        pointerEvents: 'none',
        zIndex: '2147483647'
      });
      document.body.appendChild(band);
    } else if (band.parentNode && band.parentNode.lastChild !== band) {
      band.parentNode.appendChild(band);
    }
    band.style.left = `${gap}px`;
    band.style.height = `${antiBandHeightPx}px`;
    band.style.background = `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)`;
    if (composerHole) {
      const r = getComposerRect();
      if (r) {
        const cx = Math.round(r.left + r.width / 2);
        const cy = Math.round(r.top + r.height / 2);
        const rx = Math.round(Math.max(320, r.width * 0.70));
        const ry = Math.round(Math.max(80, r.height * 1.35));
        band.style.webkitMaskImage = `radial-gradient(${rx}px ${ry}px at ${cx}px ${cy}px, transparent 0, transparent 90%, black 100%)`;
        band.style.maskImage = band.style.webkitMaskImage;
      } else {
        band.style.webkitMaskImage = 'none';
        band.style.maskImage = 'none';
      }
    } else {
      band.style.webkitMaskImage = 'none';
      band.style.maskImage = 'none';
    }
  }

  function cleanBottomOverlays() {
    if (!current.aggressiveFix) return;
    const els = Array.from(document.querySelectorAll('div,footer,section,header,aside,nav'));
    let cleaned = 0;
    for (const el of els) {
      if (el.closest('aside')) continue;
      if (el.dataset.gpt5Clean) continue;
      const cs = getComputedStyle(el);
      const pos = cs.position;
      const bg = cs.backgroundImage || '';
      const mask = (cs.webkitMaskImage && cs.webkitMaskImage !== 'none') || (cs.maskImage && cs.maskImage !== 'none');
      const before = getComputedStyle(el, '::before').backgroundImage || '';
      const after  = getComputedStyle(el, '::after').backgroundImage || '';
      const hasGrad = bg.includes('gradient') || before.includes('gradient') || after.includes('gradient') || mask;
      if (!hasGrad) continue;
      const rect = el.getBoundingClientRect();
      const nearBottom = rect.top > window.innerHeight * 0.50 || rect.bottom >= window.innerHeight - 1;
      const stickyOrFixed = pos === 'sticky' || pos === 'fixed';
      if (nearBottom || stickyOrFixed) {
        el.dataset.gpt5Clean = '1';
        el.setAttribute('data-gpt5-clean', '1');
        el.style.setProperty('background', 'transparent', 'important');
        el.style.setProperty('backgroundImage', 'none', 'important');
        el.style.setProperty('-webkit-mask-image', 'none', 'important');
        el.style.setProperty('mask-image', 'none', 'important');
        el.style.setProperty('box-shadow', 'none', 'important');
        cleaned++;
      }
    }
    if (cleaned) console.debug('GPT5BG: cleaned overlays', cleaned);
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureVars();
      ensureStyle();
      ensureTopFade();
      ensureAntiBand();
      cleanBottomOverlays();
    });
  }

  function navBurst(ms=700, step=70) {
    const end = Date.now() + ms;
    const kick = () => { scheduleApply(); if (Date.now() < end) setTimeout(kick, step); };
    kick();
  }
  function hookNavClicks() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href*="/c/"]');
      if (a) navBurst(900, 90);
    }, true);
  }

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    current = { ...DEFAULTS, ...stored };
    scheduleApply();
    setTimeout(scheduleApply, 400);
    setTimeout(scheduleApply, 900);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const [k, v] of Object.entries(changes)) current[k] = v.newValue;
    scheduleApply();
  });

  window.addEventListener('focus', scheduleApply);
  window.addEventListener('resize', scheduleApply);
  document.addEventListener('visibilitychange', scheduleApply);
  document.addEventListener('keydown', scheduleApply);
  hookNavClicks();
  ['pushState','replaceState'].forEach(fn => {
    const orig = history[fn];
    if (typeof orig === 'function') history[fn] = function(...args){ const r = orig.apply(this, args); navBurst(900, 90); return r; };
  });
  window.addEventListener('popstate', () => navBurst(900, 90));
  window.addEventListener('hashchange', () => navBurst(900, 90));
})();
