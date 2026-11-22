---
version: 1
slug: "www-index-html"
primary_target: "www/index.html"
related_targets: []
---

# Landing Page

Scope: `www/index.html`, the public page at the site root. Visitor mode: Persuade.

Audience and job: a CBSE teacher who heard about Prashna, often on a phone and a slow connection. They must understand in seconds what it makes (a printed CBSE Paper and its Marking Scheme), trust it (free, offline, private, made by a teacher), and act: **Get the App** or **Try it in your browser**.

Proof: real screenshots of the app (Board Pattern Starter, fictional school), the printed Paper itself. No invented claims, counts or testimonials. Maker's details are marked placeholders until #20.

Constraints: section order, hero copy and FAQ topics pinned by issue #18. Reuses `app/get-app.js`, `app/tokens.css`, `app/fonts.css`. No build step, light page weight, light and dark mode, no sideways scroll on phones.

## Direction contract

THESIS: The page is set like the thing it makes. Prashna's offer is a printed CBSE Paper, so the page borrows the Paper's own grammar (Section rules, ruled headers, marks in brackets, the Newsreader type of the printed sheet) and refuses the SaaS template of centred hero, logo strip and icon cards.

OWN-WORLD: Warm off-white page (app `--color-bg`), white A4 sheets with soft paper shadow, ink-navy text and one ink-navy pill. Newsreader for headlines and Paper-set lists, Inter for interface text. Thin double rules like a Paper header. One drenched ink-navy band for the privacy promise. Dark mode: the page goes dark, the Paper sheets stay white.

STORY: Teacher sees the promise and the real app at once, learns the four things it does, sees the four steps, sees it on a phone, reads the privacy promise, meets the maker, gets answers, acts.

FIRST VIEWPORT: Slim top bar (प्र icon, Prashna wordmark, Try it link, Get the App pill). Left-aligned headline at display size across about 60% width, "minutes" in italic. Byline line and subtext beneath, the two actions under them. The real desktop screenshot starts inside the first viewport, wide, its top edge visible above the fold, with the printed A4 sheet tucked behind its right edge.

FORM: Brief-pinned direction (Resurf principles, issue #18), rendered in the printed Paper's own grammar; first on my list. seed:67993e6ec6d4ad49 (surface roll recorded after the build; the brief-pinned direction and section order from issue #18 override its dealt structures). Signature interaction: as the hero screenshot scrolls up, the printed A4 sheet slides out from behind the app window, like a page leaving the printer. Motion grammar: one exponential ease-out, scroll-linked, visible by default, still under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
