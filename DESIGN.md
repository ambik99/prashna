---
name: Prashna
description: Question papers for CBSE teachers. The app is set like the printed Paper it makes; the Landing Page follows a separate product-site system (see "Landing Page").
colors:
  ink-navy: "#1e2a4a"
  ink-navy-hover: "#2b3a63"
  ink-wash: "#e6e9f1"
  ink-wash-hover: "#d8ddea"
  on-ink: "#ffffff"
  focus-blue: "#2f4a8a"
  warm-paper: "#f6f4ef"
  sheet-white: "#ffffff"
  oat: "#f1eee7"
  hairline: "#e3dfd5"
  rule-taupe: "#8c8576"
  ink-text: "#1b2030"
  slate-muted: "#4b5262"
  slate-subtle: "#5f6676"
  danger-red: "#b42318"
  danger-wash: "#fbe9e7"
  success-green: "#1d6b38"
  success-wash: "#e5f2e8"
  warning-ochre: "#7a4f00"
  warning-wash: "#f8eed6"
  paper-black: "#000000"
typography:
  display:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.75rem, 7.2vw, 5.75rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 4.4vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  subline:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.0625rem, 1.6vw, 1.25rem)"
    fontWeight: 400
  body:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-app:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.25
  paper-body:
    fontFamily: "Newsreader, 'Noto Sans Devanagari', 'Noto Sans Bengali', Georgia, 'Times New Roman', serif"
    fontSize: "11pt"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "lnum"
  paper-marks:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "11pt"
    fontWeight: 700
    fontFeature: "tnum"
rounded:
  sheet: "2px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  gutter: "clamp(1rem, 4vw, 3rem)"
  section-gap: "clamp(4.5rem, 10vw, 8.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 1.75rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.ink-navy-hover}"
  button-primary-small:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.125rem"
    height: "40px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.pill}"
    padding: "0 1.75rem"
    height: "52px"
  button-outline-hover:
    backgroundColor: "{colors.ink-wash}"
  button-app:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.ink-text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-danger:
    backgroundColor: "{colors.danger-red}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  input-field:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.ink-text}"
    typography: "{typography.body-app}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  marks-chip:
    backgroundColor: "{colors.oat}"
    textColor: "{colors.ink-text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.25rem 0.75rem"
  app-panel:
    backgroundColor: "{colors.sheet-white}"
    rounded: "{rounded.lg}"
---

# Design System: Prashna

## Overview

**Creative North Star: "The Printed Paper"**

Prashna's app is set like the thing it makes. Its product is a printed CBSE question Paper, so the interface borrows that Paper's grammar: Newsreader serif headings over ruled lines, italic sublines beneath them, marks in square brackets, white A4 sheets lying on a warm off-white desk. Everything around the sheet is quiet, so the sheet reads as the real object.

The system has one accent, an ink navy taken from a fountain pen and the app icon, used for the single primary action and selection. The rest is warm neutrals: an off-white ground, white surfaces, hairline borders, slate text. The app is a compact working tool (0.875rem Inter body, 14px-cornered panels).

The Landing Page is the one exception to this system. The maker chose to model it on Resurf (resurf.so): near-black ink on a cool #f8f8f8 ground, light-weight serif headings, 16px tinted cards and blur-in motion. It keeps Prashna's fonts, icon, screenshots and the shared Get the App guide. See "Landing Page" below; everything else in this file describes the app.

Light and dark mode both follow the device. In dark mode the page and panels go dark and the ink navy inverts to a pale periwinkle, but anything that represents paper (the Paper preview, screenshots of the Paper) stays white, because paper is white.

**Key Characteristics:**
- Serif (Newsreader) for anything that would appear on the printed Paper or names a section; Inter for everything you operate.
- One ink-navy accent; red appears only for errors and destructive actions.
- White sheets with a soft, diffuse paper shadow; no hard edges, no offset shadows.
- Pills for actions you take, small squared chips for counts you read.
- One exponential ease-out (cubic-bezier(0.23, 1, 0.32, 1)) for every transition.

## Colors

Warm paper neutrals carrying a single ink-navy accent, with semantic status colours held back for status alone.

### Primary
- **Ink Navy** (`ink-navy`): the one accent. Primary actions (Print, Add, the Get the App guide's Got it), the selected state of toggles and text selection. Hover deepens toward **Ink Navy Hover** (`ink-navy-hover`). In dark mode the accent becomes a pale periwinkle (#a9bbea, hover #c0cdf0) and text on it turns dark (#111318).
- **Ink Wash** (`ink-wash`): the accent at its quietest. Soft toggle backgrounds, the marks-total chip, the hover fill of the outlined pill. Dark mode: #232c44.
- **Focus Blue** (`focus-blue`): the 2px keyboard focus outline everywhere. Dark mode: #a9bbea.

### Neutral
- **Warm Paper** (`warm-paper`): the page ground, the desk the sheets lie on. Dark mode: #111318.
- **Sheet White** (`sheet-white`): panels, dialogs, inputs and every paper sheet. Dark mode panels: #191c23; paper sheets stay white.
- **Oat** (`oat`): muted surfaces inside panels (notes boxes, chips, icon buttons). Dark mode: #20242d.
- **Hairline** (`hairline`): 1px borders around panels and between list rows. Dark mode: #2c313c.
- **Rule Taupe** (`rule-taupe`): stronger strokes: input borders and outlined buttons. Dark mode: #6b7385.
- **Ink Text** (`ink-text`): body text. Dark mode: #eceef2.
- **Slate Muted** (`slate-muted`) and **Slate Subtle** (`slate-subtle`): secondary copy, captions and placeholders.
- **Paper Black** (`paper-black`): the printed Paper's text and rules. The Paper uses literal print colours (#000000, grey #9ca3af rules, #374151 sublines) because Word ignores CSS variables.

### Status
- **Danger Red** (`danger-red`) with **Danger Wash** (`danger-wash`): errors, over-target marks, destructive confirmation buttons. Nothing else.
- **Success Green** (`success-green`) with **Success Wash** (`success-wash`): saved status, marks on target, add-to-Bank.
- **Warning Ochre** (`warning-ochre`) with **Warning Wash** (`warning-wash`, border #ecd9a6): marks under target.

### Named Rules
**The One Ink Rule.** Ink navy is the only accent in the app. It marks the single primary action in a view and the selected state. If a second element wants to be navy, it should be an outline or a wash instead.

**The Red Means Wrong Rule.** Red is reserved for errors and destructive actions. Never use it for emphasis, decoration, or brand.

**The Paper Stays White Rule.** Anything standing for the printed Paper keeps a white ground and black text in both modes (the preview carries the light theme regardless of device mode).

## Typography

**Display Font:** Newsreader (with Georgia, Times New Roman), self-hosted roman and italic, variable 200 to 800.
**Body Font:** Inter (with system-ui, Segoe UI, Roboto), self-hosted, variable 100 to 900.
**Paper Font:** Newsreader with Noto Sans Devanagari and Noto Sans Bengali, so Hindi and Bengali Questions set in the same line.

**Character:** A bookish, slightly literary serif for everything that belongs to the Paper or names a part of the page, paired with a neutral, legible sans for controls and running copy. The serif carries the authority of print; the sans stays out of the way.

### Hierarchy
- **Title** (600, 1.375rem, 1.25, -0.01em): the app's wordmark and header. App step headings and dialog titles use the same face at 1.0625rem.
- **Body (app)** (Inter 400, 0.875rem, 1.5): the working interface.
- **Label** (Inter 600, 0.75rem to 0.8125rem, 1.25): buttons, chips, field labels, status.
- **Paper body** (Newsreader 11pt, 1.5, lining numerals): the printed Paper. Header school name 15pt bold uppercase with 0.04em tracking; Section titles 11.5pt bold uppercase 0.08em, centred over a 0.75pt rule; marks right-aligned in bold tabular figures.

### Named Rules
**The Serif Is Print Rule.** Newsreader is for what reads as print: headings, marks, the Paper itself. Inter is for what you operate or skim: buttons, fields, chips, body copy.

## Layout

The app is a 1120px working layout: a 380px editor column beside the live A4 preview, 1.5rem apart, on a 1.5rem page padding, collapsing to a bottom tab bar (Edit, Preview, Bank) on phones. Spacing comes from a 4px-based scale (0.25rem to 2rem).

## Elevation & Depth

Depth is paper on a desk: surfaces are mostly flat and bordered, and shadows are soft, diffuse and low-contrast, tinted with ink rather than pure black in light mode. Panels sit on hairline borders with a whisper of shadow; dialogs and menus float higher; paper sheets and screenshots carry a two-layer sheet shadow that reads as a page lifting slightly off the desk.

### Shadow Vocabulary
- **Whisper** (`box-shadow: 0 1px 2px rgba(27, 32, 48, 0.05)`): the app's summary bar.
- **Panel** (`box-shadow: 0 4px 16px rgba(27, 32, 48, 0.06)`): app editor and preview panels.
- **Float** (`box-shadow: 0 20px 48px rgba(27, 32, 48, 0.18)`): menus, dialogs, the Get the App guide.
Dark mode swaps each for a black-based equivalent.

### Named Rules
**The Soft Paper Rule.** Shadows are diffuse and ink-tinted. No hard offset shadows, no coloured glows.

## Shapes

Gently rounded, never bubbly. Panels and dialogs use a 14px corner; inputs, selects and ordinary app buttons 10px; small chips and icon buttons 6px. A4 sheets are nearly square-cornered (2px), as paper is. Actions that move the teacher forward are full pills (999px). The app icon is a rounded square. Strokes are thin: 1px hairlines and borders. On phones, dialogs and the Get the App guide rise from the bottom with only their top corners rounded.

## Components

### Buttons
Confident and few.
- **Shape:** full pill (999px) for Print and the guide's Got it; 10px corners for ordinary app buttons.
- **Primary:** ink navy with white semibold text.
- **Hover / Focus / Active:** hover deepens to ink navy hover over 160ms; every button scales to 0.97 on press; keyboard focus is a 2px focus-blue outline offset 2px to 3px. Hover styles apply only on hover-capable devices.
- **App secondary:** white with a rule-taupe border (Reset), ink-wash toggle that turns solid navy when active, oat icon buttons at 6px.
- **Danger:** solid red, only to confirm destruction.

### Chips
- **Style:** the app's marks counters. Oat ground, hairline border, 6px corners, semibold tabular figures.
- **State:** the total is ink wash; target met is success wash; under target is warning wash with an ochre border; over target is danger wash.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** sheet white (dark #191c23) on warm paper.
- **Shadow Strategy:** Panel or Whisper (see Elevation).
- **Border:** 1px hairline.
- **Internal Padding:** 0.75rem to 1.25rem.
### Inputs / Fields
- **Style:** white ground, 1px rule-taupe border, 10px corners, 0.5rem by 0.75rem padding, 0.875rem Inter.
- **Focus:** border shifts to focus blue with the focus outline flush (offset 0).
- **Placeholder:** slate subtle.

### Navigation
- **App:** a compact header with the serif wordmark, a thin divider, the Paper title, and a "More" menu that floats at 14px with the Float shadow. On phones, a bottom tab bar.

### Get the App Guide
Shared by the app and the Landing Page (app/get-app.css). A dialog: 400px, 14px corners, Float shadow, serif title, numbered steps each with a small picture of the button to look for, and a pill Done button. On screens up to 880px it rises from the bottom as a sheet with thumb-height actions (48px).

### Theme Toggle
Shared by the app and the Landing Page (app/theme-toggle.css, app/theme.js). The "Classic" toggle from Theme Toggles by Alfie Jones (toggles.dev, MIT), with its styles and animation unchanged: a sun whose rays fold away as a crescent cuts in to make a moon (500ms, cubic-bezier(0, 0, 0.15, 1.25)), and the reverse. A 40px round button in the text colour, beside Get the App on the Landing Page and at the start of the app's top-bar actions. The page follows the device's light or dark setting until a theme is chosen; the choice is remembered for both pages. Under reduced motion it switches without animating.

### Update Notice
The app only (app/update-notice.css). A pill bar centred at the bottom of the screen with the Float shadow: "New version available", a quiet Later button and a pill accent Refresh button. It rises 8px into place with the ease-out, sits above the phone tab bar with 44px buttons, and never covers the app or reloads it by itself.

### Paper Sheet
The app's live A4 preview: a white sheet with literal print colours that stays white in dark mode.

## Do's and Don'ts

### Do:
- **Do** draw every colour, size, radius and shadow in the app from tokens.css.
- **Do** keep one ink-navy primary action in a view, and label the install action "Get the App" everywhere, never "Download".
- **Do** use the single ease-out (cubic-bezier(0.23, 1, 0.32, 1)) for transitions, press feedback at scale 0.97, and a still state under reduced motion.
- **Do** set marks and counts in brackets or tabular figures, as the Paper does.

### Don't:
- **Don't** introduce a second accent colour or use red for anything but errors and destruction.
- **Don't** darken or tint the Paper or its screenshots in dark mode.
- **Don't** use hard offset shadows or coloured glows.

## Landing Page

The maker chose to model the Landing Page (www/index.html, www/landing.css, www/landing.js) on Resurf's product site, with Prashna's own content. Its values live in landing.css, separate from tokens.css.

- **Colour:** near-black ink (oklch 0.2) on a cool #f8f8f8 ground; secondary text oklch 0.55; surfaces are the ink at 3% to 8% opacity rather than solid fills. Dark mode turns to light ink on #111214 with white-at-4% to 11% surfaces. The only colour comes from the screenshots and the pastel swirl behind them; screenshots and the small Paper sheets stay white.
- **Type:** Newsreader at weight 300 for headings (hero 45px, sections 40px, tracking -0.025em to -0.035em); Inter 500 for card titles (16px) and 400 for copy (14px to 16px).
- **Shape:** 8px buttons, 16px cards, 12px marquee tiles, full pills for small chips and the hero badge.
- **Layout:** a centred 960px column: hero; product tour (the four How it works steps, with arrows, Pause and thumbnails); a three-column grid of twelve feature cards with small drawn illustrations; two large cards over the swirl; a two-row marquee of subjects and classes; a tinted panel with the privacy promise and laptop and phone frames; the maker's quote and three FAQ cards; a closing call to action; a four-column footer.
- **Launch animation:** on the first visit in a browser session, a layer in the page colour covers the page for about 1.6s: the 72px Prashna icon blurs, fades and rises in (0.6s ease-out), then "Created by" in small muted Inter over "Ambik Mojumder" in 22px light Newsreader follows 0.35s later. At 1.2s the layer fades out (0.4s ease-out) as the hero's reveals begin. A tap, click or key press skips it. It is the only place the maker's credit appears. It never plays under reduced motion, without JavaScript, or when session storage is unavailable, and screen readers skip it.
- **Motion:** sections blur, fade and rise in once as they scroll into view (0.6s ease-out, 10px blur, 10px rise). The hero's grey second line changes every 3.2s (in 0.6s ease-out, out 0.4s ease-in). The tour advances every 5s and crossfades with a 6px blur over 0.3s. The marquee drifts over 38s and pauses on hover. Under reduced motion everything shows still and nothing advances on its own.
- **Primary action:** "Get the App" in a near-black 8px button, 40px tall, beside a tinted "Try it in your browser".
