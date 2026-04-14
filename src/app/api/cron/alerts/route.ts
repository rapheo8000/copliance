import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResend, FROM_EMAIL } from "@/lib/resend/client";
import AlertReminder from "@/../emails/alert-reminder";
import { format, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

// Use service role key to bypass RLS (reads across all users)
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const today = new Date();
  const alertDays = [
    { days: 7, type: "j_7" as const },
    { days: 3, type: "j_3" as const },
    { days: 1, type: "j_1" as const },
  ];

  let totalSent = 0;
  let errors = 0;

  for (const { days, type } of alertDays) {
    const targetDate = addDays(today, days);
    const targetDateStr = format(targetDate, "yyyy-MM-dd");

    // Find obligations due on this date
    const { data: obligations } = await supabase
      .from("obligations")
      .select(`
        id, label, description, next_due_date, profile_id,
        profiles!inner(user_id, email, full_name)
      `)
      .eq("next_due_date", targetDateStr)
      .neq("status", "completed");

    if (!obligations || obligations.length === 0) continue;

    for (const obligation of obligations) {
      // Check if alert already sent for this obligation + type
      const { data: existingAlert } = await supabase
        .from("alerts")
        .select("id")
        .eq("obligation_id", obligation.id)
        .eq("alert_type", type)
        .eq("status", "sent")
        .single();

      if (existingAlert) continue;

      // Get profile data
      const profile = (obligation as Record<string, unknown>).profiles as { email?: string; full_name?: string; user_id: string } | null;
      if (!profile?.email) continue;

      try {
        // Send email
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: profile.email,
          subject: `${type === "j_1" ? "URGENT: " : "Rappel: "}${obligation.label}`,
          react: AlertReminder({
            userName: profile.full_name || "Entrepreneur",
            obligationLabel: obligation.label,
            dueDate: format(parseISO(obligation.next_due_date), "d MMMM yyyy", {
              locale: fr,
            }),
            alertType: type,
            description: obligation.description || undefined,
          }),
        });

        // Record alert as sent
        await supabase.from("alerts").insert({
          obligation_id: obligation.id,
          user_id: profile.user_id,
          alert_type: type,
          channel: "email",
          sent_at: new Date().toISOString(),
          status: "sent",
        });

        totalSent++;
      } catch (err) {
        console.error(`Failed to send alert for obligation ${obligation.id}:`, err);
        errors++;

        // Record failed alert
        await supabase.from("alerts").insert({
          obligation_id: obligation.id,
          user_id: profile.user_id,
          alert_type: type,
          channel: "email",
          status: "failed",
        });
      }
    }
  }

  // Mark overdue obligations
  const todayStr = format(today, "yyyy-MM-dd");
  await supabase
    .from("obligations")
    .update({ status: "overdue" })
    .lt("next_due_date", todayStr)
    .eq("status", "upcoming");

  return NextResponse.json({
    ok: true,
    sent: totalSent,
    errors,
    timestamp: new Date().toISOString(),
  });
}
