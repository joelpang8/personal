/* pages.js — the ink effects on About, Accomplishments and Contact.
     About:            [data-ink-reveal] figures are drawn onto the page by feathered pen strokes
     Accomplishments:  #timeline years draw their ink line in as they scroll into view
     Contact:          #contact-band gets a live canvas of flowing ink lines that bend away from the cursor
   Everything is visible without this script; it only adds motion. Reduced motion turns it all off. */

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  // run fn once the element is actually on screen and has a size (pages can start hidden in the preview)
  const whenVisible = (el, fn, threshold = 0.2) => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && el.offsetWidth) { io.disconnect(); fn(); }
    }, { threshold });
    io.observe(el);
  };
  // same flowing field the homepage uses, so every page's strokes move alike
  const field = (x, y, t) =>
    (Math.sin(x * 0.004 + t * 0.03) + Math.cos(y * 0.005 - t * 0.02) + Math.sin((x + y) * 0.002)) * 1.4;

  /* ---------- About: draw a painting onto the page ---------- */
  function inkReveal(fig) {
    const img = fig.querySelector("img");
    if (!img) return;
    const c = document.createElement("canvas");
    c.className = "ink-cover";
    c.setAttribute("aria-hidden", "true");
    fig.appendChild(c);
    const ctx = c.getContext("2d");
    const paper = getComputedStyle(document.body).backgroundColor;
    let W = 0, H = 0, started = false;
    const cover = () => {
      W = img.clientWidth; H = img.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + "px"; c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H);
    };
    cover();
    const ro = new ResizeObserver(() => { if (!started) cover(); });
    ro.observe(img);
    whenVisible(fig, () => {
      started = true; ro.disconnect(); cover();
      const parts = Array.from({ length: W < 500 ? 60 : 110 }, () => ({ x: Math.random() * W, y: Math.random() * H }));
      const DUR = 120; let f = 0, t = 0;
      const step = () => {
        f++; t++;
        const w = 3 + (f / DUR) ** 1.7 * 80;
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineCap = "round"; ctx.strokeStyle = "#000";
        for (const p of parts) {
          const a = field(p.x, p.y, t), nx = p.x + Math.cos(a) * 7, ny = p.y + Math.sin(a) * 7;
          ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
          // short cross-hatch ticks, like the edges in the drawings
          ctx.lineWidth = Math.max(1, w * 0.12);
          const dx = nx - p.x, dy = ny - p.y, L = Math.hypot(dx, dy) || 1, k = w * 0.9;
          ctx.beginPath(); ctx.moveTo(nx - (-dy / L) * k, ny - (dx / L) * k); ctx.lineTo(nx + (-dy / L) * k, ny + (dx / L) * k); ctx.stroke();
          p.x = nx; p.y = ny;
          if (nx < -30 || ny < -30 || nx > W + 30 || ny > H + 30) { p.x = Math.random() * W; p.y = Math.random() * H; }
        }
        if (f < DUR) requestAnimationFrame(step);
        else c.remove();
      };
      requestAnimationFrame(step);
    }, 0.3);
  }
  document.querySelectorAll("[data-ink-reveal]").forEach(inkReveal);

  /* ---------- Accomplishments: ink line draws in year by year ---------- */
  const tl = document.getElementById("timeline");
  if (tl) {
    tl.classList.add("tl-anim");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting && e.target.offsetWidth) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    tl.querySelectorAll(".tl-year").forEach((y) => io.observe(y));
  }

  /* ---------- Contact: live flowing lines behind the details ---------- */
  const band = document.getElementById("contact-band");
  if (band) {
    const stage = band.querySelector(".contact-stage");
    const canvas = document.createElement("canvas");
    stage.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const palette = ["#1c1c1a", "#1c1c1a", "#1c1c1a", "#1c1c1a", "#d6409a", "#28b3c8", "#e6bf2e", "#7a5bd0"];
    let W = 0, H = 0, parts = [], raf = 0, t = 0, visible = false, mouse = { x: -9999, y: -9999 };
    const spawn = (p = {}) => {
      p.x = Math.random() * W; p.y = Math.random() * H; p.life = 120 + Math.random() * 240; p.step = 0;
      p.c = palette[(Math.random() * palette.length) | 0]; p.w = 0.6 + Math.random() * 1.1; return p;
    };
    const size = () => {
      W = band.clientWidth; H = band.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: W < 700 ? 110 : 240 }, () => spawn());
    };
    const frame = () => {
      t++;
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,0.022)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over"; ctx.lineCap = "round";
      for (const p of parts) {
        const a = field(p.x, p.y, t * 0.15);
        let vx = Math.cos(a) * 1.3, vy = Math.sin(a) * 1.3;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) { const d = Math.sqrt(d2) + 1, f = (1 - d / 140) * 3; vx += (dx / d) * f; vy += (dy / d) * f; }
        const nx = p.x + vx, ny = p.y + vy;
        ctx.strokeStyle = p.c; ctx.globalAlpha = 0.7; ctx.lineWidth = p.w;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        if (++p.step % 16 === 0) {
          const len = 2 + p.w * 2, px = (-vy / 1.3) * len, py = (vx / 1.3) * len;
          ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.moveTo(nx - px, ny - py); ctx.lineTo(nx + px, ny + py); ctx.stroke();
        }
        p.x = nx; p.y = ny;
        if (--p.life < 0 || nx < -10 || ny < -10 || nx > W + 10 || ny > H + 10) spawn(p);
      }
      ctx.globalAlpha = 1;
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const go = () => { cancelAnimationFrame(raf); if (visible && !document.hidden && W) raf = requestAnimationFrame(frame); };
    new ResizeObserver(() => { if (band.clientWidth !== W || band.clientHeight !== H) { size(); go(); } }).observe(band);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; go(); }).observe(band);
    document.addEventListener("visibilitychange", go);
    band.addEventListener("pointermove", (e) => { const r = band.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    band.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  }
})();
