"use client";

import { useState } from "react";
import { StepStatus } from "@/components/onboarding/step-status";
import { StepActivity } from "@/components/onboarding/step-activity";
import { StepOptions } from "@/components/onboarding/step-options";
import { completeOnboarding } from "@/actions/profile";
import type { OnboardingStep1, OnboardingStep2, OnboardingStep3 } from "@/lib/validations/profile";
import { Progress } from "@/components/ui/progress";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<OnboardingStep1 | null>(null);
  const [step2Data, setStep2Data] = useState<OnboardingStep2 | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStep3Complete(data: OnboardingStep3) {
    if (!step1Data || !step2Data) return;

    setLoading(true);
    setError(null);

    try {
      await completeOnboarding({
        ...step1Data,
        ...step2Data,
        ...data,
      });
    } catch {
      setError("Une erreur est survenue. Veuillez reessayer.");
      setLoading(false);
    }
  }

  const stepLabels = [
    "Statut juridique",
    "Regime fiscal",
    "Options & situation",
  ];

  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Configurez votre profil</h1>
        <p className="mt-2 text-muted-foreground">
          En 3 etapes, nous personnalisons votre calendrier d&apos;obligations
        </p>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-muted-foreground">
          {stepLabels.map((label, i) => (
            <span
              key={label}
              className={step === i + 1 ? "font-medium text-primary" : ""}
            >
              {label}
            </span>
          ))}
        </div>
        <Progress value={(step / 3) * 100} />
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 1 && (
        <StepStatus
          onNext={(data) => {
            setStep1Data(data);
            setStep(2);
          }}
          defaultValues={step1Data ?? undefined}
        />
      )}

      {step === 2 && (
        <StepActivity
          onNext={(data) => {
            setStep2Data(data);
            setStep(3);
          }}
          onBack={() => setStep(1)}
          defaultValues={step2Data ?? undefined}
        />
      )}

      {step === 3 && (
        <StepOptions
          onComplete={handleStep3Complete}
          onBack={() => setStep(2)}
          loading={loading}
        />
      )}
    </div>
  );
}
