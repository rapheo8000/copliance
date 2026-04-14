export const PLANS = {
  free: {
    name: "Gratuit",
    price: 0,
    alertsPerMonth: 2,
    simulators: ["urssaf"],
    aiQuestions: 0,
    documents: 0,
  },
  pro: {
    name: "Pro",
    price: 9.9,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    alertsPerMonth: Infinity,
    simulators: ["urssaf", "tva", "acre", "projection"],
    aiQuestions: 20,
    documents: 50,
  },
  business: {
    name: "Business",
    price: 19.9,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    alertsPerMonth: Infinity,
    simulators: ["urssaf", "tva", "acre", "projection"],
    aiQuestions: Infinity,
    documents: Infinity,
  },
} as const;

export type PlanId = keyof typeof PLANS;
