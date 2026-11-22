// Layout behaviour: the "More" menu, collapsible editor steps and the
// Paper's title in the top bar. Runs after app.js and only arranges the
// page; every action is still handled by app.js.

(function () {
  // "More" menu: a disclosure button with a panel of less frequent actions.
  const moreBtn = document.getElementById("moreBtn");
  const moreMenu = document.getElementById("moreMenu");

  function setMoreOpen(open, { returnFocus = false } = {}) {
    moreMenu.hidden = !open;
    moreBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      const first = moreMenu.querySelector("select, button");
      if (first) first.focus();
    } else if (returnFocus) {
      moreBtn.focus();
    }
  }

  moreBtn.addEventListener("click", () => setMoreOpen(moreMenu.hidden));

  // Choosing an action closes the menu. Template closes once one is picked.
  moreMenu.addEventListener("click", (event) => {
    if (event.target.closest("button")) setMoreOpen(false);
  });
  document.getElementById("templateSelect").addEventListener("change", () => setMoreOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !moreMenu.hidden) setMoreOpen(false, { returnFocus: true });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!moreMenu.hidden && !event.target.closest(".more")) setMoreOpen(false);
  });

  // Close when keyboard focus leaves the menu.
  moreMenu.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !event.relatedTarget.closest(".more")) setMoreOpen(false);
  });

  // Editor steps: each heading's button shows or hides its step.
  function setStepOpen(toggle, open) {
    toggle.setAttribute("aria-expanded", String(open));
    document.getElementById(toggle.getAttribute("aria-controls")).hidden = !open;
  }

  document.querySelectorAll(".step-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      setStepOpen(toggle, toggle.getAttribute("aria-expanded") !== "true");
    });
  });

  // Editing a Question opens the Add Question step and brings it into view.
  document.addEventListener("prashna:edit-question", () => {
    const toggle = document.querySelector('[aria-controls="stepAddQuestion"]');
    setStepOpen(toggle, true);
    toggle.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  // Paper title in the top bar, copied from the live preview so it follows
  // typing, Templates and loaded Papers alike.
  const paperTitle = document.getElementById("paperTitle");
  const previewExam = document.getElementById("previewExam");
  const previewClassSubject = document.getElementById("previewClassSubject");

  function updatePaperTitle() {
    const parts = [previewExam.textContent.trim(), previewClassSubject.textContent.trim()].filter(Boolean);
    paperTitle.textContent = parts.join(" · ");
    paperTitle.title = paperTitle.textContent;
  }

  const observer = new MutationObserver(updatePaperTitle);
  [previewExam, previewClassSubject].forEach((el) =>
    observer.observe(el, { childList: true, characterData: true, subtree: true }),
  );
  updatePaperTitle();
})();
