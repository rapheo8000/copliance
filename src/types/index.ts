export type LegalStatus = "micro" | "ei" | "eurl" | "sasu";

export type ActivityType =
  | "liberal"
  | "commercial"
  | "artisanal"
  | "commercial_vente"
  | "commercial_service";

export type TaxRegime =
  | "micro_fiscal"
  | "reel_simplifie"
  | "reel_normal"
  | "is";

export type DeclarationFrequency = "monthly" | "quarterly";

export type ObligationType =
  | "urssaf"
  | "tva"
  | "cfe"
  | "income_tax"
  | "liasse_fiscale"
  | "dsi"
  | "dsn"
  | "acre_expiry"
  | "tva_threshold"
  | "micro_ceiling";

export type ObligationStatus =
  | "upcoming"
  | "due_soon"
  | "overdue"
  | "completed";

export type ObligationFrequency =
  | "monthly"
  | "quarterly"
  | "annual"
  | "one_time";

export type AlertType = "j_7" | "j_3" | "j_1";
export type AlertChannel = "email" | "sms" | "push";
export type AlertStatus = "pending" | "sent" | "failed";

export type SubscriptionPlan = "free" | "pro" | "business";
export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete";

export type DeclarationStatus = "draft" | "declared" | "paid";

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  legalStatus: LegalStatus | null;
  activityType: ActivityType | null;
  taxRegime: TaxRegime | null;
  creationDate: Date | null;
  siret: string | null;
  hasTva: boolean;
  hasAcre: boolean;
  acreEndDate: Date | null;
  hasAre: boolean;
  versementLiberatoire: boolean;
  declarationFrequency: DeclarationFrequency;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Obligation {
  id: string;
  profileId: string;
  type: ObligationType;
  label: string;
  description: string | null;
  frequency: ObligationFrequency;
  nextDueDate: Date;
  status: ObligationStatus;
  createdAt: Date;
}

export interface Alert {
  id: string;
  obligationId: string;
  userId: string;
  alertType: AlertType;
  channel: AlertChannel;
  sentAt: Date | null;
  status: AlertStatus;
  createdAt: Date;
}

export interface Declaration {
  id: string;
  profileId: string;
  period: string;
  revenueAmount: number | null;
  contributionsAmount: number | null;
  status: DeclarationStatus;
  declaredAt: Date | null;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
