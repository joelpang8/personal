# joelpang.com

Portfolio site for Joel Pang: oil and ink on canvas, wood, and paper.
Plain HTML, CSS and JavaScript. There is no build step, so hosting just serves these files as they are.

## Where things are

- `content.js` holds everything you will normally edit: the artwork list (title, year, medium, size, sold), the homepage pieces, bio, education, exhibitions, awards, email and Instagram.
- `images/` holds the artwork photos. `images/hd/` holds high-resolution copies used only by the magnifier.
- `index.html` is the homepage. `about.html`, `accomplishments.html` and `contact.html` are the other pages.
- `2019/` to `2026/` each hold one year page. They fill themselves in from `content.js`.
- `style.css` is the look, `script.js` the galleries, lightbox, Inquire links and magnifier, `hero.js` the homepage opening, and `pages.js` the About, Accomplishments and Contact effects.
- `favicon.ico`, `favicon-64.png`, `icon-192.png`, `apple-touch-icon.png` and `images/og-image.jpg` are the tab icon and the link-preview image.

## Common edits (in `content.js`)

- Rename a piece: change `title: "Untitled"` to the new name.
- Mark a piece sold: add `status: "sold",` to its line.
- Add a piece: put the photo in `images/`, copy an existing line, and change the file name and details.
- Every line in the artwork list needs its quotes and the comma at the end. Sizes use single quotes on the outside, like `'16" x 20"'`.

## Hosting

Netlify, connected to this repository: no build command, publish directory `.` (the top level).
Every change saved here goes live in about a minute. If something breaks, open Deploys in Netlify and publish an earlier version.
