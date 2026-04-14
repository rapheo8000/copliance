-- Copliance Initial Schema
-- This migration creates the core tables for the Copliance MVP

-- Profiles table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  legal_status TEXT CHECK (legal_status IN ('micro', 'ei', 'eurl', 'sasu')),
  activity_type TEXT CHECK (activity_type IN (
    'liberal', 'commercial', 'artisanal', 'commercial_vente', 'commercial_service'
  )),
  tax_regime TEXT CHECK (tax_regime IN (
    'micro_fiscal', 'reel_simplifie', 'reel_normal', 'is'
  )),
  creation_date DATE,
  siret TEXT,
  has_tva BOOLEAN NOT NULL DEFAULT FALSE,
  has_acre BOOLEAN NOT NULL DEFAULT FALSE,
  acre_end_date DATE,
  has_are BOOLEAN NOT NULL DEFAULT FALSE,
  versement_liberatoire BOOLEAN NOT NULL DEFAULT FALSE,
  declaration_frequency TEXT NOT NULL DEFAULT 'quarterly'
    CHECK (declaration_frequency IN ('monthly', 'quarterly')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Obligations table
CREATE TABLE IF NOT EXISTS public.obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'urssaf', 'tva', 'cfe', 'income_tax', 'liasse_fiscale',
    'dsi', 'dsn', 'acre_expiry', 'tva_threshold', 'micro_ceiling'
  )),
  label TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN (
    'monthly', 'quarterly', 'annual', 'one_time'
  )),
  next_due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN (
    'upcoming', 'due_soon', 'overdue', 'completed'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_id UUID NOT NULL REFERENCES public.obligations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('j_7', 'j_3', 'j_1')),
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'push')),
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Declarations table
CREATE TABLE IF NOT EXISTS public.declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  revenue_amount NUMERIC(12,2),
  contributions_amount NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'declared', 'paid')),
  declared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'past_due', 'canceled', 'trialing', 'incomplete'
  )),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents table (minimal for MVP)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  ocr_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS obligations_profile_id_idx ON public.obligations(profile_id);
CREATE INDEX IF NOT EXISTS obligations_due_date_idx ON public.obligations(next_due_date);
CREATE INDEX IF NOT EXISTS alerts_obligation_id_idx ON public.alerts(obligation_id);
CREATE INDEX IF NOT EXISTS alerts_status_idx ON public.alerts(status);
CREATE INDEX IF NOT EXISTS declarations_profile_id_idx ON public.declarations(profile_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_idx ON public.subscriptions(stripe_customer_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles: users can manage their own profile
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Obligations: users see only their own
CREATE POLICY obligations_select_own ON public.obligations
  FOR SELECT USING (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY obligations_insert_own ON public.obligations
  FOR INSERT WITH CHECK (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY obligations_update_own ON public.obligations
  FOR UPDATE USING (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY obligations_delete_own ON public.obligations
  FOR DELETE USING (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- Alerts
CREATE POLICY alerts_select_own ON public.alerts
  FOR SELECT USING (user_id = auth.uid());

-- Declarations
CREATE POLICY declarations_select_own ON public.declarations
  FOR SELECT USING (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY declarations_insert_own ON public.declarations
  FOR INSERT WITH CHECK (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY declarations_update_own ON public.declarations
  FOR UPDATE USING (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- Subscriptions
CREATE POLICY subscriptions_select_own ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY subscriptions_update_own ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- Documents
CREATE POLICY documents_select_own ON public.documents
  FOR SELECT USING (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));
CREATE POLICY documents_insert_own ON public.documents
  FOR INSERT WITH CHECK (profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- Auto-create profile and subscription on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
