// Get the App: the one control that installs Prashna, or explains how to on
// devices without an install prompt. Shared by the app and the Landing Page:
// any button with a data-get-app attribute gets this behaviour, and the page
// needs get-app.css for the guide's look.

(function () {
  // Chrome and Edge offer an install prompt once the page qualifies; keep it
  // until the teacher asks for the app.
  let installPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
  });

  // iPhone and iPad have no install prompt: Safari adds apps from its Share
  // menu. iPads ask for desktop pages, so they look like a Mac with touch.
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isIOSSafari = isIOS && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);

  const SHARE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M7 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1"/></svg>';
  const ADD_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>';

  // A step with a picture of the button to look for.
  function step(icon, iconLabel, html) {
    return `<li class="get-app-step"><span class="get-app-icon" role="img" aria-label="${iconLabel}">${icon}</span><span>${html}</span></li>`;
  }

  const GUIDES = {
    ios: {
      title: "Add Prashna to your Home Screen",
      body:
        '<ol class="get-app-steps">' +
        step(SHARE_ICON, "Share button", "Tap <strong>Share</strong> in Safari’s toolbar.") +
        step(ADD_ICON, "Add to Home Screen", "Scroll down and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.") +
        "</ol>" +
        "<p>Prashna then opens from your Home Screen, full-screen, and works offline.</p>",
    },
    // Any browser without an install prompt: Firefox, Chrome on iPhone, or
    // Chrome when Prashna is already installed on this device.
    otherBrowser: {
      title: "Get the App in Chrome or Safari",
      body:
        "<p>This browser can’t install Prashna. To get the app, open this page in <strong>Chrome</strong> on an Android phone or a computer, or in <strong>Safari</strong> on an iPhone or iPad.</p>" +
        "<p>Already installed it? Open Prashna from your home screen or app list.</p>" +
        "<p>You can also keep using Prashna here in this browser.</p>",
    },
  };

  let dialog = null;

  function showGuide(guide) {
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "get-app-dialog";
      dialog.setAttribute("aria-labelledby", "getAppTitle");
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog || event.target.closest("[data-get-app-close]")) dialog.close();
      });
      document.body.append(dialog);
    }
    dialog.innerHTML =
      `<h3 id="getAppTitle">${guide.title}</h3>${guide.body}` +
      '<div class="get-app-actions"><button type="button" class="get-app-done" data-get-app-close>Got it</button></div>';
    dialog.showModal();
    dialog.querySelector("[data-get-app-close]").focus();
  }

  async function getTheApp() {
    if (installPrompt) {
      const prompt = installPrompt;
      installPrompt = null;
      await prompt.prompt();
      await prompt.userChoice;
    } else if (isIOSSafari) {
      showGuide(GUIDES.ios);
    } else {
      showGuide(GUIDES.otherBrowser);
    }
  }

  const buttons = document.querySelectorAll("[data-get-app]");
  for (const button of buttons) button.addEventListener("click", getTheApp);

  // Once Prashna is installed there is nothing to get: opened from the home
  // screen it runs standalone (iPhones report navigator.standalone instead),
  // and after installing from the prompt the browser fires appinstalled.
  function hideButtons() {
    for (const button of buttons) button.hidden = true;
  }
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone === true) hideButtons();
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    hideButtons();
  });
})();
