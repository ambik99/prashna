# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

CBSE school teachers in India who set their own question papers: unit tests, half-yearly and pre-board examinations. Today they format Papers by hand in a word processor, usually in the evening after school. Many work on a phone or a shared school computer, often on a slow or patchy mobile connection.

## Product Purpose

Prashna lets a teacher design a CBSE question Paper section by section, see it as the printed A4 page while they work, produce its Marking Scheme, and print it or export it to Word. Success is a teacher setting a Paper in minutes instead of an evening, and printing it with confidence that it looks right.

## Positioning

Made by a CBSE teacher (a Computer Science teacher in Malbazar, West Bengal) for other CBSE teachers. It knows CBSE Paper conventions (Sections A to E, MCQ, Assertion–Reason and Case-Study Questions, internal "OR" choices, Science Divisions for Class 9–10 Science). It is free, needs no sign-up, works offline, and keeps every Paper on the teacher's device.

## Operating Context

- Used as an installable web app (PWA) on Android, iPhone and desktop. The app lives at `/app/`; the Landing Page at the site root introduces it.
- The live preview is the printed A4 Paper. Output goes to a printer, a PDF, or a Word file the teacher may edit further.
- One Paper at a time on a device; other Papers are kept as saved files. Teachers reuse Questions through their own Question Bank.
- Hosting is Cloudflare (a Worker serving static files, at the free address https://prashna.ambik99.workers.dev/ for now). Anonymous, cookieless visit counts only.

## Capabilities and Constraints

- Vocabulary follows `CONTEXT.md` (Paper, Section, Question, Marking Scheme, Template, Question Bank, Get the App, and so on).
- Moving from plain HTML, CSS and JavaScript to Vite + React + TypeScript for the app and Astro + Tailwind for the Landing Page, with a build step (spec #45, `docs/adr/0001` and `0003`). All fonts are self-hosted.
- No accounts. Papers and the Question Bank never leave the device. The one server part is a Cloudflare Worker endpoint for AI Generated Papers (`docs/adr/0002`). It receives only the request (Class, Subject, Focus, difficulty), works only online, and is protected by a bot check, a limit of 3 Papers an hour for each IP address and a daily spending cap. The privacy promise reads: "Your papers stay on your device. AI requests are sent only when you ask for one."
- Not affiliated with CBSE; no CBSE logo anywhere.
- Undecided: custom domain; whether the repository becomes public.

## Brand Commitments

- Name: Prashna, "Question papers for CBSE teachers". Icon: Devanagari प्र in white on an ink-navy rounded square.
- The single call to action is **Get the App**; never "Download".
- Landing Page direction: spec #1 asked for Resurf's principles without copying its layout. On 2026-11-22 the maker chose to follow Resurf's layout, structure and motion closely instead, with Prashna's own copy, fonts, icon and screenshots (never Resurf's copy, logo or images).
- The Landing Page must not feel like startup or tech hype, nor bare like a notice board; it must load fast on a weak connection and read comfortably on a phone.

## Evidence on Hand

- The real app (`apps/app/`, served at `/app/`), which screenshots must be taken from.
- Built-in Templates, including "Board Pattern Starter (Class X)".
- The maker's name, title, quote and contact email are pending (issue #20): use clearly marked placeholders. No testimonials, user counts or endorsements exist; never invent them.

## Product Principles

1. The Paper is the product: what the teacher sees is what prints.
2. Respect the teacher's time and their evening.
3. Their work stays theirs: on their device, never lost to a reload.
4. Plain words from a fellow teacher, not software jargon.

## Accessibility & Inclusion

Works on low-end Android phones and slow connections. Text must be comfortable to read on a phone. Respect reduced motion and the device's light or dark mode.
