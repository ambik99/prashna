// Update notice: when a new version of Prashna has been deployed, the
// offline copy (sw.js) downloads it in the background and this shows a small
// "New version available" notice with a Refresh button. The app never reloads
// by itself, so nothing a teacher is typing is lost; the new version opens
// when they choose Refresh, or the next time they open Prashna.
// Needs update-notice.css.

(function () {
  if (!("serviceWorker" in navigator)) return;
  const worker = navigator.serviceWorker;

  // How often an app left open on screen looks for a new version.
  const CHECK_EVERY_MS = 60 * 60 * 1000;

  const notice = document.createElement("div");
  notice.className = "update-notice";
  notice.setAttribute("role", "status");
  notice.hidden = true;
  document.body.append(notice);

  function showNotice() {
    if (!notice.hidden) return;
    notice.innerHTML =
      '<span class="update-notice-text">New version available</span>' +
      '<button type="button" class="update-notice-later">Later</button>' +
      '<button type="button" class="update-notice-refresh">Refresh</button>';
    notice.querySelector(".update-notice-refresh").addEventListener("click", () => location.reload());
    notice.querySelector(".update-notice-later").addEventListener("click", () => {
      notice.hidden = true;
      notice.textContent = "";
    });
    notice.hidden = false;
  }

  worker.addEventListener("message", (event) => {
    if (event.data?.type === "new-version-available") showNotice();
  });

  // Only an app that already runs from its offline copy checks: on the very
  // first visit the offline copy is being stored for the first time.
  function checkForNewVersion() {
    if (worker.controller && navigator.onLine) worker.controller.postMessage({ type: "check-for-new-version" });
  }

  checkForNewVersion();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForNewVersion();
  });
  setInterval(() => {
    if (document.visibilityState === "visible") checkForNewVersion();
  }, CHECK_EVERY_MS);
})();
