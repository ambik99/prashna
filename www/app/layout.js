// Layout behaviour: the "More" menu, collapsible editor steps, the
// Paper's title in the top bar, and the phone layout (bottom tab bar and
// bottom sheets). Runs after app.js and only arranges the page; every
// action is still handled by app.js.

(function () {
  const phone = matchMedia("(max-width: 880px)");

  // "More" menu: a disclosure button with a panel of less frequent actions.
  // On phones it is a bottom sheet over a backdrop.
  const moreBtn = document.getElementById("moreBtn");
  const moreMenu = document.getElementById("moreMenu");
  const sheetBackdrop = document.getElementById("sheetBackdrop");

  function setMoreOpen(open, { returnFocus = false } = {}) {
    moreMenu.hidden = !open;
    sheetBackdrop.hidden = !(open && phone.matches);
    document.body.classList.toggle("sheet-open", open && phone.matches);
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

  // Question Bank: a slide-out panel that sits over the preview, so the
  // editor stays in view and Questions can be inserted while it is open.
  const bankToggleBtn = document.getElementById("bankToggleBtn");
  const bankPanel = document.getElementById("bankPanel");
  const bankCloseBtn = document.getElementById("bankCloseBtn");

  function setBankOpen(open, { returnFocus = false } = {}) {
    bankPanel.hidden = !open;
    bankToggleBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("bank-open", open);
    if (open) {
      const topBar = document.querySelector(".app-header");
      document.documentElement.style.setProperty("--topbar-height", topBar.offsetHeight + "px");
      // On a phone, focusing search would pop the keyboard over the list.
      if (!phone.matches) document.getElementById("bankSearchInput").focus();
    } else if (returnFocus && !phone.matches) {
      bankToggleBtn.focus();
    }
    syncTabBar();
  }

  bankToggleBtn.addEventListener("click", () => setBankOpen(bankPanel.hidden));
  bankCloseBtn.addEventListener("click", () => setBankOpen(false, { returnFocus: true }));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!moreMenu.hidden) {
      setMoreOpen(false, { returnFocus: true });
    } else if (!bankPanel.hidden) {
      setBankOpen(false, { returnFocus: true });
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!moreMenu.hidden && !event.target.closest(".more-menu, #moreBtn")) setMoreOpen(false);
  });

  // Close when keyboard focus leaves the menu.
  moreMenu.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !event.relatedTarget.closest(".more")) setMoreOpen(false);
  });

  // Phones: Print and Export move from the top bar into the More sheet.
  const morePrimary = document.getElementById("morePrimary");
  const headerActions = document.querySelector(".header-actions");
  const printBtn = document.getElementById("printBtn");
  const exportDocBtn = document.getElementById("exportDocBtn");

  function placePrimaryActions() {
    if (phone.matches) {
      morePrimary.append(printBtn, exportDocBtn);
    } else {
      headerActions.append(exportDocBtn, printBtn);
    }
    if (!moreMenu.hidden) setMoreOpen(true);
  }
  phone.addEventListener("change", placePrimaryActions);
  placePrimaryActions();

  // Bottom tab bar: Edit and Preview switch the view (app.js); Bank opens
  // the Question Bank over both.
  const tabEditorBtn = document.getElementById("tabEditorBtn");
  const tabPreviewBtn = document.getElementById("tabPreviewBtn");
  const tabBankBtn = document.getElementById("tabBankBtn");
  const mainLayout = document.getElementById("mainLayout");

  function syncTabBar() {
    const bankOpen = !bankPanel.hidden;
    const editing = mainLayout.classList.contains("mobile-view-editor");
    tabBankBtn.setAttribute("aria-selected", String(bankOpen));
    tabEditorBtn.setAttribute("aria-selected", String(!bankOpen && editing));
    tabPreviewBtn.setAttribute("aria-selected", String(!bankOpen && !editing));
  }

  tabBankBtn.addEventListener("click", () => setBankOpen(true));
  [tabEditorBtn, tabPreviewBtn].forEach((tab) =>
    tab.addEventListener("click", () => {
      setBankOpen(false);
      window.scrollTo({ top: 0 });
    }),
  );

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
    if (phone.matches) setBankOpen(false);
    const toggle = document.querySelector('[aria-controls="stepAddQuestion"]');
    setStepOpen(toggle, true);
    // Wait a frame: on a phone the editor view is only shown after this event.
    requestAnimationFrame(() => {
      toggle.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
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
