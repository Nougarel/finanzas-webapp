// Copy adaptativo del cuestionario de perfil según el flujo
export const PROFILE_COPY = {
  direct: {
    badge: { text: "Perfil actual", variant: "current" },
    sections: [
      {
        title: "Sobre ti",
        subtitle: "Describe tu situación actual.",
      },
      {
        title: "Tu vivienda",
        subtitle: "",
      },
      {
        title: "Movilidad, salud y formación",
        subtitle: "Unos datos más sobre cómo te mueves, cómo cuidas tu salud y si estás estudiando.",
      },
      {
        title: "Tu ahorro y deuda",
        subtitle: "Por último, cuéntanos cómo está tu situación de ahorro y si tienes deudas activas.",
      },
    ],
    questions: {
      employmentStatus:       "¿Cuál es tu situación laboral actual?",
      ageRange:               "¿En qué franja de edad te encuentras?",
      dependents:             "¿Tienes personas a tu cargo económicamente?",
      hasPartner:             "¿Incluye una pareja o adulto a tu cargo?",
      partnerHasIncome:       "¿Tu pareja aporta ingresos propios al hogar?",
      childrenAtUniversity:   "¿Cuántos de tus hijos estudian en la universidad?",
      childrenStudyingAway:   "¿Cuántos de ellos estudian fuera de casa, en otra ciudad?",
      freelanceRegularTravel: "¿Tu actividad requiere desplazamientos regulares para visitar clientes o trabajar en otras ubicaciones?",
      housingStatus:          "¿Cuál es tu situación de vivienda actual?",
      geographicZone:         "¿En qué tipo de zona resides?",
      vehicleStatus:          "¿Cuál es tu situación respecto al transporte privado?",
      privateHealthInsurance: "¿Tienes seguro médico privado?",
      ownEducation:           "¿Estás realizando actualmente algún tipo de formación?",
      emergencyFundStatus:    "¿Cuánto tienes ahorrado como fondo de emergencia?",
      housingPurchaseGoal:    "¿Tienes como objetivo comprar una vivienda?",
      consumerDebt:           "¿Tienes préstamos o deudas de consumo activas?",
      monthlyDebtPayment:     "¿Cuánto pagas en total al mes en cuotas de préstamos o deudas?",
      pensionRegime:          "¿Cuál es tu sistema de cotización para la jubilación?",
    },
    summary: {
      title: "Resumen de tu perfil",
      subtitle: "Revisa tus respuestas antes de continuar. Puedes editar cualquier sección.",
      cta: "Confirmar y calcular",
      footer: "Tu perfil se guardará en este dispositivo para que no tengas que rellenarlo de nuevo.",
    },
  },

  inverse: {
    badge: { text: "Perfil ideal futuro", variant: "ideal" },
    sections: [
      {
        title: "Tu perfil ideal",
        subtitle: "Describe cómo sería la vida para la que quieres calcular el ingreso necesario.",
      },
      {
        title: "Tu vivienda ideal",
        subtitle: "¿Dónde y cómo te gustaría vivir en tu vida ideal?",
      },
      {
        title: "Movilidad, salud y formación ideales",
        subtitle: "¿Cómo te moverías, cuidarías tu salud y desarrollarías tu formación en tu vida ideal?",
      },
      {
        title: "Tu ahorro ideal",
        subtitle: "¿Cómo gestionarías tu ahorro en tu escenario financiero ideal?",
      },
    ],
    questions: {
      employmentStatus:       "¿Cuál sería tu situación laboral ideal?",
      ageRange:               "¿En qué franja de edad te encontrarías?",
      dependents:             "¿Cuántas personas tendrías a tu cargo económicamente?",
      hasPartner:             "¿Incluiría una pareja o adulto a tu cargo en tu hogar ideal?",
      partnerHasIncome:       "¿Aportaría ingresos propios al hogar tu pareja?",
      childrenAtUniversity:   "¿Cuántos de tus hijos estarían estudiando en la universidad?",
      childrenStudyingAway:   "¿Cuántos de ellos estudiarían fuera de casa, en otra ciudad?",
      freelanceRegularTravel: "¿Tu actividad requeriría desplazamientos regulares para visitar clientes o trabajar en otras ubicaciones?",
      housingStatus:          "¿Cuál sería tu situación de vivienda ideal?",
      geographicZone:         "¿En qué tipo de zona vivirías idealmente?",
      vehicleStatus:          "¿Cuál sería tu relación con el transporte privado en tu vida ideal?",
      privateHealthInsurance: "¿Tendrías seguro médico privado?",
      ownEducation:           "¿Estarías realizando algún tipo de formación?",
      // emergencyFundStatus: oculto en inverso
      housingPurchaseGoal:    "¿Querrías comprar una vivienda (adicional) en tu escenario ideal?",
      // consumerDebt: oculto en inverso
      // monthlyDebtPayment: condicional de consumerDebt, no aparece
      pensionRegime:          "¿A qué sistema de cotización para la jubilación te adherirías?",
    },
    summary: {
      title: "Tu perfil ideal",
      subtitle: "Revisa tu perfil ideal antes de continuar. Puedes editar cualquier sección.",
      cta: "Confirmar perfil ideal",
      footer: "Este perfil ideal se guardará en este dispositivo. Es independiente de tu perfil actual.",
    },
  },
};
