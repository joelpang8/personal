/* hero.js — the homepage opening visual. Three styles, chosen by SITE.heroStyle in content.js:
     "rotate"  — full-width artworks; each new one is drawn in by feathered strokes (and by the cursor)
     "lines"   — a live canvas of ink-like lines that flow, hatch, and bend away from the cursor
     "collage" — pieces scattered around the name that drift with the mouse and scroll
   window.renderHero(style) switches styles (used by the preview's option switcher). */

(function () {
  const root = window.SITE_ROOT || "";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cleanup = () => {};

  const workOf = (file) => SITE.artworks.find((w) => w.file === file || (w.images || []).includes(file));
  const yearOf = (file) => { const a = workOf(file); return a ? a.year : null; };
  // link to the piece itself on its year page (the cards there have id="w-<first image name>")
  const pieceHref = (a) => {
    const href = yearHref(a.year);
    if (href.startsWith("#")) return href;   // the single-page preview can only jump to the year
    const first = (a.images && a.images.length ? a.images[0] : a.file).replace(/\.[a-z]+$/i, "");
    return href + "#w-" + first;
  };
  const yearHref = (y) => (window.yearHref ? window.yearHref(y) : root + y + "/");
  const pieces = () => (SITE.heroPieces || []).map((f) => ({ file: f, year: yearOf(f) })).filter((p) => p.year);

  /* ---------------- rotate ----------------
     Each new piece is drawn in by flowing, feathered strokes (like Joel's linework) instead of a
     plain fade. Moving the mouse / dragging a finger over the hero scratches the next piece in early. */
  function rotate(hero, stage) {
    const list = pieces();
    if (!list.length) return () => {};
    const slide = document.createElement("div");
    slide.className = "hero-slide on";
    const canvas = document.createElement("canvas");
    canvas.className = "hero-reveal";
    stage.append(slide, canvas);
    const caption = document.createElement("a");
    caption.className = "hero-caption";
    hero.appendChild(caption);

    const ctx = canvas.getContext("2d");
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    const imgs = list.map((p) => { const im = new Image(); im.src = `${root}images/${p.file}`; return im; });
    let cur = 0, nxt = 1 % list.length, W = 0, H = 0, dpr = 1, raf = 0, timer = 0, dirty = false;
    let revealing = false, frameN = 0, parts = [], last = null, t = 0;

    const setSlide = (i) => {
      slide.style.backgroundImage = `url('${imgs[i].src}')`;
      slide.classList.remove("zoom"); void slide.offsetWidth;
      if (!reduce) slide.classList.add("zoom");
      const a = workOf(list[i].file);
      caption.href = pieceHref(a);
      caption.innerHTML = "";
      const t = document.createElement("span"); t.className = "hc-title"; t.textContent = `${a.title}, ${a.year}`;
      const m = document.createElement("span"); m.className = "hc-meta"; m.textContent = a.medium;
      caption.append(t, m);
      caption.setAttribute("aria-label", `${a.title}, ${a.year}, ${a.medium}. View this piece`);
    };
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      for (const c of [canvas, mask]) { c.width = W * dpr; c.height = H * dpr; }
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };
    const cover = (im) => {   // same framing as CSS background-size: cover; centre
      const sc = Math.max(W / im.naturalWidth, H / im.naturalHeight);
      const w = im.naturalWidth * sc, h = im.naturalHeight * sc;
      ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
    };
    const paint = () => {
      if (!W || !H || !mask.width || !mask.height) return;   // hero hidden (e.g. preview on another page)
      ctx.clearRect(0, 0, W, H);
      const im = imgs[nxt];
      if (!im.complete || !im.naturalWidth) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(mask, 0, 0, W, H);
      ctx.globalCompositeOperation = "source-in";
      cover(im);
      ctx.globalCompositeOperation = "source-over";
    };
    // one feathered stroke on the mask: a line plus short cross-hatch ticks
    const stroke = (x0, y0, x1, y1, w) => {
      mctx.lineCap = "round"; mctx.strokeStyle = "#000"; mctx.lineWidth = w;
      mctx.beginPath(); mctx.moveTo(x0, y0); mctx.lineTo(x1, y1); mctx.stroke();
      const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, k = w * 0.9;
      mctx.lineWidth = Math.max(1, w * 0.12);
      for (let j = 0; j < 3; j++) {
        const f = Math.random(), x = x0 + dx * f, y = y0 + dy * f;
        mctx.beginPath(); mctx.moveTo(x - nx * k, y - ny * k); mctx.lineTo(x + nx * k, y + ny * k); mctx.stroke();
      }
    };
    const field = (x, y) => (Math.sin(x * 0.004 + t * 0.03) + Math.cos(y * 0.005 - t * 0.02) + Math.sin((x + y) * 0.002)) * 1.4;

    const startReveal = () => {
      if (revealing || hold || !imgs[nxt].complete) return;
      revealing = true; frameN = 0;
      parts = Array.from({ length: W < 700 ? 70 : 150 }, () => ({ x: Math.random() * W, y: Math.random() * H }));
    };
    let hold = false;
    const commit = () => {
      // put the revealed piece in the background layer, then clear the strokes a moment later
      // so the swap is invisible even if the browser takes a frame to paint the new background
      hold = true; revealing = false;
      setSlide(nxt);
      setTimeout(() => {
        cur = nxt; nxt = (cur + 1) % list.length;
        mctx.clearRect(0, 0, W, H); dirty = true; hold = false;
      }, 160);
    };
    const DUR = 150;   // frames (~2.5 s) to draw the next piece in
    const frame = () => {
      t++;
      if (revealing) {
        frameN++;
        const w = 4 + (frameN / DUR) ** 1.6 * 110;   // strokes start fine and thicken until they cover the frame
        for (const p of parts) {
          const a = field(p.x, p.y), nx = p.x + Math.cos(a) * 9, ny = p.y + Math.sin(a) * 9;
          stroke(p.x, p.y, nx, ny, w);
          p.x = nx; p.y = ny;
          if (nx < -40 || ny < -40 || nx > W + 40 || ny > H + 40) { p.x = Math.random() * W; p.y = Math.random() * H; }
        }
        dirty = true;
        if (frameN >= DUR) { mctx.fillRect(0, 0, W, H); paint(); commit(); }
      }
      if (dirty) { paint(); dirty = false; }
      raf = requestAnimationFrame(frame);
    };
    // visitors can scratch the next piece in themselves
    const onMove = (e) => {
      if (revealing || hold) return;
      const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (last) stroke(last.x, last.y, x, y, W < 700 ? 30 : 46);
      last = { x, y }; dirty = true;
    };
    const onLeave = () => { last = null; };
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } };

    setSlide(0);
    if (reduce) {   // no drawing motion: switch pieces with a plain cut every 7 s
      timer = setInterval(() => { cur = (cur + 1) % list.length; setSlide(cur); }, 7000);
      return () => { clearInterval(timer); caption.remove(); };
    }
    size();
    const ro = new ResizeObserver(() => { if (hero.clientWidth !== W || hero.clientHeight !== H) size(); });
    ro.observe(hero);
    hero.addEventListener("pointermove", onMove); hero.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    timer = setInterval(() => { if (!document.hidden) startReveal(); }, 6500);
    raf = requestAnimationFrame(frame);
    return () => {
      clearInterval(timer); cancelAnimationFrame(raf); ro.disconnect(); caption.remove();
      hero.removeEventListener("pointermove", onMove); hero.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }

  /* ---------------- lines ---------------- */
  function lines(hero, stage) {
    const canvas = document.createElement("canvas");
    stage.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    // mostly ink, with the accent colours that run through Joel's work
    const palette = ["#1c1c1a", "#1c1c1a", "#1c1c1a", "#1c1c1a", "#1c1c1a", "#d6409a", "#28b3c8", "#e6bf2e", "#7a5bd0"];
    let W = 0, H = 0, parts = [], raf = 0, t = 0, mouse = { x: -9999, y: -9999 }, visible = true;

    const spawn = (p = {}) => {
      p.x = Math.random() * W; p.y = Math.random() * H;
      p.life = 120 + Math.random() * 260; p.step = 0;
      p.c = palette[(Math.random() * palette.length) | 0];
      p.w = 0.6 + Math.random() * 1.1;
      return p;
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      parts = Array.from({ length: W < 700 ? 140 : 320 }, () => spawn());
    };
    const field = (x, y) =>
      (Math.sin(x * 0.0026 + t * 0.0021) + Math.cos(y * 0.0032 - t * 0.0017) + Math.sin((x + y) * 0.0014 + t * 0.001)) * 1.35;

    const frame = () => {
      t++;
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,0.022)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      for (const p of parts) {
        let a = field(p.x, p.y);
        let vx = Math.cos(a) * 1.4, vy = Math.sin(a) * 1.4;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 150 * 150) { const f = (1 - Math.sqrt(d2) / 150) * 3; vx += (dx / Math.sqrt(d2 + 1)) * f; vy += (dy / Math.sqrt(d2 + 1)) * f; }
        const nx = p.x + vx, ny = p.y + vy;
        ctx.strokeStyle = p.c; ctx.globalAlpha = 0.7; ctx.lineWidth = p.w;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        // short cross-hatch ticks, like the feathered edges in the drawings
        if (++p.step % 16 === 0) {
          const len = 2 + p.w * 2, px = -vy / 1.4 * len, py = vx / 1.4 * len;
          ctx.globalAlpha = 0.45;
          ctx.beginPath(); ctx.moveTo(nx - px, ny - py); ctx.lineTo(nx + px, ny + py); ctx.stroke();
        }
        p.x = nx; p.y = ny;
        if (--p.life < 0 || nx < -10 || ny < -10 || nx > W + 10 || ny > H + 10) spawn(p);
      }
      ctx.globalAlpha = 1;
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const onMove = (e) => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onVis = () => { cancelAnimationFrame(raf); if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; onVis(); });

    resize();
    if (reduce) { for (let k = 0; k < 160; k++) frame(); }   // a still drawing, no motion
    else { io.observe(hero); hero.addEventListener("pointermove", onMove); hero.addEventListener("pointerleave", onLeave); document.addEventListener("visibilitychange", onVis); }
    let lastW = W, lastH = H;
    const ro = new ResizeObserver(() => {
      if (hero.clientWidth !== lastW || hero.clientHeight !== lastH) { lastW = hero.clientWidth; lastH = hero.clientHeight; resize(); if (reduce) for (let k = 0; k < 160; k++) frame(); }
    });
    ro.observe(hero);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      hero.removeEventListener("pointermove", onMove); hero.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }

  /* ---------------- collage ---------------- */
  // x, y = top-left as % of the hero; w = width as % of the hero; r = tilt; d = depth (how far it drifts)
  const DESKTOP = [
    { x: 4, y: 8, w: 14, r: -4, d: 0.7 }, { x: 21, y: 56, w: 12, r: 3, d: 1.1 }, { x: 3, y: 60, w: 11, r: 5, d: 0.4 },
    { x: 76, y: 7, w: 12, r: 3, d: 0.8 }, { x: 86, y: 46, w: 11, r: -5, d: 1.2 }, { x: 67, y: 60, w: 13, r: -2, d: 0.5 },
    { x: 37, y: 3, w: 9, r: 2, d: 0.9 }, { x: 47, y: 70, w: 10, r: -3, d: 0.6 }, { x: 89, y: 4, w: 8, r: 6, d: 0.3 },
    { x: 20, y: 6, w: 9, r: 5, d: 0.5 }, { x: 56, y: 4, w: 8, r: -4, d: 0.4 }, { x: 31, y: 70, w: 8, r: 4, d: 0.8 },
  ];
  const MOBILE = [
    { x: 3, y: 4, w: 30, r: -4, d: 0.7 }, { x: 66, y: 3, w: 30, r: 4, d: 0.9 }, { x: 36, y: 6, w: 22, r: 2, d: 0.4 },
    { x: 4, y: 66, w: 28, r: 4, d: 1 }, { x: 66, y: 64, w: 30, r: -3, d: 0.6 }, { x: 38, y: 72, w: 22, r: -2, d: 0.8 },
  ];
  function collage(hero, stage) {
    const list = pieces();
    const layout = hero.clientWidth < 700 ? MOBILE : DESKTOP;
    stage.innerHTML = layout.slice(0, list.length).map((L, i) => {
      const p = list[i];
      return `<a class="hero-piece" href="${yearHref(p.year)}" tabindex="-1" aria-hidden="true"
        style="left:${L.x}%;top:${L.y}%;width:${L.w}%;--r:${L.r}deg;--d:${L.d};animation-delay:${(i * -1.7).toFixed(1)}s">
        <img src="${root}images/thumbs/${p.file}" alt="" /></a>`;
    }).join("");
    if (reduce) return () => {};
    let tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, raf = 0;
    const onMove = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; };
    const tick = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06; sy = window.scrollY;
      hero.style.setProperty("--mx", cx.toFixed(3)); hero.style.setProperty("--my", cy.toFixed(3));
      hero.style.setProperty("--sy", Math.min(sy, 900).toFixed(0));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove); raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }

  window.renderHero = function (style) {
    const hero = document.getElementById("hero");
    if (!hero) return;
    cleanup();
    const stage = hero.querySelector(".hero-stage");
    stage.innerHTML = "";
    hero.dataset.style = style || "";
    document.body.dataset.hero = style || "";
    const run = { rotate, lines, collage }[style];
    cleanup = run ? run(hero, stage) || (() => {}) : () => {};
    if (style === "rotate") signature(hero);
  };

  /* ---------------- signature ----------------
     First homepage visit of each browser session: one line traces "JOEL PANG", the letters fill in,
     then the painting comes up behind it and the usual ink reveals carry on. Later visits skip it. */
  function signature(hero) {
    const h1 = hero.querySelector("h1");
    if (!h1 || reduce) return;
    let seen = false;
    try { seen = sessionStorage.getItem("jp-signature") === "1"; sessionStorage.setItem("jp-signature", "1"); } catch (e) {}
    if (seen) return;
    hero.classList.add("sig-intro");   // hide the painting right away so it can come up after the name
    const run = () => {
      const cs = getComputedStyle(h1), r = h1.getBoundingClientRect();
      if (!r.width) { hero.classList.remove("sig-intro"); return; }
      const fs = parseFloat(cs.fontSize), ls = parseFloat(cs.letterSpacing) || 0;
      const NS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "hero-sig");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("width", r.width); svg.setAttribute("height", r.height);
      svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      const text = document.createElementNS(NS, "text");
      text.textContent = h1.textContent.trim().toUpperCase();
      text.setAttribute("x", r.width / 2);   // same centring (and trailing letter-space) as the real heading
      text.setAttribute("y", r.height / 2);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      Object.assign(text.style, { fontFamily: cs.fontFamily, fontSize: fs + "px", fontWeight: cs.fontWeight, letterSpacing: ls + "px" });
      text.style.setProperty("--dash", Math.round(fs * 6));
      svg.appendChild(text);
      h1.style.position = "relative";
      h1.appendChild(svg);
      // after the trace, hand back to the real heading and bring the painting up
      setTimeout(() => hero.classList.add("sig-done"), 2700);
      setTimeout(() => { svg.remove(); hero.classList.remove("sig-intro", "sig-done"); }, 4600);
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(run));
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof SITE !== "undefined") window.renderHero(SITE.heroStyle);
  });
})();
