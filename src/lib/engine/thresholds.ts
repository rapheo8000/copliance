// French regulatory thresholds (2025-2026)
// Updated annually when regulations change

export const THRESHOLDS = {
  // Micro-entrepreneur CA ceilings
  MICRO_SERVICES: 77_700,
  MICRO_VENTE: 188_700,

  // TVA franchise en base thresholds
  TVA_SERVICES: 37_500,
  TVA_VENTE: 85_000,
  TVA_SERVICES_TOLERANCE: 41_250,
  TVA_VENTE_TOLERANCE: 93_500,

  // Versement liberatoire RFR threshold (per fiscal part)
  VERSEMENT_LIBERATOIRE_RFR: 28_797,
} as const;

// Micro-entrepreneur cotisation rates
export const COTISATION_RATES = {
  // Standard rates
  commercial_vente: 0.123,
  commercial_service: 0.213,
  liberal: 0.232,
  artisanal: 0.213,
  commercial: 0.213, // Default to service for generic commercial

  // ACRE rates (50% reduction first year)
  acre: {
    commercial_vente: 0.062,
    commercial_service: 0.107,
    liberal: 0.116,
    artisanal: 0.107,
    commercial: 0.107,
  },
} as const;

// Versement liberatoire rates
export const VL_RATES = {
  commercial_vente: 0.01,
  commercial_service: 0.017,
  liberal: 0.022,
  artisanal: 0.017,
  commercial: 0.017,
} as const;

// CFP (Contribution a la Formation Professionnelle)
export const CFP_RATES = {
  commercial_vente: 0.001,
  commercial_service: 0.002,
  liberal: 0.002,
  artisanal: 0.003,
  commercial: 0.002,
} as const;

export type ActivityRateKey = keyof typeof COTISATION_RATES.acre;
