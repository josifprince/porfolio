# Awe Joseph Mofifoluwa — Portfolio

A static portfolio built with semantic HTML, CSS, and vanilla JavaScript. No installation or build step is required.

## Preview locally

Open `index.html` in a browser, or use VS Code's Live Server extension to serve the project folder. Internet access is needed for Google Fonts; system sans-serif fonts are available as a fallback.

## Files

- `index.html`: profile, product case studies, experience, skills, communication, education, and contact.
- `css/style.css`: responsive layout, colors, typography, and keyboard focus styles.
- `js/main.js`: accessible mobile navigation and section highlighting.
- `images/awejoseph.webp`: profile portrait.
- `images/favicon.svg`: site icon.

Project cards display authentic screenshots of the public BillChamp, CodeChamp, FreeMeet, WeCare Club Global, and Oghas Academy homepages. Screenshots are captured at 1440 x 1000 and stored as optimized JPEGs in `images/screenshots/`. They depict the public landing pages, including any interface previews shown by those sites. Previously generated illustrations are retained in `images/` but are not displayed. Profile details and product metrics follow the owner's supplied brief.

## Validation

Run `node --check js/main.js` and `git diff --check`. There are no package-managed build, lint, or test commands in this project.

Content, section anchors, local assets, external-link attributes, mobile menu behavior, and active navigation were checked. Headless browser rendering could not complete in the environment; preview desktop and mobile layouts in a browser before publishing.

No deployment is configured. Once the portfolio's public URL is confirmed, absolute social preview image and canonical URL metadata can be added.
