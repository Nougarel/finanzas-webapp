"use client";

// src/components/study/screens/DemographicsScreen.jsx

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMOGRAPHICS } from "@/lib/research/studyCopy";
import { useStudyContext } from "@/lib/research/useStudyContext";
import { validateDemographics } from "@/lib/research/studyValidators";
import { DEMOGRAPHICS_KEY } from "@/lib/research/studyConfig";

/**
 * Pantalla 3: demografía (dossier §4). Pantalla única scrolleable con
 * 6 preguntas; todas obligatorias. Validación en submit con scroll al
 * primer campo con error.
 */
export default function DemographicsScreen() {
  const { goToStep, setPretestAnswer, pretestAnswers } = useStudyContext();
  const titleRef = useRef(null);
  const fieldRefs = useRef({});

  const [state, setState] = useState(() => ({
    age_range: "",
    gender: "",
    education_level: "",
    employment_status: "",
    household_composition: "",
    prior_financial_app_use: null,
    ...(pretestAnswers[DEMOGRAPHICS_KEY] ?? {}),
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const setField = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateDemographics(state);
    if (!valid) {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      fieldRefs.current[firstError]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Persistir en el contexto para que PretestQuestionScreen pueda armar
    // el payload final de pretest_responses en la última pregunta.
    setPretestAnswer(DEMOGRAPHICS_KEY, state);
    goToStep("pretest_intro");
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start p-4 py-8 animate-in fade-in duration-150">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle
            ref={titleRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight outline-none"
          >
            {DEMOGRAPHICS.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {DEMOGRAPHICS.intro}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Rango de edad */}
            <fieldset
              ref={(el) => { fieldRefs.current.age_range = el; }}
              className="space-y-2 border-t pt-4"
              aria-invalid={!!errors.age_range}
            >
              <legend className="text-sm font-medium">
                {DEMOGRAPHICS.questions.age_range.label}
              </legend>
              <RadioGroup
                value={state.age_range}
                onValueChange={(v) => setField("age_range", v)}
                className="gap-2"
              >
                {DEMOGRAPHICS.questions.age_range.options.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2 min-h-[44px]">
                    <RadioGroupItem id={`age-${opt.value}`} value={opt.value} />
                    <Label htmlFor={`age-${opt.value}`} className="cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.age_range && (
                <p className="text-xs text-destructive">{errors.age_range}</p>
              )}
            </fieldset>

            {/* Género */}
            <fieldset
              ref={(el) => { fieldRefs.current.gender = el; }}
              className="space-y-2 border-t pt-4"
              aria-invalid={!!errors.gender}
            >
              <legend className="text-sm font-medium">
                {DEMOGRAPHICS.questions.gender.label}
              </legend>
              <RadioGroup
                value={state.gender}
                onValueChange={(v) => setField("gender", v)}
                className="flex flex-wrap gap-4"
              >
                {DEMOGRAPHICS.questions.gender.options.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2 min-h-[44px]">
                    <RadioGroupItem id={`gender-${opt.value}`} value={opt.value} />
                    <Label htmlFor={`gender-${opt.value}`} className="cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender}</p>
              )}
            </fieldset>

            {/* Nivel educativo */}
            <div
              ref={(el) => { fieldRefs.current.education_level = el; }}
              className="space-y-2 border-t pt-4"
            >
              <Label htmlFor="education_level" className="text-sm font-medium">
                {DEMOGRAPHICS.questions.education_level.label}
              </Label>
              <Select
                value={state.education_level}
                onValueChange={(v) => setField("education_level", v)}
              >
                <SelectTrigger id="education_level" aria-invalid={!!errors.education_level}>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {DEMOGRAPHICS.questions.education_level.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.education_level && (
                <p className="text-xs text-destructive">{errors.education_level}</p>
              )}
            </div>

            {/* Situación laboral */}
            <div
              ref={(el) => { fieldRefs.current.employment_status = el; }}
              className="space-y-2 border-t pt-4"
            >
              <Label htmlFor="employment_status" className="text-sm font-medium">
                {DEMOGRAPHICS.questions.employment_status.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {DEMOGRAPHICS.questions.employment_status.helpText}
              </p>
              <Select
                value={state.employment_status}
                onValueChange={(v) => setField("employment_status", v)}
              >
                <SelectTrigger id="employment_status" aria-invalid={!!errors.employment_status}>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  {DEMOGRAPHICS.questions.employment_status.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employment_status && (
                <p className="text-xs text-destructive">{errors.employment_status}</p>
              )}
            </div>

            {/* Composición del hogar */}
            <fieldset
              ref={(el) => { fieldRefs.current.household_composition = el; }}
              className="space-y-2 border-t pt-4"
              aria-invalid={!!errors.household_composition}
            >
              <legend className="text-sm font-medium">
                {DEMOGRAPHICS.questions.household_composition.label}
              </legend>
              <RadioGroup
                value={state.household_composition}
                onValueChange={(v) => setField("household_composition", v)}
                className="gap-2"
              >
                {DEMOGRAPHICS.questions.household_composition.options.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2 min-h-[44px]">
                    <RadioGroupItem id={`household-${opt.value}`} value={opt.value} />
                    <Label htmlFor={`household-${opt.value}`} className="cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.household_composition && (
                <p className="text-xs text-destructive">{errors.household_composition}</p>
              )}
            </fieldset>

            {/* Uso previo de apps financieras (boolean) */}
            <fieldset
              ref={(el) => { fieldRefs.current.prior_financial_app_use = el; }}
              className="space-y-2 border-t pt-4"
              aria-invalid={!!errors.prior_financial_app_use}
            >
              <legend className="text-sm font-medium">
                {DEMOGRAPHICS.questions.prior_financial_app_use.label}
              </legend>
              <RadioGroup
                value={
                  state.prior_financial_app_use === true
                    ? "true"
                    : state.prior_financial_app_use === false
                    ? "false"
                    : ""
                }
                onValueChange={(v) => setField("prior_financial_app_use", v === "true")}
                className="flex flex-wrap gap-4"
              >
                {DEMOGRAPHICS.questions.prior_financial_app_use.options.map((opt) => (
                  <div key={String(opt.value)} className="flex items-center gap-2 min-h-[44px]">
                    <RadioGroupItem
                      id={`prior-${String(opt.value)}`}
                      value={String(opt.value)}
                    />
                    <Label htmlFor={`prior-${String(opt.value)}`} className="cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.prior_financial_app_use && (
                <p className="text-xs text-destructive">{errors.prior_financial_app_use}</p>
              )}
            </fieldset>

            <Button type="submit" className="w-full">
              {DEMOGRAPHICS.cta}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
