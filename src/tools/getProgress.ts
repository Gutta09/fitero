import { planQueries, logQueries } from "../db/index.js";
import type { GetProgressInput } from "./schemas.js";

export function getProgress(input: GetProgressInput) {
  const activePlan = planQueries.getActive.get();

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - input.weeks * 7);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const logs = logQueries.getSince.all(cutoffStr);

  const parsedLogs = logs.map((log) => ({
    date: log.date,
    focus: log.focus,
    exercises: JSON.parse(log.exercises) as {
      name: string;
      sets_completed: number;
      reps: string;
      weight_kg?: number;
    }[],
    session_notes: log.session_notes,
  }));

  const sessionsByWeek: Record<string, number> = {};
  for (const log of parsedLogs) {
    const weekStart = getWeekStart(log.date);
    sessionsByWeek[weekStart] = (sessionsByWeek[weekStart] ?? 0) + 1;
  }

  const plannedPerWeek = activePlan?.days_per_week ?? null;

  return {
    weeks_analyzed: input.weeks,
    total_sessions: parsedLogs.length,
    planned_sessions_per_week: plannedPerWeek,
    sessions_by_week: sessionsByWeek,
    recent_logs: parsedLogs.slice(0, 10),
    active_plan: activePlan
      ? {
          goal: activePlan.goal,
          level: activePlan.level,
          days_per_week: activePlan.days_per_week,
          schedule: JSON.parse(activePlan.schedule),
        }
      : null,
  };
}

function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  return d.toISOString().slice(0, 10);
}
