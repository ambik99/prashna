// Phones: the bottom tab bar. Edit and Preview switch the view; Bank opens
// the Question Bank over both.

export type View = "editor" | "preview";

interface Props {
  view: View;
  bankOpen: boolean;
  onView: (view: View) => void;
  onBank: () => void;
}

export function TabBar({ view, bankOpen, onView, onBank }: Props) {
  const editing = view === "editor";
  return (
    <nav className="tab-bar" aria-label="Views">
      <div className="tab-bar-list" role="tablist" aria-label="Switch View" style={{ display: "contents" }}>
        <button
          type="button"
          id="tabEditorBtn"
          className={editing ? "tab-bar-btn active" : "tab-bar-btn"}
          role="tab"
          aria-selected={!bankOpen && editing}
          onClick={() => onView("editor")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
            <path d="M13.5 6.5l4 4" />
          </svg>
          <span>Edit</span>
        </button>
        <button
          type="button"
          id="tabPreviewBtn"
          className={editing ? "tab-bar-btn" : "tab-bar-btn active"}
          role="tab"
          aria-selected={!bankOpen && !editing}
          onClick={() => onView("preview")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 3h7l5 5v13H7z" />
            <path d="M14 3v5h5" />
            <path d="M10 13h6M10 17h6" />
          </svg>
          <span>Preview</span>
        </button>
        <button type="button" id="tabBankBtn" className="tab-bar-btn" role="tab" aria-selected={bankOpen} onClick={onBank}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7l8-4 8 4-8 4z" />
            <path d="M4 12l8 4 8-4" />
            <path d="M4 17l8 4 8-4" />
          </svg>
          <span>Bank</span>
        </button>
      </div>
    </nav>
  );
}
