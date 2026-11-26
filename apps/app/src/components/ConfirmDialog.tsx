// A confirmation step before anything replaces or deletes a teacher's work.
// Uses the native <dialog>, so focus stays inside it, Escape cancels and
// focus returns to whatever opened it.
//
//   const confirm = useConfirm();
//   const ok = await confirm({ title, message, confirmLabel });

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
}

type Confirm = (request: ConfirmRequest) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm needs a <ConfirmProvider>");
  return confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const settle = useRef<((ok: boolean) => void) | null>(null);
  const opener = useRef<Element | null>(null);
  const [request, setRequest] = useState<ConfirmRequest>({ title: "", message: "", confirmLabel: "" });

  const close = useCallback((result: boolean) => {
    const done = settle.current;
    if (!done) return;
    settle.current = null;
    if (dialog.current?.open) dialog.current.close();
    // If what opened the dialog has since been hidden (a menu that closed),
    // put focus on the "More" button rather than losing it.
    const from = opener.current;
    if (from instanceof HTMLElement && from.closest(".more-menu") && from.offsetParent === null) {
      document.getElementById("moreBtn")?.focus();
    }
    opener.current = null;
    done(result);
  }, []);

  const confirm = useCallback<Confirm>(
    (next) => {
      close(false);
      flushSync(() => setRequest(next));
      opener.current = document.activeElement;
      return new Promise((resolve) => {
        settle.current = resolve;
        dialog.current?.showModal();
        // Cancel is the safe default for a destructive choice.
        cancelButton.current?.focus();
      });
    },
    [close],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialog}
        id="confirmDialog"
        className="confirm-dialog"
        aria-labelledby="confirmTitle"
        aria-describedby="confirmMessage"
        // Escape fires "cancel"; closing any other way counts as Cancel too.
        onCancel={() => close(false)}
        onClose={() => close(false)}
        // A click on the backdrop (outside the card) cancels.
        onClick={(event) => {
          if (event.target === dialog.current) close(false);
        }}
      >
        <h3 id="confirmTitle">{request.title}</h3>
        <p id="confirmMessage">{request.message}</p>
        <div className="confirm-actions">
          <button type="button" ref={cancelButton} id="confirmCancelBtn" className="btn-reset" onClick={() => close(false)}>
            Cancel
          </button>
          <button type="button" id="confirmOkBtn" className="btn-danger" onClick={() => close(true)}>
            {request.confirmLabel}
          </button>
        </div>
      </dialog>
    </ConfirmContext.Provider>
  );
}
