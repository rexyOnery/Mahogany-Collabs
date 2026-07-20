"use client";

import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";

export function FieldHelpLabel({
  fieldId,
  helpKey,
  label,
  description,
  openHelp,
  onToggle
}) {
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

export function useFieldHelp() {
  const [openHelp, setOpenHelp] = useState(null);

  useEffect(() => {
    if (!openHelp) return undefined;

    const closeOnOutsideClick = (event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        !target.closest(".field-help, .field-help-popover")
      ) {
        setOpenHelp(null);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenHelp(null);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openHelp]);

  const toggleHelp = (helpKey) => {
    setOpenHelp((current) => (current === helpKey ? null : helpKey));
  };

  return { openHelp, toggleHelp };
}

