import { getYear, addMonths } from "date-fns";
import type { UserProfile, ObligationType, ObligationFrequency } from "@/types";
import {
  getUrssafQuarterlyDates,
  getUrssafMonthlyDates,
  getCfeDueDate,
  getIncomeTaxDueDate,
  isFirstCalendarYear,
} from "../dates";

export interface ObligationSpec {
  type: ObligationType;
  label: string;
  description: string;
  frequency: ObligationFrequency;
  dueDate: Date;
}

export function generateMicroObligations(
  profile: UserProfile,
  referenceDate: Date = new Date()
): ObligationSpec[] {
  const obligations: ObligationSpec[] = [];
  const year = getYear(referenceDate);
  const nextYear = year + 1;

  // 1. Urssaf declarations
  if (profile.declarationFrequency === "quarterly") {
    const dates = [
      ...getUrssafQuarterlyDates(year),
      ...getUrssafQuarterlyDates(nextYear),
    ];
    const quarterLabels = [
      "T1 (janvier - mars)",
      "T2 (avril - juin)",
      "T3 (juillet - septembre)",
      "T4 (octobre - decembre)",
    ];
    dates.forEach((date, i) => {
      if (date >= referenceDate) {
        obligations.push({
          type: "urssaf",
          label: `Declaration Urssaf ${quarterLabels[i % 4]}`,
          description:
            "Declarez votre chiffre d'affaires du trimestre sur autoentrepreneur.urssaf.fr",
          frequency: "quarterly",
          dueDate: date,
        });
      }
    });
  } else {
    const dates = [
      ...getUrssafMonthlyDates(year),
      ...getUrssafMonthlyDates(nextYear),
    ];
    const monthNames = [
      "janvier",
      "fevrier",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "aout",
      "septembre",
      "octobre",
      "novembre",
      "decembre",
    ];
    dates.forEach((date, i) => {
      if (date >= referenceDate) {
        obligations.push({
          type: "urssaf",
          label: `Declaration Urssaf ${monthNames[i % 12]}`,
          description:
            "Declarez votre chiffre d'affaires du mois sur autoentrepreneur.urssaf.fr",
          frequency: "monthly",
          dueDate: date,
        });
      }
    });
  }

  // 2. TVA declarations (if assujetti)
  if (profile.hasTva) {
    // Simplified: monthly CA3 declarations, due ~19th of M+1
    for (let month = 0; month < 24; month++) {
      const dueDate = new Date(
        year + Math.floor((month + 1) / 12),
        (month + 1) % 12,
        19
      );
      if (dueDate >= referenceDate) {
        obligations.push({
          type: "tva",
          label: `Declaration TVA (CA3)`,
          description:
            "Declarez et payez la TVA collectee sur impots.gouv.fr",
          frequency: "monthly",
          dueDate,
        });
      }
    }
  }

  // 3. CFE (exempt first calendar year)
  if (profile.creationDate && !isFirstCalendarYear(profile.creationDate, referenceDate)) {
    const cfeDateThisYear = getCfeDueDate(year);
    const cfeDateNextYear = getCfeDueDate(nextYear);

    if (cfeDateThisYear >= referenceDate) {
      obligations.push({
        type: "cfe",
        label: `Cotisation Fonciere des Entreprises ${year}`,
        description:
          "Payez la CFE sur impots.gouv.fr (espace professionnel). Exoneree la premiere annee.",
        frequency: "annual",
        dueDate: cfeDateThisYear,
      });
    }
    obligations.push({
      type: "cfe",
      label: `Cotisation Fonciere des Entreprises ${nextYear}`,
      description:
        "Payez la CFE sur impots.gouv.fr (espace professionnel).",
      frequency: "annual",
      dueDate: cfeDateNextYear,
    });
  }

  // 4. Income tax declaration (annual)
  const taxDateThisYear = getIncomeTaxDueDate(year);
  const taxDateNextYear = getIncomeTaxDueDate(nextYear);

  if (taxDateThisYear >= referenceDate) {
    obligations.push({
      type: "income_tax",
      label: `Declaration de revenus ${year - 1}`,
      description:
        "Declarez vos revenus (formulaire 2042-C-PRO) sur impots.gouv.fr. Incluez votre CA micro-entrepreneur.",
      frequency: "annual",
      dueDate: taxDateThisYear,
    });
  }
  obligations.push({
    type: "income_tax",
    label: `Declaration de revenus ${year}`,
    description:
      "Declarez vos revenus (formulaire 2042-C-PRO) sur impots.gouv.fr.",
    frequency: "annual",
    dueDate: taxDateNextYear,
  });

  // 5. ACRE expiry alert (if ACRE active)
  if (profile.hasAcre && profile.acreEndDate) {
    const acreEnd = new Date(profile.acreEndDate);
    const alertDate = addMonths(acreEnd, -3);
    if (alertDate >= referenceDate) {
      obligations.push({
        type: "acre_expiry",
        label: "Fin de l'ACRE",
        description:
          "Votre exoneration ACRE prend fin bientot. Vos cotisations vont augmenter au taux normal. Anticipez l'impact sur votre tresorerie.",
        frequency: "one_time",
        dueDate: alertDate,
      });
    }
  }

  // Sort by due date and return only the next 12 months
  const twelveMonthsLater = addMonths(referenceDate, 12);
  return obligations
    .filter((o) => o.dueDate < twelveMonthsLater)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
