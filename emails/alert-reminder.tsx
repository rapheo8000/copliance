import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface AlertReminderProps {
  userName: string;
  obligationLabel: string;
  dueDate: string;
  alertType: "j_7" | "j_3" | "j_1";
  description?: string;
}

const ALERT_LABELS = {
  j_7: "dans 7 jours",
  j_3: "dans 3 jours",
  j_1: "demain",
};

const URGENCY_COLORS = {
  j_7: "#3b82f6",
  j_3: "#f59e0b",
  j_1: "#ef4444",
};

export default function AlertReminder({
  userName = "Entrepreneur",
  obligationLabel = "Declaration Urssaf T1",
  dueDate = "30 avril 2026",
  alertType = "j_7",
  description = "",
}: AlertReminderProps) {
  const urgencyLabel = ALERT_LABELS[alertType];
  const color = URGENCY_COLORS[alertType];

  return (
    <Html>
      <Head />
      <Preview>
        {alertType === "j_1" ? "URGENT: " : "Rappel: "}
        {obligationLabel} - echeance {urgencyLabel}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            <span style={{ color }}>
              {alertType === "j_1" ? "URGENT" : "Rappel"}
            </span>
          </Heading>

          <Text style={text}>Bonjour {userName},</Text>

          <Text style={text}>
            Votre echeance <strong>{obligationLabel}</strong> arrive{" "}
            <strong style={{ color }}>{urgencyLabel}</strong> (le {dueDate}).
          </Text>

          {description && (
            <Text style={textMuted}>{description}</Text>
          )}

          <Section style={buttonSection}>
            <Button
              style={button}
              href="https://app.copliance.fr/dashboard"
            >
              Voir dans Copliance
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Copliance - Le copilote administratif des entrepreneurs
          </Text>
          <Text style={footerSmall}>
            Vous recevez cet email car vous avez un compte Copliance.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700" as const,
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const textMuted = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#666",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "24px 0",
};

const footer = {
  fontSize: "13px",
  color: "#999",
  textAlign: "center" as const,
};

const footerSmall = {
  fontSize: "11px",
  color: "#bbb",
  textAlign: "center" as const,
};
