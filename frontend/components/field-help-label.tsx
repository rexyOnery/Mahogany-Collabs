"use client";

import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";

type FieldHelpLabelProps<HelpKey extends string> = {
  fieldId: string;
  helpKey: HelpKey;
  label: string;
  description: string;
  openHelp: HelpKey | null;
  onToggle: (helpKey: HelpKey) => void;
};

export function FieldHelpLabel<HelpKey extends string>({
  fieldId,
  helpKey,
  label,
  description,
  openHelp,
  onToggle
}: FieldHelpLabelProps<HelpKey>) {
  const helpId = `${fieldId}-help`;
  const isOpen = openHelp === helpKey;

  return (
    <div className="field-help-label-row">
      <label htmlFor={fieldId}>{label}</label>
      <span className="field-help">
        <button
          type="button"
          className="field-help-button"
          aria-label={`Explain ${label}`}
          aria-expanded={isOpen}
          aria-controls={helpId}
          aria-describedby={isOpen ? helpId : undefined}
          onClick={() => onToggle(helpKey)}
        >
          <CircleHelp size={18} aria-hidden="true" />
        </button>
      </span>
      <span
        id={helpId}
        className="field-help-popover"
        role="note"
        hidden={!isOpen}
      >
        {description}
      </span>
    </div>
  );
}

export function useFieldHelp<HelpKey extends string>() {
  const [openHelp, setOpenHelp] = useState<HelpKey | null>(null);

  useEffect(() => {
    if (!openHelp) return undefined;

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        !target.closest(".field-help, .field-help-popover")
      ) {
        setOpenHelp(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenHelp(null);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openHelp]);

  const toggleHelp = (helpKey: HelpKey) => {
    setOpenHelp((current) => (current === helpKey ? null : helpKey));
  };

  return { openHelp, toggleHelp };
}
