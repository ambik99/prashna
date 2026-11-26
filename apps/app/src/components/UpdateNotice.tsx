// Update Notice: when a new version of Prashna has been deployed, the
// offline copy (sw.ts) downloads it in the background and this shows a small
// "New version available" notice with a Refresh button. The app never reloads
// by itself, so nothing a teacher is typing is lost, and until then it keeps
// running on the files it started with. The new version opens when they
// choose Refresh, or the next time they open Prashna.

import { useEffect, useState } from "react";

// How often an app left open on screen looks for a new version.
const CHECK_EVERY_MS = 60 * 60 * 1000;

export function UpdateNotice() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const offlineCopy = navigator.serviceWorker;

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "new-version-available") setShown(true);
    };

    // Only an app on screen that already runs from its offline copy checks: on
    // the very first visit the offline copy is being stored for the first time.
    // A changed sw.js is a new version too, so the browser checks that as well.
    const checkForNewVersion = () => {
      const running = offlineCopy.controller;
      if (!running || !navigator.onLine || document.visibilityState !== "visible") return;
      running.postMessage({ type: "check-for-new-version" });
      offlineCopy
        .getRegistration()
        .then((registration) => registration?.update())
        .catch(() => {});
    };

    offlineCopy.addEventListener("message", onMessage);
    checkForNewVersion();
    document.addEventListener("visibilitychange", checkForNewVersion);
    const timer = setInterval(checkForNewVersion, CHECK_EVERY_MS);
    return () => {
      offlineCopy.removeEventListener("message", onMessage);
      document.removeEventListener("visibilitychange", checkForNewVersion);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="update-notice" role="status" hidden={!shown}>
      {shown && (
        <>
          <span className="update-notice-text">New version available</span>
          <button type="button" className="update-notice-later" onClick={() => setShown(false)}>
            Later
          </button>
          <button type="button" className="update-notice-refresh" onClick={() => location.reload()}>
            Refresh
          </button>
        </>
      )}
    </div>
  );
}
