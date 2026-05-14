"use client";

import { Fragment, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Briefcase, Clock, Laptop, PauseCircle,
  TrendingUp, Target, Award,
  User, Users,
  Key, Home, CheckCircle, Heart,
  Building2, MapPin, Leaf,
  Bus, Car, CreditCard, RotateCcw,
  Shield, ShieldCheck, ShieldPlus,
  BookOpen, GraduationCap, School,
  AlertCircle, CheckCircle2, Sparkles,
  X, TrendingDown, Minus,
  Building, Info,
} from "lucide-react";

// ─── Metadatos de las 4 secciones ───────────────────────────────────────────

const SECTIONS = [
  {
    title: "Sobre ti",
    subtitle: "Cuéntanos un poco sobre tu situación personal y laboral.",
  },
  {
    title: "Tu vivienda",
    subtitle: "Tu situación de vivienda es uno de los factores que más influye en tu distribución financiera.",
  },
  {
    title: "Movilidad, salud y formación",
    subtitle: "Unos datos más sobre cómo te mueves, cómo cuidas tu salud y si estás estudiando.",
  },
  {
    title: "Tu ahorro y deuda",
    subtitle: "Por último, cuéntanos cómo está tu situación de ahorro y si tienes deudas activas.",
  },
];

// ─── Preguntas y opciones por sección ───────────────────────────────────────
// Cada pregunta: { field, label, helpText?, optional?, options: [{ value, label, subtext?, Icon }] }
// Los valores son exactamente los que almacena profileData (string | number | boolean).

const SECTION_QUESTIONS = [
  // ── Sección 0: Sobre ti ──────────────────────────────────────────────────
  [
    {
      field: "employmentStatus",
      label: "¿Cuál es tu situación laboral actual?",
      options: [
        { value: "permanent",  label: "Asalariado indefinido",            subtext: "Contrato fijo a jornada completa",                  Icon: Briefcase   },
        { value: "temporary",  label: "Asalariado temporal o parcial",    subtext: "Contrato temporal, obra, o media jornada",           Icon: Clock       },
        { value: "freelance",  label: "Autónomo o freelance",             subtext: "Trabajo por cuenta propia",                         Icon: Laptop      },
        { value: "unemployed", label: "Sin ingresos laborales regulares", subtext: "Desempleado, estudiante, excedencia...",             Icon: PauseCircle },
      ],
    },
    {
      field: "ageRange",
      label: "¿En qué franja de edad te encuentras?",
      options: [
        { value: "under35", label: "Menos de 35 años",     Icon: TrendingUp },
        { value: "35to50",  label: "Entre 35 y 50 años",   Icon: Target     },
        { value: "over50",  label: "Más de 50 años",       Icon: Award      },
      ],
    },
    {
      field: "dependents",
      label: "¿Tienes personas a tu cargo económicamente?",
      options: [
        { value: 0, label: "No tengo dependientes",  subtext: "Vivo de forma independiente",                      Icon: User  },
        { value: 1, label: "1 dependiente",          subtext: "Hijo, familiar u otra persona a cargo",            Icon: Users },
        { value: 2, label: "2 dependientes",                                                                       Icon: Users },
        { value: 3, label: "3 dependientes",                                                                       Icon: Users },
        { value: 4, label: "4 dependientes",                                                                       Icon: Users },
        { value: 5, label: "5 o más dependientes",   subtext: "Se usa el valor 5 en todos los cálculos",          Icon: Users },
      ],
    },
  ],

  // ── Sección 1: Tu vivienda ───────────────────────────────────────────────
  [
    {
      field: "housingStatus",
      label: "¿Cuál es tu situación de vivienda actual?",
      options: [
        { value: "rent",     label: "Vivo de alquiler",              subtext: "Pago una renta mensual al propietario",                               Icon: Key         },
        { value: "mortgage", label: "Tengo hipoteca activa",         subtext: "Estoy pagando la hipoteca de mi vivienda",                            Icon: Home        },
        { value: "owned",    label: "Tengo vivienda propia pagada",  subtext: "La hipoteca está saldada o la adquirí sin financiación",              Icon: CheckCircle },
        { value: "family",   label: "Vivo con familia o sin coste",  subtext: "No tengo gasto mensual de vivienda",                                  Icon: Heart       },
      ],
    },
    {
      field: "geographicZone",
      label: "¿En qué tipo de zona resides?",
      options: [
        { value: "expensive_city", label: "Ciudad con alto coste de vida",     subtext: "Madrid, Barcelona, San Sebastián, Bilbao y similares",            Icon: Building2 },
        { value: "standard",       label: "Ciudad o zona urbana estándar",     subtext: "Resto de capitales de provincia y ciudades medias",               Icon: MapPin    },
        { value: "rural",          label: "Zona rural o municipio pequeño",    subtext: "Pueblos, municipios rurales o zonas con baja densidad",           Icon: Leaf      },
      ],
    },
  ],

  // ── Sección 2: Movilidad, salud y formación ──────────────────────────────
  [
    {
      field: "vehicleStatus",
      label: "¿Cuál es tu situación respecto al transporte privado?",
      options: [
        { value: "none",       label: "Sin vehículo propio",            subtext: "Uso transporte público, bicicleta o patinete",                    Icon: Bus       },
        { value: "owned_paid", label: "Vehículo propio ya pagado",      subtext: "El coche o moto es mío y no tiene préstamo",                      Icon: Car       },
        { value: "financed",   label: "Vehículo con préstamo activo",   subtext: "Estoy pagando cuotas por la financiación",                        Icon: CreditCard },
        { value: "leasing",    label: "Renting o leasing",              subtext: "Pago una cuota mensual de uso sin comprar el vehículo",           Icon: RotateCcw },
      ],
    },
    {
      field: "privateHealthInsurance",
      label: "¿Tienes seguro médico privado?",
      options: [
        { value: "none",     label: "No, solo sanidad pública",         subtext: "Solo dispongo del sistema de salud público",                      Icon: Shield      },
        { value: "basic",    label: "Sí, complementario básico",        subtext: "Seguro privado que complementa la sanidad pública",               Icon: ShieldCheck },
        { value: "complete", label: "Sí, seguro privado completo",      subtext: "Cubro la mayoría de mis necesidades sanitarias con el seguro",    Icon: ShieldPlus  },
      ],
    },
    {
      field: "ownEducation",
      label: "¿Estás realizando actualmente algún tipo de formación?",
      options: [
        { value: "none",       label: "Sin formación activa ahora mismo",       subtext: "No tengo estudios o cursos en curso",                    Icon: BookOpen      },
        { value: "continuous", label: "Formación continua o cursos puntuales",  subtext: "Idiomas, certificaciones, cursos online...",             Icon: GraduationCap },
        { value: "formal",     label: "Máster, postgrado o carrera",            subtext: "Estudio reglado con matrícula activa",                   Icon: School        },
      ],
    },
  ],

  // ── Sección 3: Tu ahorro y deuda ─────────────────────────────────────────
  [
    {
      field: "emergencyFundStatus",
      label: "¿Cuánto tienes ahorrado como fondo de emergencia?",
      helpText: "El fondo de emergencia es un colchón de ahorro líquido equivalente a 3–6 meses de tus gastos esenciales.",
      options: [
        { value: "none",     label: "Todavía no tengo",          subtext: "No dispongo de un colchón de emergencia",                   Icon: AlertCircle  },
        { value: "building", label: "Lo estoy construyendo",     subtext: "Tengo algo ahorrado, pero menos de 3 meses de gastos",     Icon: TrendingUp   },
        { value: "partial",  label: "Parcialmente completado",   subtext: "Tengo entre 3 y 6 meses de gastos cubiertos",              Icon: CheckCircle2 },
        { value: "complete", label: "Completado o superado",     subtext: "Tengo 6 meses o más de gastos cubiertos",                  Icon: Sparkles     },
      ],
    },
    {
      field: "housingPurchaseGoal",
      label: "¿Tienes como objetivo comprar una vivienda?",
      options: [
        { value: false, label: "No es un objetivo actual",  subtext: "No planeo comprar vivienda a medio plazo",          Icon: X    },
        { value: true,  label: "Sí, es un objetivo activo", subtext: "Quiero comprar vivienda en los próximos años",      Icon: Home },
      ],
    },
    {
      field: "consumerDebt",
      label: "¿Tienes préstamos o deudas de consumo activas?",
      helpText: "Excluyendo hipoteca si ya la tienes reflejada arriba. Incluye préstamos personales, financiaciones, tarjetas con saldo pendiente, etc.",
      options: [
        { value: "none",   label: "No tengo deudas de consumo",  subtext: "Sin préstamos ni financiaciones activas",        Icon: CheckCircle },
        { value: "low",    label: "Sí, a tipo bajo",             subtext: "Menos del 3% de interés anual",                 Icon: TrendingDown },
        { value: "medium", label: "Sí, a tipo medio",            subtext: "Entre el 3% y el 5% de interés anual",          Icon: Minus       },
        { value: "high",   label: "Sí, a tipo alto",             subtext: "Más del 5% de interés anual",                   Icon: TrendingUp  },
      ],
    },
    {
      field: "pensionRegime",
      label: "¿Cuál es tu sistema de cotización para la jubilación?",
      optional: true,
      options: [
        { value: "social_security", label: "Seguridad Social general",  subtext: "Régimen habitual para la mayoría de trabajadores",          Icon: Building    },
        { value: "mutual",          label: "Mutualidad profesional",    subtext: "Médicos, abogados, arquitectos y otros colegiados",         Icon: Users       },
        { value: "none",            label: "No cotizo actualmente",     subtext: "Sin cotización activa a ningún sistema",                    Icon: PauseCircle },
      ],
    },
  ],
];

// Campos obligatorios para habilitar "Siguiente" en cada sección.
// Los campos condicionales de la sección 0 se validan aparte en isNextDisabled.
const REQUIRED_FIELDS_BY_SECTION = [
  ["employmentStatus", "ageRange", "dependents"],
  ["housingStatus", "geographicZone"],
  ["vehicleStatus", "privateHealthInsurance", "ownEducation"],
  ["emergencyFundStatus", "housingPurchaseGoal", "consumerDebt"],
];

// Mapa { field → { value → label } } para el resumen, construido desde SECTION_QUESTIONS.
const LABEL_MAP = (() => {
  const map = {};
  for (const section of SECTION_QUESTIONS) {
    for (const question of section) {
      map[question.field] = {};
      for (const opt of question.options) {
        map[question.field][opt.value] = opt.label;
      }
    }
  }
  return map;
})();

// Agrupación de campos estándar por sección para el resumen.
// Los campos condicionales de la sección 0 se añaden aparte en renderSummary.
const SUMMARY_SECTIONS = [
  { sectionIndex: 0, fields: ["employmentStatus", "ageRange", "dependents"] },
  { sectionIndex: 1, fields: ["housingStatus", "geographicZone"] },
  { sectionIndex: 2, fields: ["vehicleStatus", "privateHealthInsurance", "ownEducation"] },
  { sectionIndex: 3, fields: ["emergencyFundStatus", "housingPurchaseGoal", "consumerDebt", "pensionRegime"] },
];

// ─── Subcomponente: tarjeta de opción ────────────────────────────────────────

function OptionCard({ option, selected, onSelect }) {
  const { Icon, label, subtext } = option;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all select-none
        ${selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/30"
        }`}
    >
      <div className={`mt-0.5 shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className={`text-sm font-medium leading-snug ${selected ? "text-primary" : "text-foreground"}`}>
          {label}
        </p>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{subtext}</p>
        )}
      </div>
    </div>
  );
}

// ─── Subcomponente: barra de progreso ────────────────────────────────────────

function ProgressBar({ currentStep }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Paso {currentStep + 1} de {SECTIONS.length} — {SECTIONS[currentStep].title}
      </p>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

function ProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // null = directo, "inverse" = inverso

  // currentStep: 0-3 → secciones del cuestionario, 4 → pantalla de resumen
  const [currentStep, setCurrentStep] = useState(0);

  const [profileData, setProfileData] = useState({
    // Sección 0 — Sobre ti
    employmentStatus:    null, // 'permanent' | 'temporary' | 'freelance' | 'unemployed'
    ageRange:            null, // 'under35' | '35to50' | 'over50'
    dependents:          null, // 0 | 1 | 2 | 3 | 4 | 5
    hasPartner:          null, // true | false — visible si dependents > 0
    partnerHasIncome:    null, // true | false — visible si dependents > 0
    childrenAtUniversity: null, // 0 | 1 | 2 | 3 — visible si hay hijos
    childrenStudyingAway: null, // 0 | 1 | 2 | 3 — visible si childrenAtUniversity > 0

    // Sección 1 — Tu vivienda
    housingStatus:       null, // 'rent' | 'mortgage' | 'owned' | 'family'
    geographicZone:      null, // 'expensive_city' | 'standard' | 'rural'

    // Sección 2 — Movilidad, salud y formación
    vehicleStatus:           null, // 'none' | 'owned_paid' | 'financed' | 'leasing'
    freelanceRegularTravel:  null, // true | false — visible si autónomo con vehículo
    privateHealthInsurance:  null, // 'none' | 'basic' | 'complete'
    ownEducation:            null, // 'none' | 'continuous' | 'formal'

    // Sección 3 — Tu ahorro y deuda
    emergencyFundStatus:  null, // 'none' | 'building' | 'partial' | 'complete'
    housingPurchaseGoal:  null, // false | true
    consumerDebt:         null, // 'none' | 'low' | 'medium' | 'high'
    monthlyDebtPayment:   0,    // €/mes — visible si consumerDebt !== 'none'
    pensionRegime:        null, // 'social_security' | 'mutual' | 'none' — opcional
  });

  // ── Lógica de selección con limpieza de campos dependientes ─────────────

  const handleSelect = (field, value) => {
    setProfileData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "dependents") {
        if (value === 0) {
          // Sin dependientes: limpiar todos los subcampos
          next.hasPartner = null;
          next.partnerHasIncome = null;
          next.childrenAtUniversity = null;
          next.childrenStudyingAway = null;
        } else {
          // Con dependientes: inicializar subcampos de hijos si aún no se han tocado
          if (next.childrenAtUniversity === null) next.childrenAtUniversity = 0;
          if (next.childrenStudyingAway === null) next.childrenStudyingAway = 0;
          // Si hasPartner ya está definido, comprobar consistencia de hijos
          if (prev.hasPartner !== null) {
            const numChildren = value - (prev.hasPartner ? 1 : 0);
            if (numChildren <= 0 || prev.childrenAtUniversity > numChildren) {
              next.childrenAtUniversity = 0;
              next.childrenStudyingAway = 0;
            }
          }
        }
      }

      if (field === "hasPartner") {
        const numChildren = (prev.dependents ?? 0) - (value ? 1 : 0);
        // Si con el nuevo valor no hay hijos, o childrenAtUniversity excede el nuevo máximo
        if (numChildren <= 0 || prev.childrenAtUniversity > numChildren) {
          next.childrenAtUniversity = 0;
          next.childrenStudyingAway = 0;
        } else if (next.childrenStudyingAway > next.childrenAtUniversity) {
          next.childrenStudyingAway = 0;
        }
      }

      if (field === "childrenAtUniversity") {
        // childrenStudyingAway no puede superar childrenAtUniversity
        if ((prev.childrenStudyingAway ?? 0) > value) {
          next.childrenStudyingAway = 0;
        }
      }

      if (field === "employmentStatus" && value !== "freelance") {
        next.freelanceRegularTravel = null;
      }

      if (field === "vehicleStatus" && value === "none") {
        next.freelanceRegularTravel = null;
      }

      if (field === "consumerDebt" && value === "none") {
        next.monthlyDebtPayment = 0;
      }

      return next;
    });
  };

  // ── Condiciones de visibilidad de las preguntas condicionales ────────────

  const showFreelanceTravel =
    profileData.employmentStatus === 'freelance' &&
    profileData.vehicleStatus !== null &&
    profileData.vehicleStatus !== 'none';

  const showQ5a = (profileData.dependents ?? 0) > 0;
  const showPartnerIncome = showQ5a && profileData.hasPartner !== null;

  const numChildren =
    profileData.dependents !== null && profileData.hasPartner !== null
      ? profileData.dependents - (profileData.hasPartner ? 1 : 0)
      : 0;

  const showQ5b = showQ5a && profileData.hasPartner !== null && numChildren > 0;
  const showQ5c = showQ5b && (profileData.childrenAtUniversity ?? 0) > 0;

  // ── Opciones dinámicas para Q5b y Q5c ───────────────────────────────────

  const q5bOptions = [
    { value: 0, label: "Ninguno", Icon: BookOpen },
    ...Array.from({ length: numChildren }, (_, i) => ({
      value: i + 1,
      label: String(i + 1),
      Icon: GraduationCap,
    })),
  ];

  const numAtUniversity = profileData.childrenAtUniversity ?? 0;
  const q5cOptions = [
    { value: 0, label: "Ninguno", Icon: Home },
    ...Array.from({ length: numAtUniversity }, (_, i) => ({
      value: i + 1,
      label: String(i + 1),
      Icon: MapPin,
    })),
  ];

  // ── Validación del botón Siguiente ──────────────────────────────────────

  const isNextDisabled =
    currentStep < 4 &&
    (
      REQUIRED_FIELDS_BY_SECTION[currentStep].some(
        (field) => profileData[field] === null
      ) ||
      // Q5a es obligatoria si hay dependientes
      (currentStep === 0 && showQ5a && profileData.hasPartner === null) ||
      // Pregunta de ingresos de pareja es obligatoria si aplica
      (currentStep === 0 && showPartnerIncome && profileData.partnerHasIncome === null) ||
      // Pregunta de desplazamiento autónomo es obligatoria si aplica
      (currentStep === 2 && showFreelanceTravel && profileData.freelanceRegularTravel === null)
    );

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handlePrev = () => setCurrentStep((s) => s - 1);

  const handleConfirm = () => {
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    router.push(mode === "inverse" ? "/inverse-calculator" : "/calculator");
  };

  // ── Renderizado de una sección de preguntas ──────────────────────────────

  const renderSection = (sectionIndex) => {
    const section = SECTIONS[sectionIndex];
    const questions = SECTION_QUESTIONS[sectionIndex];

    return (
      <div className="space-y-8">
        <ProgressBar currentStep={sectionIndex} />

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{section.title}</h1>
          <p className="text-sm text-muted-foreground">{section.subtitle}</p>
        </div>

        {questions.map((question) => {
          const isOptional = question.optional === true;
          const gridClass = question.options.length >= 4 ? "grid gap-2 sm:grid-cols-2" : "grid gap-2";

          return (
            <Fragment key={question.field}>
              {/* Pregunta estándar */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{question.label}</p>
                  {isOptional && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full leading-none">
                      Opcional
                    </span>
                  )}
                </div>

                {question.helpText && (
                  <p className="text-xs text-muted-foreground">{question.helpText}</p>
                )}

                <div className={gridClass}>
                  {question.options.map((option) => (
                    <OptionCard
                      key={String(option.value)}
                      option={option}
                      selected={profileData[question.field] === option.value}
                      onSelect={() => handleSelect(question.field, option.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Subpregunta condicional — cuota mensual de deuda en sección 3 */}
              {sectionIndex === 3 && question.field === "consumerDebt" &&
                profileData.consumerDebt !== null && profileData.consumerDebt !== 'none' && (
                <div className="space-y-3 pl-4 border-l-2 border-muted animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      ¿Cuánto pagas en total al mes en cuotas de préstamos o deudas?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sin contar hipoteca ni vehículo. Incluye préstamos personales, financiaciones de productos, tarjetas con saldo pendiente, deudas con familiares, etc.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={profileData.monthlyDebtPayment || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setProfileData((prev) => ({
                          ...prev,
                          monthlyDebtPayment: isNaN(val) ? 0 : Math.max(0, val),
                        }));
                      }}
                      placeholder="0"
                      className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">€/mes</span>
                  </div>
                </div>
              )}

              {/* Subpregunta condicional — autónomo con vehículo en sección 2 */}
              {sectionIndex === 2 && question.field === "vehicleStatus" && showFreelanceTravel && (
                <div className="space-y-3 pl-4 border-l-2 border-muted animate-in fade-in duration-200">
                  <p className="text-sm font-medium">
                    ¿Tu actividad requiere desplazamientos regulares para visitar clientes o realizar tu trabajo en distintas ubicaciones?
                  </p>
                  <div className="grid gap-2">
                    {[
                      { value: true,  label: "Sí", subtext: "Visito clientes, obras u otros lugares de trabajo habitualmente", Icon: MapPin   },
                      { value: false, label: "No", subtext: "Trabajo principalmente desde un único lugar fijo",                Icon: Building },
                    ].map((option) => (
                      <OptionCard
                        key={String(option.value)}
                        option={option}
                        selected={profileData.freelanceRegularTravel === option.value}
                        onSelect={() => handleSelect("freelanceRegularTravel", option.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Subpreguntas condicionales — solo tras 'dependents' en sección 0 */}
              {sectionIndex === 0 && question.field === "dependents" && (
                <>
                  {/* Q5a: ¿incluye pareja? */}
                  {showQ5a && (
                    <div className="space-y-3 pl-4 border-l-2 border-muted animate-in fade-in duration-200">
                      <p className="text-sm font-medium">
                        ¿Incluye una pareja o adulto a tu cargo?
                      </p>
                      <div className="grid gap-2">
                        {[
                          { value: true,  label: "Sí", subtext: "Uno de los dependientes es mi pareja u otro adulto", Icon: Heart },
                          { value: false, label: "No", subtext: "Todos los dependientes son hijos u otros menores",   Icon: User  },
                        ].map((option) => (
                          <OptionCard
                            key={String(option.value)}
                            option={option}
                            selected={profileData.hasPartner === option.value}
                            onSelect={() => handleSelect("hasPartner", option.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Q5a.2: ¿la pareja aporta ingresos? */}
                  {showPartnerIncome && (
                    <div className="space-y-3 pl-4 border-l-2 border-muted animate-in fade-in duration-200">
                      <p className="text-sm font-medium">
                        ¿Tu pareja aporta ingresos propios al hogar?
                      </p>
                      <div className="grid gap-2">
                        {[
                          { value: true,  label: "Sí", subtext: "Mi pareja trabaja o tiene ingresos propios",       Icon: TrendingUp  },
                          { value: false, label: "No", subtext: "Mi pareja no tiene ingresos o no tengo pareja",    Icon: PauseCircle },
                        ].map((option) => (
                          <OptionCard
                            key={String(option.value)}
                            option={option}
                            selected={profileData.partnerHasIncome === option.value}
                            onSelect={() => handleSelect("partnerHasIncome", option.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Q5b: ¿cuántos hijos en universidad? */}
                  {showQ5b && (
                    <div className="space-y-3 pl-4 border-l-2 border-muted animate-in fade-in duration-200">
                      <p className="text-sm font-medium">
                        ¿Cuántos de tus hijos estudian en la universidad?
                      </p>
                      <div className={q5bOptions.length >= 4 ? "grid gap-2 sm:grid-cols-2" : "grid gap-2"}>
                        {q5bOptions.map((option) => (
                          <OptionCard
                            key={String(option.value)}
                            option={option}
                            selected={profileData.childrenAtUniversity === option.value}
                            onSelect={() => handleSelect("childrenAtUniversity", option.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Q5c: ¿cuántos fuera de casa? */}
                  {showQ5c && (
                    <div className="space-y-3 pl-4 border-l-2 border-muted animate-in fade-in duration-200">
                      <p className="text-sm font-medium">
                        ¿Cuántos de ellos estudian fuera de casa, en otra ciudad?
                      </p>
                      <div className={q5cOptions.length >= 4 ? "grid gap-2 sm:grid-cols-2" : "grid gap-2"}>
                        {q5cOptions.map((option) => (
                          <OptionCard
                            key={String(option.value)}
                            option={option}
                            selected={profileData.childrenStudyingAway === option.value}
                            onSelect={() => handleSelect("childrenStudyingAway", option.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </Fragment>
          );
        })}

        {/* Navegación */}
        <div className="flex justify-between pt-2">
          {sectionIndex > 0 ? (
            <Button variant="outline" onClick={handlePrev}>
              Anterior
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={handleNext} disabled={isNextDisabled}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  };

  // ── Renderizado de la pantalla de resumen ────────────────────────────────

  const renderSummary = () => (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Resumen de tu perfil</h1>
        <p className="text-sm text-muted-foreground">
          Revisa tus respuestas antes de continuar. Puedes editar cualquier sección.
        </p>
      </div>

      {SUMMARY_SECTIONS.map(({ sectionIndex, fields }) => (
        <div key={sectionIndex} className="space-y-3">
          {/* Cabecera de sección */}
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-semibold">{SECTIONS[sectionIndex].title}</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setCurrentStep(sectionIndex)}
            >
              Editar
            </Button>
          </div>

          {/* Chips de respuestas */}
          <div className="flex flex-wrap gap-2">
            {fields.map((field) => {
              const value = profileData[field];
              if (value === null) return null;
              const label = LABEL_MAP[field]?.[value] ?? String(value);
              return (
                <span
                  key={field}
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted text-foreground"
                >
                  {label}
                </span>
              );
            })}

            {/* Chips adicionales para las subpreguntas condicionales de la sección 0 */}
            {sectionIndex === 0 && (
              <>
                {profileData.dependents > 0 && profileData.hasPartner === true && (
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted text-foreground">
                    Incluye pareja
                  </span>
                )}
                {profileData.dependents > 0 && profileData.hasPartner !== null && profileData.partnerHasIncome === true && (
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted text-foreground">
                    Pareja con ingresos
                  </span>
                )}
                {(profileData.childrenAtUniversity ?? 0) > 0 && (
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted text-foreground">
                    {profileData.childrenAtUniversity} en universidad
                  </span>
                )}
                {(profileData.childrenStudyingAway ?? 0) > 0 && (
                  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted text-foreground">
                    {profileData.childrenStudyingAway} fuera de casa
                  </span>
                )}
              </>
            )}

            {/* Chip adicional para cuota de deuda en sección 3 */}
            {sectionIndex === 3 && profileData.monthlyDebtPayment > 0 && (
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted text-foreground">
                Cuota deuda: {profileData.monthlyDebtPayment}€/mes
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Navegación final */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={handlePrev}>
          Anterior
        </Button>
        <Button size="lg" onClick={handleConfirm}>
          Confirmar y calcular
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center pt-3">
        Tu perfil se guardará en este dispositivo para que no tengas que rellenarlo de nuevo.
      </p>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 pt-12">
      <div className="w-full max-w-2xl space-y-6">
        {mode === "inverse" && (
          <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <Info className="size-5 shrink-0 mt-0.5" />
            <p>
              Estás configurando tu perfil para el cálculo inverso. Define el perfil que corresponda al estilo de vida que deseas alcanzar, no necesariamente tu situación actual. Por ejemplo, si actualmente vives de alquiler pero quieres comprar una vivienda, selecciona &quot;Hipoteca&quot; en tu perfil. Si prefieres ahorrar para pagarla sin préstamo, mantén tu perfil actual y destina el importe deseado a &quot;Ahorro a largo plazo&quot;.
            </p>
          </div>
        )}
        {currentStep < 4 ? renderSection(currentStep) : renderSummary()}
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </main>
    }>
      <ProfileForm />
    </Suspense>
  );
}
