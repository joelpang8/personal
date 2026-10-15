/* script.js — nav toggle, year overview, year pages, lightbox. Vanilla JS, no build step.
   Year pages live one folder down (2024/index.html), so they set window.SITE_ROOT = "../"
   before loading this file; every image and link below is built from that root. */

document.addEventListener("DOMContentLoaded", () => {
  const root = window.SITE_ROOT || "";
  const yearHref = window.yearHref || ((y) => root + y + "/index.html");
  const imgSrc = (file) => root + "images/" + file;
  const years = (typeof SITE !== "undefined" && SITE.years) || [];
  const worksFor = (y) => SITE.artworks.filter((a) => String(a.year) === String(y));
  // a piece can have one photo (`file`) or several (`images`: full view first, then details)
  const viewsOf = (a) => (a.images && a.images.length ? a.images : [a.file]);
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const countLabel = (n) => (n === 1 ? "1 work" : n + " works");

  /* ---- "Inquire" email for a piece: subject and body are pre-filled so Joel knows which one ---- */
  const pieceId = (a) => "w-" + String(viewsOf(a)[0]).replace(/\.[a-z]+$/i, "");
  const pieceUrl = (a) => (SITE.siteUrl || "https://joelpang.com").replace(/\/$/, "") + "/" + a.year + "/#" + pieceId(a);
  const pieceLine = (a) => `${a.title}, ${a.year}. ${a.medium}${a.dimensions ? ", " + a.dimensions : ""}`;
  const inquireHref = (a) =>
    "mailto:" + SITE.email +
    "?subject=" + encodeURIComponent(`Inquiry: ${a.title} (${a.year}${a.dimensions ? ", " + a.dimensions : ""})`) +
    "&body=" + encodeURIComponent(`Hi Joel,\n\nI'm interested in this piece:\n\n${pieceLine(a)}\n${pieceUrl(a)}\n\n\n\nThanks,\n`);
  const statusOf = (a) => String(a.status || "").toLowerCase();
  const inquireHtml = (a, cls) => {
    const st = statusOf(a);
    if (st === "sold") return `<span class="${cls} is-sold">Sold</span>`;
    const tag = st === "available" ? `<span class="avail-tag">Available</span>` : "";
    return SITE.email
      ? `<span class="${cls}">${tag}<a class="inquire" href="${esc(inquireHref(a))}">Inquire</a></span>`
      : "";
  };

  /* ---- mobile nav ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.closest(".site-header").classList.toggle("menu-open", nav.classList.contains("open"));
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); toggle.closest(".site-header").classList.remove("menu-open"); }));
  }

  /* ---- homepage: header turns solid once the opening artwork has scrolled out from behind it ---- */
  const heroEl = document.getElementById("hero");
  const headerEl = document.querySelector(".site-header");
  if (heroEl && headerEl) {
    const io = new IntersectionObserver(
      ([e]) => headerEl.classList.toggle("solid", !e.isIntersecting),
      { rootMargin: `-${headerEl.offsetHeight || 72}px 0px 0px 0px` }
    );
    io.observe(heroEl);
  }

  /* ---- footer year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- footer contact: email and Instagram from content.js ---- */
  document.querySelectorAll(".footer-contact").forEach((el) => {
    const parts = [];
    if (SITE.email) parts.push(`<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`);
    if (SITE.instagram)
      parts.push(`<a href="${esc(SITE.instagram)}" target="_blank" rel="noopener">${esc(SITE.instagramHandle || "Instagram")}</a>`);
    el.innerHTML = parts.join("");
  });

  /* ---- homepage: one tile per year ---- */
  const index = document.getElementById("year-index");
  if (index) {
    index.innerHTML = years
      .map((y) => {
        const works = worksFor(y);
        const cover = works.find((a) => a.cover) || works[0];   // `cover: true` in content.js picks the year's cover
        return `
        <a class="year-tile" href="${yearHref(y)}">
          <figure>${cover ? `<img src="${imgSrc(viewsOf(cover)[0])}" alt="Work from ${y}" loading="lazy" />` : ""}</figure>
          <span class="year-tile-label">
            <span class="year-tile-year" style="view-transition-name: year-${y}">${y}</span>
            <span class="year-tile-count">${countLabel(works.length)}</span>
          </span>
        </a>`;
      })
      .join("");
  }

  /* ---- page transitions: the big year heading shares a name with its homepage tile ---- */
  document.querySelectorAll(".year-header h1").forEach((h) => {
    h.style.viewTransitionName = "year-" + h.textContent.trim();
  });

  /* ---- year strip (2019 ... 2026) on each year page ---- */
  const ascending = [...years].sort();
  document.querySelectorAll(".year-strip").forEach((strip) => {
    const current = strip.dataset.current;
    strip.innerHTML = ascending
      .map((y) => `<a href="${yearHref(y)}"${y === current ? ' aria-current="page"' : ""}>${y}</a>`)
      .join("");
  });

  /* ---- previous / next year links ---- */
  document.querySelectorAll(".year-pager").forEach((pager) => {
    const i = ascending.indexOf(pager.dataset.year);
    const prev = ascending[i - 1];
    const next = ascending[i + 1];
    pager.innerHTML =
      (prev ? `<a class="pager-prev" href="${yearHref(prev)}">&larr; ${prev}</a>` : "<span></span>") +
      (next ? `<a class="pager-next" href="${yearHref(next)}">${next} &rarr;</a>` : "<span></span>");
  });

  /* ---- works grid on each year page ---- */
  document.querySelectorAll(".year-gallery").forEach((grid) => {
    const y = grid.dataset.year;
    const works = worksFor(y);
    const counter = document.querySelector(`.year-count[data-year="${y}"]`);
    if (counter) counter.textContent = countLabel(works.length);
    grid.innerHTML = works.length
      ? works
          .map((a, i) => {
            const views = viewsOf(a);
            const dots =
              views.length > 1
                ? `<div class="dots" role="group" aria-label="Photos of ${esc(a.title)}">${views
                    .map(
                      (_, v) =>
                        `<button class="dot" data-view="${v}" aria-label="Photo ${v + 1} of ${views.length}"${
                          v === 0 ? ' aria-current="true"' : ""
                        }></button>`
                    )
                    .join("")}</div>`
                : "";
            return `
      <article class="gallery-item" id="${esc(pieceId(a))}" data-index="${i}" data-view="0">
        <div class="gi-media">
          <button class="gi-open" aria-label="View ${esc(a.title)} full size">
            <figure>
              <img src="${imgSrc(views[0])}" alt="${esc(a.title)}, ${esc(a.medium)}, ${esc(a.year)}" loading="lazy" />
            </figure>
          </button>
        </div>
        <div class="gi-caption">
          <div class="gi-text">
            <span class="g-title">${esc(a.title)}</span>
            <span class="g-meta">${esc(a.medium)}${a.dimensions ? " &middot; " + esc(a.dimensions) : ""}</span>
            ${inquireHtml(a, "g-inquire")}
          </div>
          ${dots}
        </div>
      </article>`;
          })
          .join("")
      : `<p class="gallery-empty">No works from ${esc(y)} are posted yet.</p>`;
  });

  /* ---- a link like /2026/#w-2026-04-1 (from an Inquire email) scrolls to that piece and highlights it ---- */
  if (location.hash.startsWith("#w-")) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      target.classList.add("is-target");
      requestAnimationFrame(() => target.scrollIntoView({ block: "center" }));
    }
  }

  /* ---- slideshow on a grid card: dots and swipe switch between photos of one piece ---- */
  const setCardView = (card, v) => {
    const a = worksFor(card.closest(".year-gallery").dataset.year)[+card.dataset.index];
    const views = viewsOf(a);
    v = (v + views.length) % views.length;
    card.dataset.view = v;
    card.querySelector(".gi-open img").src = imgSrc(views[v]);
    card.querySelectorAll(".dot").forEach((d) => {
      if (+d.dataset.view === v) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  };
  document.addEventListener("click", (e) => {
    const dot = e.target.closest(".gallery-item .dot");
    if (dot) setCardView(dot.closest(".gallery-item"), +dot.dataset.view);
  });
  let touchX = null;
  document.addEventListener("touchstart", (e) => {
    touchX = e.target.closest(".gi-media") ? e.touches[0].clientX : null;
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    const card = e.target.closest(".gallery-item");
    if (!card || !card.querySelector(".dot") || Math.abs(dx) < 40) return;
    card.dataset.swiped = "1"; // stop the tap that ends a swipe from opening the lightbox
    setCardView(card, +card.dataset.view + (dx < 0 ? 1 : -1));
  });

  /* ---- lightbox (shared by every year page) ----
     The arrows step through every photo of every piece on the page, in order;
     the dots show which photo of the current piece you're on. */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    const lbCaption = lightbox.querySelector(".lightbox-caption");
    let lbDots = lightbox.querySelector(".lightbox-dots");
    if (!lbDots) {
      lbDots = document.createElement("div");
      lbDots.className = "lightbox-dots";
      lbImg.insertAdjacentElement("afterend", lbDots);
    }
    let flat = []; // one entry per photo: { work, index, view, views }
    let current = 0;

    const show = (i) => {
      if (!flat.length) return;
      current = (i + flat.length) % flat.length;
      const { work: a, view, views } = flat[current];
      lbImg.src = imgSrc(views[view]);
      lbImg.alt = `${a.title}, ${a.medium}, ${a.year}${views.length > 1 ? `, photo ${view + 1} of ${views.length}` : ""}`;
      lbCaption.innerHTML = `<strong>${esc(a.title)}</strong> — ${esc(a.medium)}, ${esc(a.year)}${
        a.dimensions ? ", " + esc(a.dimensions) : ""
      }${inquireHtml(a, "lb-inquire")}`;
      const first = current - view;
      lbDots.innerHTML =
        views.length > 1
          ? views
              .map(
                (_, v) =>
                  `<button class="dot" data-flat="${first + v}" aria-label="Photo ${v + 1} of ${views.length}"${
                    v === view ? ' aria-current="true"' : ""
                  }></button>`
              )
              .join("")
          : "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    };

    document.addEventListener("click", (e) => {
      const open = e.target.closest(".gi-open");
      if (!open) return;
      const card = open.closest(".gallery-item");
      if (card.dataset.swiped) { delete card.dataset.swiped; return; }
      const works = worksFor(card.closest(".year-gallery").dataset.year);
      flat = [];
      works.forEach((w, index) => viewsOf(w).forEach((_, view, views) => flat.push({ work: w, index, view, views })));
      show(flat.findIndex((f) => f.index === +card.dataset.index && f.view === +card.dataset.view));
    });
    lbDots.addEventListener("click", (e) => {
      const d = e.target.closest(".dot");
      if (d) show(+d.dataset.flat);
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    let lbTouchX = null;
    lightbox.addEventListener("touchstart", (e) => { lbTouchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (lbTouchX === null) return;
      if (window.loupeHolding) { lbTouchX = null; return; }   // the touch was a loupe press, not a swipe
      const dx = e.changedTouches[0].clientX - lbTouchX;
      lbTouchX = null;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }
});

/* ---- loupe: a magnifier that follows the cursor over a piece, so visitors can see the linework.
   Desktop: hover any piece on a year page or in the full-size view.
   Phones: in the full-size view, press and hold on the painting, then drag.
   Uses the high-resolution copy in images/hd/ when there is one (listed in SITE.hd). ---- */
document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".year-gallery")) return;
  const root = window.SITE_ROOT || "";
  const hd = new Set((typeof SITE !== "undefined" && SITE.hd) || []);
  const ZOOM = 2.5;
  const lens = document.createElement("div");
  lens.className = "loupe";
  lens.setAttribute("aria-hidden", "true");
  document.body.appendChild(lens);
  const fileOf = (img) => decodeURIComponent((img.getAttribute("src") || "").split("/").pop());
  const sourceFor = (img) => {
    const f = fileOf(img);
    return hd.has(f) ? root + "images/hd/" + f : img.currentSrc || img.src;
  };
  // the painted area of an <img> drawn with object-fit: contain
  const paintedRect = (img) => {
    const r = img.getBoundingClientRect(), nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !nh) return r;
    const s = Math.min(r.width / nw, r.height / nh), w = nw * s, h = nh * s;
    return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, width: w, height: h };
  };
  let active = null;
  const show = (img, x, y, touch) => {
    const p = paintedRect(img);
    if (x < p.left || x > p.left + p.width || y < p.top || y > p.top + p.height) { hide(); return; }
    if (active !== img) {
      active = img;
      lens.style.backgroundImage = `url("${sourceFor(img)}")`;
    }
    const size = lens.offsetWidth || 180, half = size / 2;
    const lx = x - half, ly = touch ? y - size - 30 : y - half;
    lens.style.transform = `translate(${lx}px, ${ly}px)`;
    lens.style.backgroundSize = `${p.width * ZOOM}px ${p.height * ZOOM}px`;
    lens.style.backgroundPosition = `${-((x - p.left) * ZOOM - half)}px ${-((y - p.top) * ZOOM - half)}px`;
    lens.classList.add("on");
    img.classList.add("loupe-on");
  };
  const hide = () => {
    lens.classList.remove("on");
    if (active) active.classList.remove("loupe-on");
    active = null;
  };
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover) {
    document.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const img = e.target.closest && e.target.closest(".gi-open img, .lightbox-inner img");
      if (img) show(img, e.clientX, e.clientY, false); else if (active) hide();
    });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", hide, { passive: true });
  }
  // phones: press and hold in the full-size view
  const lbImg = document.querySelector(".lightbox-inner img");
  if (lbImg) {
    let holdTimer = null, start = null;
    lbImg.addEventListener("touchstart", (e) => {
      const t = e.touches[0]; start = { x: t.clientX, y: t.clientY };
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => { window.loupeHolding = true; show(lbImg, start.x, start.y, true); }, 320);
    }, { passive: true });
    lbImg.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      if (window.loupeHolding) { e.preventDefault(); show(lbImg, t.clientX, t.clientY, true); }
      else if (start && Math.hypot(t.clientX - start.x, t.clientY - start.y) > 10) clearTimeout(holdTimer);
    }, { passive: false });
    const end = () => { clearTimeout(holdTimer); hide(); setTimeout(() => { window.loupeHolding = false; }, 0); };
    lbImg.addEventListener("touchend", end); lbImg.addEventListener("touchcancel", end);
    lbImg.addEventListener("contextmenu", (e) => { if (window.loupeHolding) e.preventDefault(); });
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
});
