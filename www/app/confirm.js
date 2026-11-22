// A confirmation step before anything replaces or deletes a teacher's work.
// Uses the native <dialog>, so focus stays inside it, Escape cancels and
// focus returns to whatever opened it.
//
//   const ok = await confirmAction({ title, message, confirmLabel });

window.confirmAction = (function () {
  const dialog = document.getElementById("confirmDialog");
  const titleEl = document.getElementById("confirmTitle");
  const messageEl = document.getElementById("confirmMessage");
  const confirmBtn = document.getElementById("confirmOkBtn");
  const cancelBtn = document.getElementById("confirmCancelBtn");

  let settle = null;
  let opener = null;

  function close(result) {
    if (!settle) return;
    const done = settle;
    settle = null;
    if (dialog.open) dialog.close();
    // If what opened the dialog has since been hidden (a menu that closed),
    // put focus on the "More" button rather than losing it.
    if (opener && opener.closest && opener.closest(".more-menu") && opener.offsetParent === null) {
      const more = document.getElementById("moreBtn");
      if (more) more.focus();
    }
    opener = null;
    done(result);
  }

  confirmBtn.addEventListener("click", () => close(true));
  cancelBtn.addEventListener("click", () => close(false));
  // Escape fires "cancel"; closing any other way counts as Cancel too.
  dialog.addEventListener("cancel", () => close(false));
  dialog.addEventListener("close", () => close(false));
  // A click on the backdrop (outside the card) cancels.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close(false);
  });

  return function confirmAction({ title, message, confirmLabel }) {
    close(false);
    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmBtn.textContent = confirmLabel;
    opener = document.activeElement;
    return new Promise((resolve) => {
      settle = resolve;
      dialog.showModal();
      // Cancel is the safe default for a destructive choice.
      cancelBtn.focus();
    });
  };
})();
