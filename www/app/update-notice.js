// Update notice: when a new version of Prashna has been deployed, the
// offline copy (sw.js) downloads it in the background and this shows a small
// "New version available" notice with a Refresh button. The app never reloads
// by itself, so nothing a teacher is typing is lost, and until then it keeps
// running on the files it started with. The new version opens when they
// choose Refresh, or the next time they open Prashna.
// Needs update-notice.css.

(function () {
  if (!("serviceWorker" in navigator)) return;
  const offlineCopy = navigator.serviceWorker;

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

  offlineCopy.addEventListener("message", (event) => {
    if (event.data?.type === "new-version-available") showNotice();
  });

  // Only an app on screen that already runs from its offline copy checks: on
  // the very first visit the offline copy is being stored for the first time.
  // A changed sw.js is a new version too, so the browser checks that as well.
  function checkForNewVersion() {
    const running = offlineCopy.controller;
    if (!running || !navigator.onLine || document.visibilityState !== "visible") return;
    running.postMessage({ type: "check-for-new-version" });
    offlineCopy.getRegistration().then((registration) => registration?.update()).catch(() => {});
  }

  checkForNewVersion();
  document.addEventListener("visibilitychange", checkForNewVersion);
  setInterval(checkForNewVersion, CHECK_EVERY_MS);
})();
