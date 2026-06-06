// src/lib/research/demographicsMapping.js

/**
 * Mapeo de los rangos de edad demográficos del estudio (granularidad fina) a
 * los tramos de edad del perfil del motor financiero (under35 / 35to50 / over50).
 *
 * Función pura: sin efectos secundarios, sin acceso a estado externo.
 */

const DEMOGRAPHIC_AGE_TO_PROFILE = {
  under_25: "under35",
  "25_34": "under35",
  "35_44": "35to50",
  "45_54": "35to50",
  "55_64": "over50",
  "65_plus": "over50",
};

export function mapDemographicAgeToProfile(demographicAgeRange) {
  return DEMOGRAPHIC_AGE_TO_PROFILE[demographicAgeRange] ?? null;
}
