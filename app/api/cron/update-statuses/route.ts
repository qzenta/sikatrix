import { NextRequest, NextResponse } from "next/server";
import { getTasksForStatusUpdate, updateTaskStatus } from "@/lib/notion";

export const runtime = "nodejs";
export const maxDuration = 60;

const COMPLETED = "\u{1F7E2} Completed";
const OVERDUE   = "\u{1F534} Overdue";
const DUE_SOON  = "\u{1F7E0} Due Soon";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().split("T")[0];

  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() + 7);
  const cutoffIso = cutoff.toISOString().split("T")[0];

  let tasks;
  try {
    tasks = await getTasksForStatusUpdate();
  } catch (err) {
    console.error("[cron/update-statuses] Fetch failed:", err);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }

  let updated = 0, skipped = 0, failed = 0;

  for (const task of tasks) {
    // Never touch completed tasks
    if (task.status === COMPLETED) { skipped++; continue; }

    let target: string;
    if (task.dueDate < todayIso) {
      target = OVERDUE;
    } else if (task.dueDate <= cutoffIso) {
      target = DUE_SOON;
    } else {
      // More than 7 days away — leave as is
      skipped++;
      continue;
    }

    // Skip if already the right status
    if (task.status === target) { skipped++; continue; }

    try {
      await updateTaskStatus(task.id, target);
      updated++;
    } catch (err) {
      console.error(`[cron/update-statuses] Failed for ${task.id}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, updated, skipped, failed, asOf: todayIso });
}
