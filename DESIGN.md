---
name: Prashna
description: Question papers for CBSE teachers, set like the printed Paper they make.
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
  band-text: "#f6f4ef"
  band-muted: "#c9cfde"
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
  privacy-band:
    backgroundColor: "{colors.ink-navy}"
    textColor: "{colors.band-text}"
    padding: "clamp(4rem, 9vw, 7.5rem) clamp(1rem, 4vw, 3rem)"
---

# Design System: Prashna

## Overview

**Creative North Star: "The Printed Paper"**

Prashna is set like the thing it makes. Its product is a printed CBSE question Paper, so the interface and the Landing Page borrow that Paper's grammar: Newsreader serif headings over ruled lines, italic sublines beneath them, marks in square brackets, white A4 sheets lying on a warm off-white desk. Everything around the sheet is quiet, so the sheet reads as the real object.

The system has one accent, an ink navy taken from a fountain pen and the app icon, used for the single primary action, selection, and one drenched band per page. The rest is warm neutrals: an off-white ground, white surfaces, hairline borders, slate text. Density follows the surface: the app is a compact working tool (0.875rem Inter body, 14px-cornered panels); the Landing Page is generous and editorial (1rem body at 1.6 leading, sections 4.5rem to 8.5rem apart, display serif up to 5.75rem).

Light and dark mode both follow the device. In dark mode the page and panels go dark and the ink navy inverts to a pale periwinkle, but anything that represents paper (the Paper preview, screenshots of the Paper) stays white, because paper is white.

**Key Characteristics:**
- Serif (Newsreader) for anything that would appear on the printed Paper or names a section; Inter for everything you operate.
- One ink-navy accent; red appears only for errors and destructive actions.
- Thin double rules (3px double) under section heads, the way a Paper header is ruled.
- White sheets with a soft, diffuse paper shadow; no hard edges, no offset shadows.
- Pills for actions you take, small squared chips for counts you read.
- One exponential ease-out (cubic-bezier(0.23, 1, 0.32, 1)) for every transition.

## Colors

Warm paper neutrals carrying a single ink-navy accent, with semantic status colours held back for status alone.

### Primary
- **Ink Navy** (`ink-navy`): the one accent. Primary actions (Get the App, Print, Add), the selected state of toggles, text selection, and the drenched privacy band. Hover deepens toward **Ink Navy Hover** (`ink-navy-hover`). In dark mode the accent becomes a pale periwinkle (#a9bbea, hover #c0cdf0) and text on it turns dark (#111318).
- **Ink Wash** (`ink-wash`): the accent at its quietest. Soft toggle backgrounds, the marks-total chip, the hover fill of the outlined pill. Dark mode: #232c44.
- **Focus Blue** (`focus-blue`): the 2px keyboard focus outline everywhere. Dark mode: #a9bbea.

### Neutral
- **Warm Paper** (`warm-paper`): the page ground, the desk the sheets lie on. Dark mode: #111318.
- **Sheet White** (`sheet-white`): panels, dialogs, inputs and every paper sheet. Dark mode panels: #191c23; paper sheets stay white.
- **Oat** (`oat`): muted surfaces inside panels (notes boxes, chips, icon buttons). Dark mode: #20242d.
- **Hairline** (`hairline`): 1px borders around panels and between list rows. Dark mode: #2c313c.
- **Rule Taupe** (`rule-taupe`): stronger strokes: input borders, outlined pills, the rule above each How-it-works step. Dark mode: #6b7385.
- **Ink Text** (`ink-text`): body text and the double section rules. Dark mode: #eceef2.
- **Slate Muted** (`slate-muted`) and **Slate Subtle** (`slate-subtle`): secondary copy, sublines, captions, placeholders, large step numerals.
- **Band Text** (`band-text`) and **Band Muted** (`band-muted`): text on the ink-navy band. The band itself stays ink navy in dark mode (#1b2440), it does not invert with the accent.
- **Paper Black** (`paper-black`): the printed Paper's text and rules. The Paper uses literal print colours (#000000, grey #9ca3af rules, #374151 sublines) because Word ignores CSS variables.

### Status
- **Danger Red** (`danger-red`) with **Danger Wash** (`danger-wash`): errors, over-target marks, destructive confirmation buttons. Nothing else.
- **Success Green** (`success-green`) with **Success Wash** (`success-wash`): saved status, marks on target, add-to-Bank.
- **Warning Ochre** (`warning-ochre`) with **Warning Wash** (`warning-wash`, border #ecd9a6): marks under target.

### Named Rules
**The One Ink Rule.** Ink navy is the only accent. It marks the single primary action in a view, the selected state, and at most one drenched band per page. If a second element wants to be navy, it should be an outline or a wash instead.

**The Red Means Wrong Rule.** Red is reserved for errors and destructive actions. Never use it for emphasis, decoration, or brand.

**The Paper Stays White Rule.** Anything standing for the printed Paper keeps a white ground and black text in both modes (the preview carries the light theme regardless of device mode).

## Typography

**Display Font:** Newsreader (with Georgia, Times New Roman), self-hosted roman and italic, variable 200 to 800.
**Body Font:** Inter (with system-ui, Segoe UI, Roboto), self-hosted, variable 100 to 900.
**Paper Font:** Newsreader with Noto Sans Devanagari and Noto Sans Bengali, so Hindi and Bengali Questions set in the same line.

**Character:** A bookish, slightly literary serif for everything that belongs to the Paper or names a part of the page, paired with a neutral, legible sans for controls and running copy. The serif carries the authority of print; the sans stays out of the way.

### Hierarchy
- **Display** (500, clamp(2.75rem, 7.2vw, 5.75rem), line-height 1, -0.03em): the Landing Page hero and closing line. One word may be set in italic at weight 400 for emphasis.
- **Headline** (500, clamp(2rem, 4.4vw, 3.25rem), 1.08, -0.02em): section headings on the Landing Page. The privacy band's heading runs larger (up to 5rem) as the page's one loud moment.
- **Title** (600, 1.375rem, 1.25, -0.01em): feature and step headings on the Landing Page, the app's wordmark and header. App step headings and dialog titles use the same face at 1.0625rem.
- **Subline** (Newsreader italic 400, clamp(1.0625rem, 1.6vw, 1.25rem)): the line under a heading, like a Paper's Section subline. Slate muted.
- **Body** (Inter 400, 1rem, 1.6): Landing Page copy, held to about 34rem to 38rem measure.
- **Body (app)** (Inter 400, 0.875rem, 1.5): the working interface.
- **Label** (Inter 600, 0.75rem to 0.8125rem, 1.25): buttons, chips, field labels, status.
- **Paper body** (Newsreader 11pt, 1.5, lining numerals): the printed Paper. Header school name 15pt bold uppercase with 0.04em tracking; Section titles 11.5pt bold uppercase 0.08em, centred over a 0.75pt rule; marks right-aligned in bold tabular figures.

### Named Rules
**The Serif Is Print Rule.** Newsreader is for what reads as print: headings, sublines, marks, the Paper itself, FAQ questions. Inter is for what you operate or skim: buttons, fields, chips, body copy.

**The Italic Subline Rule.** Secondary lines under a heading are serif italic in slate muted, never a smaller sans line in caps.

## Layout

The Landing Page is a single left-aligned column inside a 1200px page with a fluid gutter (clamp(1rem, 4vw, 3rem)); sections are separated by a large fluid gap (clamp(4.5rem, 10vw, 8.5rem)) rather than by boxes. Headings and copy align to the left edge; nothing is centred except the printed Paper's own header. Grids are used only where the content is a list: features in two columns (one below 760px), steps in four (two below 900px, one below 480px, where the numeral moves beside the text), copy beside two phones (5fr / 6fr, stacked below 860px). The privacy band is the only full-bleed element. Phones get no sideways scroll (overflow-x clip).

The app is a 1120px working layout: a 380px editor column beside the live A4 preview, 1.5rem apart, on a 1.5rem page padding, collapsing to a bottom tab bar (Edit, Preview, Bank) on phones. Spacing comes from a 4px-based scale (0.25rem to 2rem).

**The Ruled Section Rule.** A section starts with a serif headline, an optional italic subline, and a 3px double rule in ink text beneath them, then 2rem to 3rem of space. The footer reuses the same double rule above it. List rows below are divided by 1px hairlines, not cards.

## Elevation & Depth

Depth is paper on a desk: surfaces are mostly flat and bordered, and shadows are soft, diffuse and low-contrast, tinted with ink rather than pure black in light mode. Panels sit on hairline borders with a whisper of shadow; dialogs and menus float higher; paper sheets and screenshots carry a two-layer sheet shadow that reads as a page lifting slightly off the desk.

### Shadow Vocabulary
- **Whisper** (`box-shadow: 0 1px 2px rgba(27, 32, 48, 0.05)`): the app's summary bar.
- **Panel** (`box-shadow: 0 4px 16px rgba(27, 32, 48, 0.06)`): app editor and preview panels.
- **Float** (`box-shadow: 0 20px 48px rgba(27, 32, 48, 0.18)`): menus, dialogs, the Get the App guide.
- **Sheet** (`box-shadow: 0 1px 2px rgba(27, 32, 48, 0.06), 0 18px 40px -12px rgba(27, 32, 48, 0.22)`): A4 sheets, app screenshots and phone frames on the Landing Page.

Dark mode swaps each for a black-based equivalent (for example the sheet shadow becomes 0 1px 2px rgba(0,0,0,0.4), 0 24px 48px -12px rgba(0,0,0,0.6)).

### Named Rules
**The Soft Paper Rule.** Shadows are diffuse and ink-tinted. No hard offset shadows, no coloured glows.

## Shapes

Gently rounded, never bubbly. Panels and dialogs use a 14px corner; inputs, selects and ordinary app buttons 10px; small chips and icon buttons 6px. A4 sheets are nearly square-cornered (2px), as paper is. Actions that move the teacher forward are full pills (999px). The app icon is a rounded square. Strokes are thin: 1px hairlines and borders, 1.5px chevrons drawn from two borders, and the 3px double rule. On phones, dialogs and the Get the App guide rise from the bottom with only their top corners rounded.

## Components

### Buttons
Confident and few.
- **Shape:** full pill (999px) for the primary action on the Landing Page and for Print and Done in the app; 10px corners for ordinary app buttons.
- **Primary:** ink navy with white semibold text; on the Landing Page 52px tall with 1.75rem side padding (40px and 1.125rem in the top bar).
- **Hover / Focus / Active:** hover deepens to ink navy hover over 160ms; every button scales to 0.97 on press; keyboard focus is a 2px focus-blue outline offset 2px to 3px. Hover styles apply only on hover-capable devices.
- **Outline:** transparent with a rule-taupe border and ink text, washing to ink wash on hover. Pairs with the primary as "Try it in your browser".
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
The Landing Page uses no cards: features and FAQ entries are rows divided by hairlines.

### Inputs / Fields
- **Style:** white ground, 1px rule-taupe border, 10px corners, 0.5rem by 0.75rem padding, 0.875rem Inter.
- **Focus:** border shifts to focus blue with the focus outline flush (offset 0).
- **Placeholder:** slate subtle.

### Navigation
- **Landing top bar:** the प्र icon and serif Prashna wordmark on the left; a quiet text link (slate muted, underlines on hover) and the small ink pill on the right. The text link hides below 640px.
- **App:** a compact header with the serif wordmark, a thin divider, the Paper title, and a "More" menu that floats at 14px with the Float shadow. On phones, a bottom tab bar.

### Get the App Guide
A shared dialog: 400px, 14px corners, Float shadow, serif title, numbered steps each with a small picture of the button to look for, and a pill Done button. On screens up to 880px it rises from the bottom as a sheet with thumb-height actions (48px).

### Marks Tag
Square-bracketed serif semibold text set flush right on the heading line ("[Answers]", "[A4 · PDF · Word]"), echoing how the printed Paper shows marks ("[2 Marks]" in bold tabular Newsreader). It wraps under the heading on narrow screens.

### Paper Sheet
White A4 sheet, 2px corners, Sheet shadow. On the Landing Page the printed Paper tucks behind the app screenshot, tilted 2.5 degrees, and slides out as the page scrolls (scroll-linked, ease-out over the first 55vh), like a page leaving the printer. Without scroll timelines or with reduced motion it simply rests in its final place.

### Step Numeral
A large Newsreader italic numeral (up to 4.5rem, slate subtle, lining figures) above each How-it-works step, which sits on a 1px rule-taupe top border.

### FAQ Row
A native disclosure: serif question at up to 1.5rem, a thin chevron drawn from two 1.5px borders that turns on open (200ms ease-out), hairline divider below, slate-muted answer.

## Do's and Don'ts

### Do:
- **Do** draw every colour, size, radius and shadow from tokens.css; the Landing Page adds only its layout values, the sheet shadow and the band colours in landing.css.
- **Do** start each section with a serif headline, an optional italic subline, and a 3px double rule in ink text.
- **Do** keep one ink-navy pill as the primary action in a view, with "Get the App" as its label wherever the app is offered.
- **Do** show real captures of the app and the printed Paper, on white with the Sheet shadow, in both modes.
- **Do** use the single ease-out (cubic-bezier(0.23, 1, 0.32, 1)) for transitions, press feedback at scale 0.97, and a still state under reduced motion.
- **Do** set marks and counts in brackets or tabular figures, as the Paper does.

### Don't:
- **Don't** introduce a second accent colour or use red for anything but errors and destruction.
- **Don't** darken or tint the Paper or its screenshots in dark mode.
- **Don't** wrap Landing Page features in cards or icon tiles; they are rows divided by hairlines.
- **Don't** put small uppercase tracked labels above headings; the italic subline goes below.
- **Don't** use hard offset shadows or coloured glows.
