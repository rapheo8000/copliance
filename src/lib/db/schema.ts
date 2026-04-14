import {
  pgTable,
  uuid,
  text,
  boolean,
  date,
  timestamp,
  numeric,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  legalStatus: text("legal_status"),
  activityType: text("activity_type"),
  taxRegime: text("tax_regime"),
  creationDate: date("creation_date"),
  siret: text("siret"),
  hasTva: boolean("has_tva").default(false).notNull(),
  hasAcre: boolean("has_acre").default(false).notNull(),
  acreEndDate: date("acre_end_date"),
  hasAre: boolean("has_are").default(false).notNull(),
  versementLiberatoire: boolean("versement_liberatoire").default(false).notNull(),
  declarationFrequency: text("declaration_frequency").default("quarterly").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const obligations = pgTable(
  "obligations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    frequency: text("frequency").notNull(),
    nextDueDate: date("next_due_date").notNull(),
    status: text("status").default("upcoming").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    profileIdIdx: index("obligations_profile_id_idx").on(table.profileId),
    dueDateIdx: index("obligations_due_date_idx").on(table.nextDueDate),
  })
);

export const alerts = pgTable(
  "alerts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    obligationId: uuid("obligation_id")
      .notNull()
      .references(() => obligations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    alertType: text("alert_type").notNull(),
    channel: text("channel").default("email").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    obligationIdIdx: index("alerts_obligation_id_idx").on(table.obligationId),
    statusIdx: index("alerts_status_idx").on(table.status),
  })
);

export const declarations = pgTable(
  "declarations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    period: text("period").notNull(),
    revenueAmount: numeric("revenue_amount", { precision: 12, scale: 2 }),
    contributionsAmount: numeric("contributions_amount", {
      precision: 12,
      scale: 2,
    }),
    status: text("status").default("draft").notNull(),
    declaredAt: timestamp("declared_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    profileIdIdx: index("declarations_profile_id_idx").on(table.profileId),
  })
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().unique(),
    plan: text("plan").default("free").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text("status").default("active").notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    stripeCustomerIdx: index("subscriptions_stripe_customer_idx").on(
      table.stripeCustomerId
    ),
  })
);

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  type: text("type"),
  filename: text("filename").notNull(),
  storagePath: text("storage_path").notNull(),
  ocrData: jsonb("ocr_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
