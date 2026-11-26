import { useState, type InputHTMLAttributes, type ReactNode } from "react";

/** An editor step: its heading is a button that shows or hides the step. */
export function Step({
  id,
  heading,
  headingId,
  open: controlledOpen,
  onToggle,
  children,
}: {
  id: string;
  heading: string;
  headingId?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [ownOpen, setOwnOpen] = useState(true);
  const open = controlledOpen ?? ownOpen;
  const toggle = () => (onToggle ? onToggle(!open) : setOwnOpen(!open));

  return (
    <div className="step" data-step>
      <h2 className="step-heading">
        <button type="button" className="step-toggle" aria-expanded={open} aria-controls={id} onClick={toggle}>
          <span id={headingId}>{heading}</span>
        </button>
      </h2>
      <div id={id} className="step-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}

/** A number box that keeps what is typed (even empty) while reporting a number. */
export function NumberInput({
  id,
  value,
  onChange,
  ...rest
}: { id: string; value: number; onChange: (value: number) => void } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "id"
>) {
  const [text, setText] = useState(String(value));
  const [shown, setShown] = useState(value);
  // A new value from outside (a Template, a loaded Paper) replaces what was typed.
  if (value !== shown) {
    setShown(value);
    if (Math.max(0, Number(text) || 0) !== value) setText(String(value));
  }
  return (
    <input
      type="number"
      id={id}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        const next = Math.max(0, Number(event.target.value) || 0);
        setShown(next);
        onChange(next);
      }}
      {...rest}
    />
  );
}
