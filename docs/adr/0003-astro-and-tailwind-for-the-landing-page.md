# Astro and Tailwind for the Landing Page

The Landing Page is static content with a launch animation, while the app is a client-only editor. We build the Landing Page with Astro + Tailwind + TypeScript, separately from the React app, so it ships as plain HTML with very little JavaScript and stays fast on weak connections.

The app keeps its own CSS rather than Tailwind (see ADR-0001). So that the two do not drift apart, `tokens.css` is the single source of design tokens, and the Landing Page's Tailwind theme reads the same CSS variables.
