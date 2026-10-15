/*
  content.js
  ----------
  All editable site content lives here so Joel can update text/images
  without touching the page markup or styles.

  HOW TO ADD/REMOVE ARTWORK:
    Add or remove an object in the `artworks` array below. Put the image
    file in the /images folder and reference it by filename. Set `year` to
    the year it was made; it shows up on that year's page automatically.

  HOW TO EDIT BIO / ACCOMPLISHMENTS:
    Edit the `bio` and `accomplishments` objects further down.
*/

const SITE = {
  artistName: "Joel Pang",
  tagline: "Oil & Ink on Canvas, Wood, and Paper",
  email: "joelpangink@gmail.com",
  instagram: "https://instagram.com/joelpang.ink",
  instagramHandle: "@joelpang.ink",
  // Used in "Inquire" emails so you can see exactly which piece someone means.
  siteUrl: "https://joelpang.com",
  // Every piece shows an "Inquire" link that opens an email to you about it.
  // Optional per piece: add  status: "available"  or  status: "sold"  to its line.
  //   "available" adds an "Available" tag; "sold" shows "Sold" and hides the Inquire link.
  // Pieces made before this year get no Inquire link (a "sold" status still shows "Sold").
  inquireFromYear: 2025,

  // Each year here gets its own page (2019/index.html, 2020/index.html, ...).
  // Listed newest first; that's the order of the tiles on the homepage.
  // Homepage opening visual: "rotate" (crossfading artworks), "lines" (live drawing lines)
  // or "collage" (floating pieces). Leave empty ("") for the plain name only.
  heroStyle: "rotate",
  // Pieces used by "rotate" and "collage" — only 2024–2026 work (Joel). Clicking one opens its year.
  heroPieces: ["2026-jukebox-1.jpg", "2025-02.jpg", "2026-familiar-warrior-1.jpg", "2026-01-1.jpg",
               "2025-restoration.jpg", "2026-27-1.jpg", "2024-sketch-6.jpg", "2026-28-1.jpg",
               "2025-01.jpg", "2026-20-1.jpg", "2026-signal-passing.jpg", "2026-22-1.jpg"],

  years: ["2026", "2025", "2024", "2022", "2021", "2020", "2019"],

  // Every artwork appears on the page for its `year`, in the order listed here.
  // The piece marked `cover: true` is that year's cover image on the homepage.
  artworks: [
    // Within each year, pieces are arranged by color and composition (not by date or number),
    // so similar palettes sit together. To move a piece, move its line.
    // 2026
    { images: ["2026-familiar-warrior-1.jpg", "2026-familiar-warrior-2.jpg"], title: "Familiar Warrior", year: "2026", medium: "Oil and ink on canvas", dimensions: '30" x 40"' },
    { file: "2026-04-1.jpg",                                       title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '16" x 20"' },
    { file: "2026-05-1.jpg",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '16" x 20"' },
    { file: "2026-07-1.jpg",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '12" x 12"' },
    { file: "2026-signal-passing.jpg", title: "Signal Passing", year: "2026", medium: "Oil and ink on canvas", dimensions: '16" x 20"' },
    { file: "2026-06-1.jpg",                                       title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '16" x 20"' },
    { file: "2026-03-1.jpg",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '16" x 20"' },
    { file: "2026-24-1.jpg",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '8" x 10"' },
    { file: "2026-25-1.jpg",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '8" x 10"' },
    { file: "2026-26-1.jpg", status: "sold",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '8" x 10"' },
    { file: "2026-22-1.jpg",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '8" x 10"' },
    { file: "2026-23-1.jpg",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '8" x 10"' },
    { file: "2026-27-1.jpg",                                       title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '30" x 40"' },
    { file: "2026-jukebox-1.jpg", cover: true, title: "Jukebox", year: "2026", medium: "Oil and ink on canvas", dimensions: '30" x 40"' },
    { images: ["2026-28-1.jpg", "2026-28-3.jpg"], title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '11" x 14"' },
    { images: ["2026-29-1.jpg", "2026-29-3.jpg"], title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '10" x 12"' },
    { file: "2026-30-1.jpg",                                       title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '12" x 12"' },
    { file: "2026-08-1.jpg", status: "sold",                  title: "Untitled", year: "2026", medium: "Oil and ink on canvas",     dimensions: '12" x 14"' },
    { file: "2026-09-1.jpg",                                       title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { images: ["2026-01-1.jpg", "2026-01-3.jpg"], status: "sold", title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-13-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-16-1.jpg", status: "sold",                                       title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-18-1.jpg", status: "sold",                         title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-14-1.jpg", status: "sold",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-17-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-12-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-10-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-11-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-15-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-21-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-19-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    { file: "2026-20-1.jpg",                  title: "Untitled", year: "2026", medium: "Ink/Oil on Wood",           dimensions: '8" x 10"' },
    // 2025
    { images: ["2025-surveillance-1.jpg", "2025-surveillance-2.jpg"], title: "Surveillance", year: "2025", medium: "Acrylic, ink, and collage on canvas", dimensions: '24" x 36"' },
    { file: "2025-restoration.jpg", status: "sold", title: "Restoration", year: "2025", medium: "Ink on wood", dimensions: '8" x 10"' },
    { file: "2025-04.jpg", status: "sold",                                         title: "Untitled", year: "2025", medium: "Ink/Oil on Wood", dimensions: '8" x 10"' },
    { file: "2025-01.jpg", status: "sold",                                         title: "Untitled", year: "2025", medium: "Oil and ink on canvas", dimensions: '16" x 20"' },
    { file: "2025-02.jpg", status: "sold",                                         cover: true, title: "Untitled", year: "2025", medium: "Oil and ink on canvas", dimensions: '16" x 20"' },
    { file: "2025-03.jpg", status: "sold",                                         title: "Untitled", year: "2025", medium: "Oil and ink on canvas", dimensions: '16" x 20"' },
    { file: "2025-05.jpg", status: "sold",                                         title: "Untitled", year: "2025", medium: "Scratchboard", dimensions: '8.5" x 11"' },
    { file: "2025-07.jpg", status: "sold",                                         title: "Untitled", year: "2025", medium: "Scratchboard", dimensions: '8.5" x 11"' },
    { file: "2025-06.jpg", status: "sold",                                         title: "Untitled", year: "2025", medium: "Scratchboard", dimensions: '8.5" x 11"' },
    { file: "2025-08.jpg",                                         title: "Untitled", year: "2025", medium: "Ink/Oil on Wood", dimensions: '8" x 10"' },
    { file: "2025-09.jpg",                                         title: "Untitled", year: "2025", medium: "Ink/Oil on Wood", dimensions: '8" x 10"' },
    { file: "2025-sketch-13.jpg",                                         title: "Sketch #13", year: "2025", medium: "Ink on paper", dimensions: '5.5" x 8.5"' },
    { file: "2025-sketch-9.jpg",                                         title: "Sketch #9", year: "2025", medium: "Ink on paper", dimensions: '5.5" x 8.5"' },
    { file: "2025-sketch-10.jpg",                                         title: "Sketch #10", year: "2025", medium: "Ink on paper", dimensions: '5.5" x 8.5"' },
    { file: "2025-sketch-11.jpg",                                         title: "Sketch #11", year: "2025", medium: "Ink on paper", dimensions: '5.5" x 8.5"' },
    { file: "2025-sketch-12.jpg",                                         title: "Sketch #12", year: "2025", medium: "Ink on paper", dimensions: '5.5" x 8.5"' },
    { file: "2025-sketch-15.jpg",                                         title: "Sketch #15", year: "2025", medium: "Ink on paper", dimensions: '5.5" x 8.5"' },
    { file: "2025-sketch-14.jpg",                                         title: "Sketch #14", year: "2025", medium: "Ink on paper", dimensions: '5.5" x 8.5"' },
    // 2024 — Sketch #1–#8, ink on paper, 5.5" x 8.5"
    { file: "2024-sketch-3.jpg", title: "Sketch #3", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    { file: "2024-sketch-4.jpg", title: "Sketch #4", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    { file: "2024-sketch-1.jpg", title: "Sketch #1", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    { file: "2024-sketch-2.jpg", title: "Sketch #2", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    { file: "2024-sketch-5.jpg", title: "Sketch #5", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    { file: "2024-sketch-7.jpg", title: "Sketch #7", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    { file: "2024-sketch-8.jpg", title: "Sketch #8", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    { file: "2024-sketch-6.jpg", cover: true, title: "Sketch #6", year: "2024", medium: "Ink on paper",           dimensions: '5.5" x 8.5"' },
    // 2022 (media are my best guess; titles to confirm)
    { images: ["2022-generative-good-1.jpg", "2022-generative-good-2.jpg", "2022-generative-good-3.jpg", "2022-generative-good-4.jpg", "2022-generative-good-5.jpg"], cover: true, title: "Untitled", year: "2022", medium: "Generative digital art, printed", dimensions: "" },
    { file: "2022-rings.jpg", title: "Untitled", year: "2022", medium: "3D-printed rings", dimensions: "" },
    // 2021 (media are my best guess; titles to confirm)
    { file: "2021-01-purple-station.jpg", title: "Untitled", year: "2021", medium: "Oil on canvas", dimensions: "" },
    { file: "2021-02-colored-pencil-interior.jpg", title: "Untitled", year: "2021", medium: "Colored pencil on paper", dimensions: "" },
    { file: "2021-03-map-installation.jpg", cover: true, title: "Untitled", year: "2021", medium: "Ink on paper over printed maps", dimensions: "" },
    // 2020 — digital art (file names temporary until titles arrive)
    { file: "2020-02-neon-on-black.jpg", title: "Untitled", year: "2020", medium: "Digital Art", dimensions: "" },
    { file: "2020-06-glitch.jpg", title: "Untitled", year: "2020", medium: "Digital Art", dimensions: "" },
    { file: "2020-05-wooden-box.jpg", title: "Untitled", year: "2020", medium: "Digital Art", dimensions: "" },
    { file: "2020-07-lilac-map.jpg", title: "Untitled", year: "2020", medium: "Digital Art", dimensions: "" },
    { file: "2020-04-grid-islands.jpg", title: "Untitled", year: "2020", medium: "Digital Art", dimensions: "" },
    { file: "2020-03-pastel-on-blue.jpg", title: "Untitled", year: "2020", medium: "Digital Art", dimensions: "" },
    { file: "2020-digital-01.jpg", cover: true, title: "Untitled", year: "2020", medium: "Digital Art", dimensions: "" },
    { file: "2020-09-pencil-faces.jpg", title: "Untitled", year: "2020", medium: "Pencil on paper", dimensions: "" },
    { file: "2020-08-pencil-balloons.jpg", title: "Untitled", year: "2020", medium: "Pencil on paper", dimensions: "" },
    { file: "2020-pencil-01.jpg", title: "Untitled", year: "2020", medium: "Pencil on paper", dimensions: "" },
    // 2019 — digital art (file names temporary until titles arrive)
    { file: "2019-01-pink.jpg", cover: true, title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-10-red-yellow-gradient.jpg", title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-07-red-blue-grid.jpg", title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-06-orange-green.jpg", title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-02-yellow-violet.jpg", title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-08-pastel-yellow.jpg", title: "Wings", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-09-pastel-blur.jpg", title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-04-turquoise.jpg", title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-03-blue.jpg", title: "Untitled", year: "2019", medium: "Digital Art", dimensions: "" },
    { file: "2019-05-pencil-sketch.jpg", title: "Untitled", year: "2019", medium: "Pencil on paper", dimensions: "" },
  ],

  bio: {
    short: "Joel Pang is a visual artist working primarily in oil and ink on canvas, wood, and paper, exploring color, texture, and the space between abstraction and form.",
    paragraphs: [
      "Joel Pang is a visual artist based in Madison, WI, originally from New York City. Working primarily in oil and ink on canvas, wood, and paper, Joel's practice moves between abstraction and quiet representation, drawn to the way color and texture can hold a feeling before it becomes a subject.",
      "Joel's work has been shown in juried and regional exhibitions, including Art on the Kinni (AOK) in River Falls, WI and the Greenwich Village Art Fair.",
      "Joel studied at Cornell University, earning a B.A. in Information Science with a Minor in Fine Arts, and currently works out of a studio in Madison, WI. Commissions and studio visits are welcome by request."
    ],
    statement: "My work begins with color and material rather than image. I'm interested in the moment a surface stops being paint and starts being a place — where a viewer can locate their own memory or mood inside something that never depicted anything in particular. Each piece is built slowly, in layers, until it holds still enough to be looked at twice.",

    education: [
      { school: "Cornell University", detail: "B.A. in Information Science, Minor in Fine Arts", date: "May 2025" },
      { school: "DIS Study Abroad — Copenhagen, Denmark", detail: "Scandinavia program", date: "Fall 2024" }
    ],

    tools: ["Procreate", "Photoshop", "Illustrator", "Blender", "Figma"]
  },

  accomplishments: {
    exhibitions: [
      { year: "2026", title: "78th Annual Greenwich Village Art Fair", place: "Rockford, IL — September 19–20, 2026" },
      { year: "2026", title: "Art on the Kinni (AOK)", place: "River Falls, WI — September 12, 2026" },
      { year: "2025", title: "Epic Art Fair", place: "Verona, WI — December 5, 2025" }
    ],
    awards: [
      { year: "2026", title: "2nd Place", org: "Art on the Kinni (AOK), River Falls, WI" },
      { year: "2018", title: "Award Recipient", org: "Scholastic Art & Writing Awards" },
      { year: "2017", title: "Steven Steigman Fund Scholarship", org: "National Academy Museum & School" }
    ],
    press: [],
    collections: []
  }
};

// High-resolution copies in images/hd/, used only by the magnifier (loupe) when someone hovers a piece.
// Generated from the original photos; a piece without one zooms its normal image.
SITE.hd = [
  "2021-02-colored-pencil-interior.jpg",
  "2022-generative-good-1.jpg",
  "2022-rings.jpg",
  "2024-sketch-1.jpg",
  "2024-sketch-2.jpg",
  "2024-sketch-3.jpg",
  "2024-sketch-4.jpg",
  "2024-sketch-5.jpg",
  "2024-sketch-6.jpg",
  "2024-sketch-7.jpg",
  "2024-sketch-8.jpg",
  "2025-01.jpg",
  "2025-02.jpg",
  "2025-03.jpg",
  "2025-04.jpg",
  "2025-05.jpg",
  "2025-06.jpg",
  "2025-07.jpg",
  "2025-08.jpg",
  "2025-09.jpg",
  "2025-restoration.jpg",
  "2025-surveillance-1.jpg",
  "2025-surveillance-2.jpg",
  "2025-sketch-10.jpg",
  "2025-sketch-11.jpg",
  "2025-sketch-12.jpg",
  "2025-sketch-13.jpg",
  "2025-sketch-14.jpg",
  "2025-sketch-15.jpg",
  "2025-sketch-9.jpg",
  "2026-01-1.jpg",
  "2026-01-3.jpg",
  "2026-03-1.jpg",
  "2026-04-1.jpg",
  "2026-05-1.jpg",
  "2026-06-1.jpg",
  "2026-07-1.jpg",
  "2026-08-1.jpg",
  "2026-09-1.jpg",
  "2026-10-1.jpg",
  "2026-11-1.jpg",
  "2026-12-1.jpg",
  "2026-13-1.jpg",
  "2026-14-1.jpg",
  "2026-15-1.jpg",
  "2026-16-1.jpg",
  "2026-17-1.jpg",
  "2026-18-1.jpg",
  "2026-19-1.jpg",
  "2026-20-1.jpg",
  "2026-21-1.jpg",
  "2026-22-1.jpg",
  "2026-23-1.jpg",
  "2026-24-1.jpg",
  "2026-25-1.jpg",
  "2026-26-1.jpg",
  "2026-27-1.jpg",
  "2026-28-1.jpg",
  "2026-28-3.jpg",
  "2026-29-1.jpg",
  "2026-29-3.jpg",
  "2026-30-1.jpg",
  "2026-familiar-warrior-1.jpg",
  "2026-familiar-warrior-2.jpg",
  "2026-jukebox-1.jpg",
  "2026-signal-passing.jpg",
];
