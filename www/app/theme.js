// Light and dark theme, shared by the app and the Landing Page. Load it in
// <head>, after the theme-color <meta> tags and before any stylesheet that
// matters, so the page is drawn in the right theme from the first paint.
//
// The page follows the device's light or dark setting until the visitor
// chooses a theme with the toggle; the choice is then remembered on this
// device, for the Landing Page and the app alike. The theme is set as
// <html data-theme="light|dark">, which the stylesheets read.
//
// Any <button data-theme-toggle> becomes the Classic toggle (see
// theme-toggle.css): a sun in the light theme that turns into a moon in the
// dark theme. It is named "Dark theme" and pressed when the dark theme shows.

(function () {
  const STORAGE_KEY = "prashna-theme";
  const root = document.documentElement;
  const deviceIsDark = matchMedia("(prefers-color-scheme: dark)");

  // The visitor's choice, kept in this page too in case storage is blocked.
  let choiceThisVisit = null;
  function chosenTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {}
    return choiceThisVisit;
  }
  const currentTheme = () => chosenTheme() || (deviceIsDark.matches ? "dark" : "light");

  // The browser bar colour for each theme, from the page's own theme-color tags.
  const barColors = {};
  const barTags = document.querySelectorAll('meta[name="theme-color"]');
  for (const tag of barTags) {
    const media = tag.getAttribute("media") || "";
    barColors[media.includes("dark") ? "dark" : "light"] = tag.content;
  }

  const toggles = [];

  function showTheme() {
    const theme = currentTheme();
    root.dataset.theme = theme;
    for (const tag of barTags) if (barColors[theme]) tag.content = barColors[theme];
    for (const toggle of toggles) {
      toggle.classList.toggle("theme-toggle--toggled", theme === "dark");
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  function chooseTheme(theme) {
    choiceThisVisit = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    showTheme();
  }

  showTheme();
  deviceIsDark.addEventListener("change", showTheme);
  // A choice made in another tab (say, the Landing Page) shows here too.
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) showTheme();
  });

  // The Classic toggle's markup, from theme-toggles 4.10.1 (assets/svgs/classic.svg).
  const CLASSIC_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" fill="currentColor" stroke-linecap="round" class="theme-toggle__classic" viewBox="0 0 32 32">' +
    '<clipPath id="theme-toggle__classic__cutout"><path d="M0-5h30a1 1 0 0 0 9 13v24H0Z"/></clipPath>' +
    '<g clip-path="url(#theme-toggle__classic__cutout)">' +
    '<circle cx="16" cy="16" r="9.34"/>' +
    '<g stroke="currentColor" stroke-width="1.5">' +
    '<path d="M16 5.5v-4"/><path d="M16 30.5v-4"/><path d="M1.5 16h4"/><path d="M26.5 16h4"/>' +
    '<path d="m23.4 8.6 2.8-2.8"/><path d="m5.7 26.3 2.9-2.9"/><path d="m5.8 5.8 2.8 2.8"/><path d="m23.4 23.4 2.9 2.9"/>' +
    "</g></g></svg>";

  document.addEventListener("DOMContentLoaded", () => {
    for (const toggle of document.querySelectorAll("[data-theme-toggle]")) {
      toggle.classList.add("theme-toggle");
      toggle.setAttribute("aria-label", "Dark theme");
      toggle.title = "Dark theme";
      toggle.innerHTML = CLASSIC_ICON;
      toggle.addEventListener("click", () => chooseTheme(currentTheme() === "dark" ? "light" : "dark"));
      toggles.push(toggle);
    }
    showTheme();
  });
})();
