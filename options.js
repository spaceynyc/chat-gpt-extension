
(() => {
  const DEFAULTS = {
    gradient: `radial-gradient(60vw 40vw at 18% 22%, rgba(255,160,110,0.20), transparent 62%), radial-gradient(55vw 45vw at 82% 18%, rgba(90,150,255,0.22), transparent 60%), radial-gradient(50vw 40vw at 40% 60%, rgba(210,80,120,0.18), transparent 58%), linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.75) 92%, #000 100%)`,
    dim: 0.18, blur: 0, enableTopFade: false, fadeHeightVH: 14,
    composerHole: true, sidebarAutoGap: true, sidebarGapPx: 280, aggressiveFix: true,
    sidebarGlass: 0.45, overlayGlass: 0.92
  };
  const presets = {
    intro: DEFAULTS.gradient,
    aurora: `radial-gradient(62vw 48vw at 12% 10%, rgba(120,220,255,0.22), transparent 60%), radial-gradient(70vw 60vw at 88% 22%, rgba(150,255,200,0.20), transparent 62%), radial-gradient(48vw 38vw at 40% 70%, rgba(190,120,255,0.16), transparent 58%), linear-gradient(180deg, rgba(0,0,10,0.0), rgba(0,0,0,1) 100%)`,
    midnight: `radial-gradient(60vw 50vw at 80% 16%, rgba(110,140,255,0.20), transparent 62%), radial-gradient(50vw 40vw at 20% 22%, rgba(40,100,200,0.16), transparent 58%), linear-gradient(160deg, #0a0e16 0%, #060a10 60%, #000 100%)`,
    ember: `radial-gradient(62vw 44vw at 18% 22%, rgba(255,150,110,0.22), transparent 60%), radial-gradient(56vw 46vw at 86% 20%, rgba(255,120,180,0.18), transparent 60%), linear-gradient(160deg, #0f0b0a 0%, #0a0707 60%, #000 100%)`,
    dusklite: `radial-gradient(60vw 48vw at 30% 20%, rgba(255,200,160,0.18), transparent 58%), radial-gradient(56vw 46vw at 80% 30%, rgba(200,140,255,0.18), transparent 58%), linear-gradient(160deg, #0e0d10 0%, #0a0a0e 60%, #000 100%)`,
    indigo: `radial-gradient(62vw 50vw at 14% 22%, rgba(140,120,255,0.22), transparent 60%), radial-gradient(56vw 44vw at 86% 18%, rgba(110,200,255,0.20), transparent 60%), linear-gradient(160deg, #0b0b16 0%, #0a0a0f 60%, #000 100%)`,
    rose: `radial-gradient(62vw 48vw at 18% 20%, rgba(255,140,180,0.22), transparent 60%), radial-gradient(56vw 46vw at 82% 24%, rgba(255,200,150,0.18), transparent 60%), linear-gradient(160deg, #110c10 0%, #0b0a0a 60%, #000 100%)`,
    noir: `radial-gradient(70vw 58vw at 50% -10%, rgba(255,255,255,0.06), transparent 62%), radial-gradient(60vw 50vw at 10% 110%, rgba(255,255,255,0.04), transparent 60%), linear-gradient(160deg, #0b0b0b 0%, #080808 60%, #000 100%)`
  };
  const $ = id => document.getElementById(id);
  const gradientEl = $('gradient'), dimEl = $('dim'), blurEl = $('blur'), fadeEl = $('fadeHeightVH');
  const enableTopFadeEl = $('enableTopFade'), composerHoleEl = $('composerHole');
  const sidebarAutoGapEl = $('sidebarAutoGap'), sidebarGapPxEl = $('sidebarGapPx'), aggressiveFixEl = $('aggressiveFix');
  const sidebarGlassEl = $('sidebarGlass'), overlayGlassEl = $('overlayGlass');
  const dimvEl = $('dimv'), blurvEl = $('blurv'), fadevEl = $('fadev'), glassvEl = $('glassv'), overlayvEl = $('overlayv'), previewEl = $('preview'), saveBtn = $('save');
  function toast(msg){ const t=document.getElementById('gpt5_toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(window.__gpt5_toast_timer); window.__gpt5_toast_timer=setTimeout(()=>t.classList.remove('show'),1400); }
  function applyPreview(){ previewEl.style.background = gradientEl.value; previewEl.style.boxShadow = `inset 0 0 0 100vmax rgba(0,0,0,${Number(dimEl.value).toFixed(2)})`; previewEl.style.filter = Number(blurEl.value)>0 ? `blur(${blurEl.value}px)` : 'none'; }
  function load(){ chrome.storage.sync.get(DEFAULTS, (cfg) => { gradientEl.value=cfg.gradient; dimEl.value=cfg.dim; blurEl.value=cfg.blur; enableTopFadeEl.checked=!!cfg.enableTopFade; composerHoleEl.checked=cfg.composerHole!==false; sidebarAutoGapEl.checked=cfg.sidebarAutoGap!==false; sidebarGapPxEl.value=cfg.sidebarGapPx??280; fadeEl.value=cfg.fadeHeightVH??14; sidebarGlassEl.value=cfg.sidebarGlass??0.45; overlayGlassEl.value=cfg.overlayGlass??0.92; dimvEl.textContent=Number(cfg.dim).toFixed(2); blurvEl.textContent=String(cfg.blur); fadevEl.textContent=String(cfg.fadeHeightVH??14)+'vh'; glassvEl.textContent=Number(sidebarGlassEl.value).toFixed(2); overlayvEl.textContent=Number(overlayGlassEl.value).toFixed(2); applyPreview(); }); }
  function save(){ const cfg={ gradient:gradientEl.value.trim(), dim:parseFloat(dimEl.value), blur:parseInt(blurEl.value,10), enableTopFade:!!enableTopFadeEl.checked, fadeHeightVH:parseInt(fadeEl.value,10), composerHole:!!composerHoleEl.checked, sidebarAutoGap:!!sidebarAutoGapEl.checked, sidebarGapPx:parseInt(sidebarGapPxEl.value||"280",10), aggressiveFix:!!aggressiveFixEl.checked, sidebarGlass:parseFloat(sidebarGlassEl.value), overlayGlass:parseFloat(overlayGlassEl.value) }; chrome.storage.sync.set(cfg,()=>{ toast('Saved'); }); }
  document.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>{ const name=btn.getAttribute('data-preset'); gradientEl.value=presets[name]; applyPreview(); toast(`${name} preset loaded, click Save`);}));
  gradientEl.addEventListener('input', applyPreview);
  dimEl.addEventListener('input', ()=>{ dimvEl.textContent=Number(dimEl.value).toFixed(2); applyPreview(); });
  blurEl.addEventListener('input', ()=>{ blurvEl.textContent=String(blurEl.value); applyPreview(); });
  fadeEl.addEventListener('input', ()=>{ fadevEl.textContent=String(fadeEl.value)+'vh'; });
  sidebarGlassEl.addEventListener('input', ()=>{ glassvEl.textContent=Number(sidebarGlassEl.value).toFixed(2); });
  overlayGlassEl.addEventListener('input', ()=>{ overlayvEl.textContent=Number(overlayGlassEl.value).toFixed(2); });
  saveBtn.addEventListener('click', save); document.addEventListener('DOMContentLoaded', load);
})();
