"use client";

// src/components/study/controls/LikertScale.jsx
//
// Escala Likert 1-5 reutilizable para SUS y ad-hoc (dossier §7 y §8).
// Radio buttons horizontales con anclas verbales solo en extremos
// (decisión consolidada U4). Mínimo 44×44px por radio (WCAG 2.5.5).

import { Label } from "@/components/ui/label";
import { LIKERT_SCALE } from "@/lib/research/studyCopy";

export default function LikertScale({ name, value, onChange, statement, itemNumber }) {
  const minLabel = LIKERT_SCALE[0].label;
  const maxLabel = LIKERT_SCALE[LIKERT_SCALE.length - 1].label;

  return (
    <fieldset className="space-y-3 border-t pt-4">
      <legend className="text-sm font-medium leading-snug">
        {itemNumber !== undefined && (
          <span className="text-muted-foreground mr-1">{itemNumber}.</span>
        )}
        {statement}
      </legend>

      <div className="flex items-center justify-between gap-2 px-1 sm:px-2">
        {LIKERT_SCALE.map((opt) => {
          const inputId = `${name}-${opt.value}`;
          const selected = value === opt.value;
          return (
            <Label
              key={opt.value}
              htmlFor={inputId}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-md cursor-pointer border transition-colors ${
                selected
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
                aria-label={opt.label}
              />
              <span className="text-sm font-medium" aria-hidden>
                {opt.value}
              </span>
            </Label>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{minLabel}</span>
        <span className="text-right">{maxLabel}</span>
      </div>
    </fieldset>
  );
}
